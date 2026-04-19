package com.ruoyi.system.domain.pig;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 用户竞价信息维护对象 user_bid_info
 * 
 * @author ruoyi
 */
public class UserBidInfo extends BaseEntity
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

    /** 收货地址id */
    @Excel(name = "收货地址id")
    private Long addressId;

    /** 期望送达时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "期望送达时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date expectedDeliveryTime;

    /** 备注 */
    @Excel(name = "备注")
    private String remark;

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

    public void setAddressId(Long addressId)
    {
        this.addressId = addressId;
    }

    public Long getAddressId()
    {
        return addressId;
    }

    public void setExpectedDeliveryTime(Date expectedDeliveryTime)
    {
        this.expectedDeliveryTime = expectedDeliveryTime;
    }

    public Date getExpectedDeliveryTime()
    {
        return expectedDeliveryTime;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getRemark()
    {
        return remark;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("userId", getUserId())
            .append("enterpriseId", getEnterpriseId())
            .append("bidProductId", getBidProductId())
            .append("addressId", getAddressId())
            .append("expectedDeliveryTime", getExpectedDeliveryTime())
            .append("remark", getRemark())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
