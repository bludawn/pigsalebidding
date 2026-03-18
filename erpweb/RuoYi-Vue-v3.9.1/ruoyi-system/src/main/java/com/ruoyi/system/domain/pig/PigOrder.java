package com.ruoyi.system.domain.pig;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 订单对象 pig_order
 * 
 * @author ruoyi
 */
public class PigOrder extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 订单编号 */
    @Excel(name = "订单编号")
    private String orderNo;

    /** 订单状态 */
    @Excel(name = "订单状态")
    private String orderStatus;

    /** 订单来源 */
    @Excel(name = "订单来源")
    private String orderSource;

    /** 竞价商品id */
    @Excel(name = "竞价商品id")
    private Long bidProductId;

    /** 用户出价id */
    @Excel(name = "用户出价id")
    private Long userBidId;

    /** 收货地址id */
    @Excel(name = "收货地址id")
    private Long addressId;

    /** 期望装车时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "期望装车时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date expectLoadTime;

    /** 备注 */
    @Excel(name = "备注")
    private String remark;

    /** 生猪资源id */
    @Excel(name = "生猪资源id")
    private Long pigResourceId;

    /** 订单金额 */
    @Excel(name = "订单金额")
    private BigDecimal orderAmount;

    /** 支付渠道 */
    @Excel(name = "支付渠道")
    private String payChannel;

    /** 支付时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "支付时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date payTime;

    /** 装货时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "装货时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date loadTime;

    /** 发货时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "发货时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date shipTime;

    /** 送货信息id数组 */
    @Excel(name = "送货信息id数组")
    private String deliveryInfoIds;

    /** 确认收货时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "确认收货时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date receiveTime;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setOrderNo(String orderNo)
    {
        this.orderNo = orderNo;
    }

    public String getOrderNo()
    {
        return orderNo;
    }

    public void setOrderStatus(String orderStatus)
    {
        this.orderStatus = orderStatus;
    }

    public String getOrderStatus()
    {
        return orderStatus;
    }

    public void setOrderSource(String orderSource)
    {
        this.orderSource = orderSource;
    }

    public String getOrderSource()
    {
        return orderSource;
    }

    public void setBidProductId(Long bidProductId)
    {
        this.bidProductId = bidProductId;
    }

    public Long getBidProductId()
    {
        return bidProductId;
    }

    public void setUserBidId(Long userBidId)
    {
        this.userBidId = userBidId;
    }

    public Long getUserBidId()
    {
        return userBidId;
    }

    public void setAddressId(Long addressId)
    {
        this.addressId = addressId;
    }

    public Long getAddressId()
    {
        return addressId;
    }

    public void setExpectLoadTime(Date expectLoadTime)
    {
        this.expectLoadTime = expectLoadTime;
    }

    public Date getExpectLoadTime()
    {
        return expectLoadTime;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setPigResourceId(Long pigResourceId)
    {
        this.pigResourceId = pigResourceId;
    }

    public Long getPigResourceId()
    {
        return pigResourceId;
    }

    public void setOrderAmount(BigDecimal orderAmount)
    {
        this.orderAmount = orderAmount;
    }

    public BigDecimal getOrderAmount()
    {
        return orderAmount;
    }

    public void setPayChannel(String payChannel)
    {
        this.payChannel = payChannel;
    }

    public String getPayChannel()
    {
        return payChannel;
    }

    public void setPayTime(Date payTime)
    {
        this.payTime = payTime;
    }

    public Date getPayTime()
    {
        return payTime;
    }

    public void setLoadTime(Date loadTime)
    {
        this.loadTime = loadTime;
    }

    public Date getLoadTime()
    {
        return loadTime;
    }

    public void setShipTime(Date shipTime)
    {
        this.shipTime = shipTime;
    }

    public Date getShipTime()
    {
        return shipTime;
    }

    public void setDeliveryInfoIds(String deliveryInfoIds)
    {
        this.deliveryInfoIds = deliveryInfoIds;
    }

    public String getDeliveryInfoIds()
    {
        return deliveryInfoIds;
    }

    public void setReceiveTime(Date receiveTime)
    {
        this.receiveTime = receiveTime;
    }

    public Date getReceiveTime()
    {
        return receiveTime;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("orderNo", getOrderNo())
            .append("orderStatus", getOrderStatus())
            .append("orderSource", getOrderSource())
            .append("bidProductId", getBidProductId())
            .append("userBidId", getUserBidId())
            .append("addressId", getAddressId())
            .append("expectLoadTime", getExpectLoadTime())
            .append("remark", getRemark())
            .append("pigResourceId", getPigResourceId())
            .append("orderAmount", getOrderAmount())
            .append("payChannel", getPayChannel())
            .append("payTime", getPayTime())
            .append("loadTime", getLoadTime())
            .append("shipTime", getShipTime())
            .append("deliveryInfoIds", getDeliveryInfoIds())
            .append("receiveTime", getReceiveTime())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
