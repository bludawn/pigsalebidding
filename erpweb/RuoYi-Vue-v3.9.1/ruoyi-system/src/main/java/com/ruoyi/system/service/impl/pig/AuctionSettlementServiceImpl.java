package com.ruoyi.system.service.impl.pig;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimerTask;

import com.ruoyi.system.manager.AsyncManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.domain.pig.CustomerNotice;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.domain.pig.PigResource;
import com.ruoyi.system.domain.pig.PigType;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.domain.pig.UserBidInfo;
import com.ruoyi.system.mapper.pig.BidProductMapper;
import com.ruoyi.system.mapper.pig.PigOrderMapper;
import com.ruoyi.system.mapper.pig.PigResourceMapper;
import com.ruoyi.system.mapper.pig.PigTypeMapper;
import com.ruoyi.system.mapper.pig.UserBidMapper;
import com.ruoyi.system.service.pig.IAuctionSettlementService;
import com.ruoyi.system.service.pig.ICustomerNoticeService;
import com.ruoyi.system.service.pig.IPigOrderService;
import com.ruoyi.system.service.pig.IUserBidInfoService;
import com.ruoyi.system.service.pig.IUserBidService;

/**
 * 竞拍结算 Service业务层处理
 *
 * @author ruoyi
 */
@Service
public class AuctionSettlementServiceImpl implements IAuctionSettlementService
{

    @Autowired
    private BidProductMapper bidProductMapper;

    @Autowired
    private UserBidMapper userBidMapper;

    @Autowired
    private PigOrderMapper pigOrderMapper;

    @Autowired
    private PigResourceMapper pigResourceMapper;

    @Autowired
    private PigTypeMapper pigTypeMapper;

    @Autowired
    private IUserBidService userBidService;

    @Autowired
    private IUserBidInfoService userBidInfoService;

    @Autowired
    private IPigOrderService pigOrderService;

    @Autowired
    private ICustomerNoticeService customerNoticeService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int settleExpiredAuctions()
    {
        List<BidProduct> expired = bidProductMapper.selectExpiredBidProducts(new Date());
        if (expired == null || expired.isEmpty())
        {
            return 0;
        }
        int settledCount = 0;
        for (BidProduct product : expired)
        {
            if (product == null || product.getId() == null)
            {
                continue;
            }
            settleSingleAuction(product);
            settledCount++;
        }
        return settledCount;
    }

    private void settleSingleAuction(BidProduct product)
    {
        Integer totalHeadCount = product.getTotalHeadCount();
        int remaining = totalHeadCount == null ? 0 : totalHeadCount;
        List<UserBid> bids = userBidMapper.selectUserBidsForSettlement(product.getId());

        if (remaining <= 0 || bids == null || bids.isEmpty())
        {
            markAuctionEnded(product);
            return;
        }

        Set<Long> successBidIds = new HashSet<>();

        for (UserBid bid : bids)
        {
            if (remaining <= 0)
            {
                break;
            }
            if (bid == null || bid.getId() == null)
            {
                continue;
            }
            int bidQuantity = bid.getQuantity() == null ? 0 : bid.getQuantity();
            if (bidQuantity <= 0)
            {
                continue;
            }

            int allocated = Math.min(remaining, bidQuantity);
            if (allocated <= 0)
            {
                continue;
            }

            boolean created = createOrderIfNeeded(product, bid, allocated);
            updateBidToSuccess(bid, allocated);
            successBidIds.add(bid.getId());
            remaining -= allocated;

            if (created)
            {
                sendSuccessNoticeAsync(bid, product, allocated);
            }
        }

        for (UserBid bid : bids)
        {
            if (bid == null || bid.getId() == null)
            {
                continue;
            }
            if (successBidIds.contains(bid.getId()))
            {
                continue;
            }
            updateBidToFailed(bid);
            sendFailedNoticeAsync(bid, product);
        }

        markAuctionEnded(product);
    }

    private boolean createOrderIfNeeded(BidProduct product, UserBid bid, int allocated)
    {
        PigOrder existing = pigOrderMapper.selectPigOrderByUserBidId(bid.getId());
        if (existing != null)
        {
            return false;
        }

        PigOrder order = new PigOrder();
        Date now = new Date();
        order.setOrderStatus("WAIT_CONFIRM");
        order.setOrderSource("BID");
        order.setEnterpriseId(bid.getEnterpriseId());
        order.setBidProductId(product.getId());
        order.setUserBidId(bid.getId());
        order.setPigResourceId(product.getPigResourceId());
        fillOrderMaintenanceInfo(order, bid.getUserId(), product.getId());

        BigDecimal price = bid.getPrice() == null ? BigDecimal.ZERO : bid.getPrice();
        order.setUnitPrice(price);
        order.setBidQuantity(allocated);
        order.setBidEventTime(bid.getBidTime());
        order.setBidSuccessEventTime(now);
        order.setCreateBy(String.valueOf(bid.getUserId()));

        pigOrderService.insertPigOrder(order);
        return true;
    }

    private void fillOrderMaintenanceInfo(PigOrder order, Long userId, Long bidProductId)
    {
        if (userId == null || bidProductId == null)
        {
            return;
        }
        UserBidInfo query = new UserBidInfo();
        query.setUserId(userId);
        query.setBidProductId(bidProductId);
        List<UserBidInfo> infos = userBidInfoService.selectUserBidInfoList(query);
        if (infos == null || infos.isEmpty())
        {
            return;
        }
        UserBidInfo info = infos.get(0);
        order.setAddressId(info.getAddressId());
        order.setExpectedDeliveryTime(info.getExpectedDeliveryTime());
        String remark = info.getRemark();
        if (StringUtils.isNotEmpty(remark))
        {
            order.setRemark(remark);
        }
    }

