package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.CustomerNotice;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.mapper.pig.PigOrderMapper;
import com.ruoyi.system.service.pig.ICustomerNoticeService;
import com.ruoyi.system.service.pig.IPigOrderService;
import com.ruoyi.system.service.pig.IUserBidService;

/**
 * 订单 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PigOrderServiceImpl implements IPigOrderService
{
    @Autowired
    private PigOrderMapper pigOrderMapper;

    @Autowired
    private IUserBidService userBidService;

    @Autowired
    private ICustomerNoticeService customerNoticeService;

    @Override
    public List<PigOrder> selectPigOrderList(PigOrder pigOrder)
    {
        return pigOrderMapper.selectPigOrderList(pigOrder);
    }

    @Override
    public PigOrder selectPigOrderById(Long id)
    {
        return pigOrderMapper.selectPigOrderById(id);
    }

    @Override
    public int insertPigOrder(PigOrder pigOrder)
    {
        pigOrder.setOrderNo(generateOrderNo());
        if (StringUtils.isBlank(pigOrder.getPayStatus())) {
            pigOrder.setPayStatus("UNPAID");
        }
        return pigOrderMapper.insertPigOrder(pigOrder);
    }

    @Override
    public int updatePigOrder(PigOrder pigOrder)
    {
        if (pigOrder == null || pigOrder.getId() == null)
        {
            return pigOrderMapper.updatePigOrder(pigOrder);
        }

        PigOrder before = pigOrderMapper.selectPigOrderById(pigOrder.getId());
        int rows = pigOrderMapper.updatePigOrder(pigOrder);
        if (rows > 0 && before != null)
        {
            emitOrderNotices(before, pigOrder);
        }
        return rows;
    }

    @Override
    public int deletePigOrderById(Long id)
    {
        return pigOrderMapper.deletePigOrderById(id);
    }

    @Override
    public int deletePigOrderByIds(Long[] ids)
    {
        return pigOrderMapper.deletePigOrderByIds(ids);
    }

    @Override
    public String generateOrderNo()
    {
        Long maxId = pigOrderMapper.selectMaxId();
        long nextId = maxId == null ? 1L : maxId + 1L;
        return "ORDER-" + String.format("%012d", nextId);
    }

    private void emitOrderNotices(PigOrder before, PigOrder update)
    {
        Long orderId = before.getId();
        Long userId = resolveOrderUserId(before);
        if (orderId == null || userId == null)
        {
            return;
        }

        String oldStatus = before.getOrderStatus();
        String newStatus = update.getOrderStatus() != null ? update.getOrderStatus() : oldStatus;

        if ("WAIT_CONFIRM".equalsIgnoreCase(oldStatus)
            && "WAIT_PAY".equalsIgnoreCase(newStatus)
            && update.getOrderCreateEventTime() != null)
        {
            createOrderNotice(userId, orderId, "ORDER_CREATED", "订单生成通知", "您的订单已生成，请及时完成付款。", "ORDER_CREATED_" + orderId);
        }

        if ("WAIT_SHIP".equalsIgnoreCase(oldStatus)
            && "WAIT_RECEIVE".equalsIgnoreCase(newStatus)
            && update.getShipEventTime() != null)
        {
            createOrderNotice(userId, orderId, "ORDER_SHIPPED", "订单发货通知", "您的订单已发货，请关注物流并及时收货。", "ORDER_SHIPPED_" + orderId);
        }

        if (!"COMPLETED".equalsIgnoreCase(oldStatus)
            && "COMPLETED".equalsIgnoreCase(newStatus)
            && update.getCompletedEventTime() != null)
        {
            createOrderNotice(userId, orderId, "ORDER_COMPLETED", "订单完成通知", "您的订单已完成，感谢您的使用。", "ORDER_COMPLETED_" + orderId);
        }
    }

    private void createOrderNotice(Long userId, Long orderId, String eventType, String title, String content, String sourceEventId)
    {
        CustomerNotice notice = new CustomerNotice();
        notice.setUserId(userId);
        notice.setBizType("ORDER");
        notice.setEventType(eventType);
        notice.setTitle(title);
        notice.setContent(content);
        notice.setTargetType("ORDER");
        notice.setTargetId(orderId);
        notice.setTargetRoute("order-detail");
        notice.setPayload("{\"orderId\":" + orderId + "}");
        notice.setReadStatus(0);
        notice.setIsDeleted(0);
        notice.setSourceEventId(sourceEventId);
        notice.setCreateBy("system");
        customerNoticeService.createNoticeIfAbsent(notice);
    }

    private Long resolveOrderUserId(PigOrder order)
    {
        if (order == null)
        {
            return null;
        }
        if (order.getUserBidId() != null)
        {
            UserBid bid = userBidService.selectUserBidById(order.getUserBidId());
            if (bid != null && bid.getUserId() != null)
            {
                return bid.getUserId();
            }
        }
        if (StringUtils.isNumeric(order.getCreateBy()))
        {
            return Long.valueOf(order.getCreateBy());
        }
        return null;
    }
}
