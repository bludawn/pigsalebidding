package com.ruoyi.web.controller.pig;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.service.pig.IBidProductService;
import com.ruoyi.system.service.pig.IPigOrderService;
import com.ruoyi.system.service.pig.IUserBidService;

/**
 * 生猪业务首页聚合统计
 */
@RestController
@RequestMapping("/pig/dashboard")
public class PigDashboardController extends BaseController
{
    @Autowired
    private IPigOrderService pigOrderService;

    @Autowired
    private IBidProductService bidProductService;

    @Autowired
    private IUserBidService userBidService;

    @GetMapping("/overview")
    public AjaxResult overview()
    {
        Date now = new Date();
        Date todayStart = startOfDay(now);
        Date monthStart = startOfMonth(now);

        List<PigOrder> orders = pigOrderService.selectPigOrderList(new PigOrder());
        Map<String, Long> orderStatusCounts = buildOrderStatusCounts();
        BigDecimal pendingReceivableAmount = BigDecimal.ZERO;
        BigDecimal monthlyCompletedIncome = BigDecimal.ZERO;
        long todayNewOrderCount = 0L;

        for (PigOrder order : orders)
        {
            String status = normalizeStatus(order.getOrderStatus());
            if (orderStatusCounts.containsKey(status))
            {
                orderStatusCounts.put(status, orderStatusCounts.get(status) + 1);
            }

            pendingReceivableAmount = pendingReceivableAmount.add(calcPendingReceivable(order, status));

            Date completedTime = order.getCompletedEventTime() != null ? order.getCompletedEventTime() : order.getUpdateTime();
            if ("COMPLETED".equals(status) && completedTime != null && !completedTime.before(monthStart))
            {
                monthlyCompletedIncome = monthlyCompletedIncome.add(safeAdd(order.getOrderAmount(), order.getFreightAmount()));
            }

            if (order.getCreateTime() != null && !order.getCreateTime().before(todayStart))
            {
                todayNewOrderCount++;
            }
        }

        List<BidProduct> bidProducts = bidProductService.selectBidProductList(new BidProduct());
        long currentBiddingProductCount = bidProducts.stream()
            .filter(item -> "BIDDING".equals(normalizeStatus(item.getBidStatus())))
            .count();
        int currentBiddingPigCount = bidProducts.stream()
            .filter(item -> "BIDDING".equals(normalizeStatus(item.getBidStatus())))
            .mapToInt(item -> item.getTotalHeadCount() == null ? 0 : item.getTotalHeadCount())
            .sum();

        List<UserBid> bids = userBidService.selectUserBidList(new UserBid());
        List<UserBid> validBids = bids.stream()
            .filter(item -> !"CANCELED".equals(normalizeStatus(item.getStatus())))
            .collect(Collectors.toList());
        long totalBidRecordCount = validBids.size();
        Set<Long> participantUsers = validBids.stream()
            .map(UserBid::getUserId)
            .filter(item -> item != null)
            .collect(Collectors.toSet());
        long participantUserCount = participantUsers.size();
        long todayBidCount = validBids.stream()
            .filter(item -> item.getCreateTime() != null && !item.getCreateTime().before(todayStart))
            .count();

        Map<String, Object> data = new LinkedHashMap<String, Object>();
        data.put("orderStatusCounts", orderStatusCounts);
        data.put("pendingReceivableAmount", pendingReceivableAmount);
        data.put("monthlyCompletedIncome", monthlyCompletedIncome);
        data.put("orderTotalCount", orders.size());
        data.put("todayNewOrderCount", todayNewOrderCount);

        data.put("currentBiddingProductCount", currentBiddingProductCount);
        data.put("totalBidRecordCount", totalBidRecordCount);
        data.put("currentBiddingPigCount", currentBiddingPigCount);
        data.put("participantUserCount", participantUserCount);
        data.put("todayBidCount", todayBidCount);

        return success(data);
    }

    private Map<String, Long> buildOrderStatusCounts()
    {
        Map<String, Long> result = new LinkedHashMap<String, Long>();
        result.put("WAIT_CONFIRM", 0L);
        result.put("WAIT_PAY", 0L);
        result.put("WAIT_SHIP", 0L);
        result.put("WAIT_RECEIVE", 0L);
        result.put("WAIT_FINAL_PAY", 0L);
        result.put("COMPLETED", 0L);
        result.put("CANCELED", 0L);
        return result;
    }

    private BigDecimal calcPendingReceivable(PigOrder order, String status)
    {
        if (order == null || "COMPLETED".equals(status) || "CANCELED".equals(status))
        {
            return BigDecimal.ZERO;
        }
        if ("WAIT_PAY".equals(status) || "WAIT_CONFIRM".equals(status))
        {
            return defaultZero(order.getFirstPaymentAmount());
        }
        return safeAdd(order.getRemainingPaymentAmount(), order.getFreightAmount());
    }

    private BigDecimal safeAdd(BigDecimal left, BigDecimal right)
    {
        return defaultZero(left).add(defaultZero(right));
    }

    private BigDecimal defaultZero(BigDecimal value)
    {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalizeStatus(String value)
    {
        return value == null ? "" : value.trim().toUpperCase();
    }

    private Date startOfDay(Date now)
    {
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.setTime(now);
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0);
        calendar.set(java.util.Calendar.MINUTE, 0);
        calendar.set(java.util.Calendar.SECOND, 0);
        calendar.set(java.util.Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date startOfMonth(Date now)
    {
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.setTime(now);
        calendar.set(java.util.Calendar.DAY_OF_MONTH, 1);
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0);
        calendar.set(java.util.Calendar.MINUTE, 0);
        calendar.set(java.util.Calendar.SECOND, 0);
        calendar.set(java.util.Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
}
