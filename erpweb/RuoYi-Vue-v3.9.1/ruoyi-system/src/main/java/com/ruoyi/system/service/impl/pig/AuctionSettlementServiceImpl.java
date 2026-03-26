package com.ruoyi.system.service.impl.pig;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimerTask;

import com.ruoyi.system.manager.AsyncManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.domain.pig.BusinessMessage;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.domain.pig.UserBidInfo;
import com.ruoyi.system.mapper.pig.BidProductMapper;
import com.ruoyi.system.mapper.pig.PigOrderMapper;
import com.ruoyi.system.mapper.pig.UserBidMapper;
import com.ruoyi.system.service.pig.IAuctionSettlementService;
import com.ruoyi.system.service.pig.IBusinessMessageService;
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
    private static final Logger log = LoggerFactory.getLogger(AuctionSettlementServiceImpl.class);

    @Autowired
    private BidProductMapper bidProductMapper;

    @Autowired
    private UserBidMapper userBidMapper;

    @Autowired
    private PigOrderMapper pigOrderMapper;

    @Autowired
    private IUserBidService userBidService;

    @Autowired
    private IUserBidInfoService userBidInfoService;

    @Autowired
    private IPigOrderService pigOrderService;

    @Autowired
    private IBusinessMessageService businessMessageService;

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
        order.setOrderStatus("WAITING");
        order.setOrderSource("BID");
        order.setEnterpriseId(bid.getEnterpriseId());
        order.setBidProductId(product.getId());
        order.setUserBidId(bid.getId());
        order.
        order.setPigResourceId(product.getPigResourceId());
        fillOrderMaintenanceInfo(order, bid.getUserId(), product.getId());

        BigDecimal price = bid.getPrice() == null ? BigDecimal.ZERO : bid.getPrice();
        order.setBidQuantity(allocated);
        order.setOrderAmount(price.multiply(new BigDecimal(allocated)));
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
        order.setExpectLoadTime(info.getLoadingTime());
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
                String content = buildSuccessMessage(bid, product, allocated);
                sendSiteMessage(bid.getUserId(), "BID_SUCCESS", content);
                sendWeChatMessage(bid.getUserId(), content);
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
                String content = buildFailedMessage(product);
                sendSiteMessage(bid.getUserId(), "BID_FAILED", content);
                sendWeChatMessage(bid.getUserId(), content);
            }
        });
    }

    private String buildSuccessMessage(UserBid bid, BidProduct product, int allocated)
    {
        BigDecimal price = bid.getPrice() == null ? BigDecimal.ZERO : bid.getPrice();
        BigDecimal amount = price.multiply(new BigDecimal(allocated));
        String code = product.getBidProductCode() == null ? String.valueOf(product.getId()) : product.getBidProductCode();
        return "竞拍成功，商品" + code + "已生成待付款订单，数量" + allocated + "头，单价" + price + "元/kg，金额" + amount + "元。";
    }

    private String buildFailedMessage(BidProduct product)
    {
        String code = product.getBidProductCode() == null ? String.valueOf(product.getId()) : product.getBidProductCode();
        return "竞拍失败，商品" + code + "未获得订单。";
    }

    private void sendSiteMessage(Long userId, String type, String content)
    {
        if (userId == null)
        {
            return;
        }
        BusinessMessage message = new BusinessMessage();
        message.setUserId(userId);
        message.setMessageType(type);
        message.setMessageContent(content);
        message.setIsRead(0);
        message.setCreateBy("system");
        businessMessageService.insertBusinessMessage(message);
    }

    private void sendWeChatMessage(Long userId, String content)
    {
        if (userId == null)
        {
            return;
        }
        BusinessMessage message = new BusinessMessage();
        message.setUserId(userId);
        message.setMessageType("WECHAT");
        message.setMessageContent(content);
        message.setIsRead(0);
        message.setCreateBy("system");
        businessMessageService.insertBusinessMessage(message);
        log.info("[WeChat] send placeholder message to userId={}, content={}", userId, content);
    }
}
