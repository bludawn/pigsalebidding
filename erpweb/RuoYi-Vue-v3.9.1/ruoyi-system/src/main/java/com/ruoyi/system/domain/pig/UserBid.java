package com.ruoyi.system.domain.pig;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 用户出价对象 user_bid
 * 
 * @author ruoyi
 */
public class UserBid extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 企业id */
    @Excel(name = "企业id")
    private Long enterpriseId;

    /** 竞价商品id */
    @Excel(name = "竞价商品id")
    private Long bidProductId;

    /** 单价 */
    @Excel(name = "单价")
    private BigDecimal price;

    /** 数量 */
    @Excel(name = "数量")
    private Integer quantity;

    /** 出价时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "出价时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date bidTime;

    /** 状态 */
    @Excel(name = "状态")
    private String status;

    /** 总价 */
    @Excel(name = "总价")
    private BigDecimal totalPrice;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setEnterpriseId(Long enterpriseId)
    {
        this.enterpriseId = enterpriseId;
    }

    public Long getEnterpriseId()
    {
        return enterpriseId;
    }

    public void setBidProductId(Long bidProductId)
    {
        this.bidProductId = bidProductId;
    }

    public Long getBidProductId()
    {
        return bidProductId;
    }

    public void setPrice(BigDecimal price)
    {
        this.price = price;
    }

    public BigDecimal getPrice()
    {
        return price;
    }

    public void setQuantity(Integer quantity)
    {
        this.quantity = quantity;
    }

    public Integer getQuantity()
    {
        return quantity;
    }

    public void setBidTime(Date bidTime)
    {
        this.bidTime = bidTime;
    }

    public Date getBidTime()
    {
        return bidTime;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getStatus()
    {
        return status;
    }

    public void setTotalPrice(BigDecimal totalPrice)
    {
        this.totalPrice = totalPrice;
    }

    public BigDecimal getTotalPrice()
    {
        return totalPrice;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("userId", getUserId())
            .append("enterpriseId", getEnterpriseId())
            .append("bidProductId", getBidProductId())
            .append("price", getPrice())
            .append("quantity", getQuantity())
            .append("bidTime", getBidTime())
            .append("status", getStatus())
            .append("totalPrice", getTotalPrice())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