    private void updateBidToSuccess(UserBid bid, int allocated)
    {
        UserBid update = new UserBid();
        update.setId(bid.getId());
        update.setStatus("BID_SUCCESS");
        update.setUpdateBy("system");
        if (bid.getPrice() != null)
        {
            update.setTotalPrice(bid.getPrice().multiply(new BigDecimal(allocated)));
        }
        userBidService.updateUserBid(update);
    }

    private void updateBidToFailed(UserBid bid)
    {
        UserBid update = new UserBid();
        update.setId(bid.getId());
        update.setStatus("BID_FAILED");
        update.setUpdateBy("system");
        userBidService.updateUserBid(update);
    }

    private void markAuctionEnded(BidProduct product)
    {
        BidProduct update = new BidProduct();
        update.setId(product.getId());
        update.setBidStatus("ENDED");
        update.setUpdateBy("system");
        bidProductMapper.updateBidProduct(update);
    }

    private void sendSuccessNoticeAsync(UserBid bid, BidProduct product, int allocated)
    {
        AsyncManager.me().execute(new TimerTask()
        {
            @Override
            public void run()
            {
                createBidNotice(bid, product, "BID_SUCCESS", "竞拍成功通知", buildSuccessMessage(bid, product, allocated));
            }
        });
    }

    private void sendFailedNoticeAsync(UserBid bid, BidProduct product)
    {
        AsyncManager.me().execute(new TimerTask()
        {
            @Override
            public void run()
            {
                createBidNotice(bid, product, "BID_FAILED", "竞拍失败通知", buildFailedMessage(product));
            }
        });
    }

    private void createBidNotice(UserBid bid, BidProduct product, String eventType, String title, String content)
    {
        if (bid == null || bid.getUserId() == null || product == null || product.getId() == null)
        {
            return;
        }
        CustomerNotice notice = new CustomerNotice();
        notice.setUserId(bid.getUserId());
        notice.setBizType("BID");
        notice.setEventType(eventType);
        notice.setTitle(title);
        notice.setContent(content);
        notice.setTargetType("AUCTION");
        notice.setTargetId(product.getId());
        notice.setTargetRoute("auction-detail");
        notice.setPayload(buildBidPayload(product));
        notice.setReadStatus(0);
        notice.setIsDeleted(0);
        notice.setSourceEventId(eventType + "_" + bid.getId());
        notice.setCreateBy("system");
        customerNoticeService.createNoticeIfAbsent(notice);
    }

    private String buildSuccessMessage(UserBid bid, BidProduct product, int allocated)
    {
        BigDecimal price = bid.getPrice() == null ? BigDecimal.ZERO : bid.getPrice();
        BigDecimal amount = calculateEstimatedTotalPrice(price, allocated, product);
        String code = product.getBidProductCode() == null ? String.valueOf(product.getId()) : product.getBidProductCode();
        return "竞拍成功，商品" + code + "已生成待付款订单，数量" + allocated + "头，单价" + price + "元/kg，预计总价" + amount + "元。";
    }

    private BigDecimal calculateEstimatedTotalPrice(BigDecimal bidPrice, int bidCount, BidProduct product)
    {
        BigDecimal safePrice = bidPrice == null ? BigDecimal.ZERO : bidPrice;
        BigDecimal base = safePrice.multiply(BigDecimal.valueOf(Math.max(bidCount, 0L)));
        BigDecimal avgWeight = resolveAverageWeight(product);
        if (avgWeight.compareTo(BigDecimal.ZERO) <= 0)
        {
            return base.setScale(2, RoundingMode.HALF_UP);
        }
        return base.multiply(avgWeight).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveAverageWeight(BidProduct product)
    {
        if (product == null || product.getPigResourceId() == null)
        {
            return BigDecimal.ZERO;
        }
        PigResource pigResource = pigResourceMapper.selectPigResourceById(product.getPigResourceId());
        if (pigResource == null || pigResource.getPigTypeId() == null)
        {
            return BigDecimal.ZERO;
        }
        PigType pigType = pigTypeMapper.selectPigTypeById(pigResource.getPigTypeId());
        if (pigType == null)
        {
            return BigDecimal.ZERO;
        }
        return parseAverageWeightRange(pigType.getWeightRange());
    }

    private BigDecimal parseAverageWeightRange(String weightRange)
    {
        if (StringUtils.isEmpty(weightRange))
        {
            return BigDecimal.ZERO;
        }
        String normalized = weightRange.split("/")[0].trim();
        String[] parts = normalized.split("-");
        if (parts.length < 2)
        {
            return BigDecimal.ZERO;
        }
        try
        {
            BigDecimal min = new BigDecimal(parts[0].trim());
            BigDecimal max = new BigDecimal(parts[1].trim());
            return min.add(max).divide(BigDecimal.valueOf(2), 6, RoundingMode.HALF_UP);
        }
        catch (Exception e)
        {
            return BigDecimal.ZERO;
        }
    }

    private String buildFailedMessage(BidProduct product)
    {
        String code = product.getBidProductCode() == null ? String.valueOf(product.getId()) : product.getBidProductCode();
        return "竞拍失败，商品" + code + "未获得订单。";
    }

    private String buildBidPayload(BidProduct product)
    {
        String code = product.getBidProductCode() == null ? "" : product.getBidProductCode();
        return "{\"auctionId\":" + product.getId() + ",\"bidProductCode\":\"" + code + "\"}";
    }
}
