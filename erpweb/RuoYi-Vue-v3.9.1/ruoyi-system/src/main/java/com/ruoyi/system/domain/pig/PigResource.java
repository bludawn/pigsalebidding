package com.ruoyi.system.domain.pig;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 生猪资源对象 pig_resource
 * 
 * @author ruoyi
 */
public class PigResource extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 资源编码 */
    @Excel(name = "资源编码")
    private String resourceCode;

    /** 生猪类型id */
    @Excel(name = "生猪类型id")
    private Long pigTypeId;

    /** 场点id */
    @Excel(name = "场点id")
    private Long siteId;

    /** 资源来源 */
    @Excel(name = "资源来源")
    private String resourceSource;

    /** 采购单id */
    @Excel(name = "采购单id")
    private Long purchaseOrderId;

    /** 资源数量 */
    @Excel(name = "资源数量")
    private Integer resourceCount;

    /** 资源单价 */
    @Excel(name = "资源单价")
    private BigDecimal resourceUnitPrice;

    /** 资源总价 */
    @Excel(name = "资源总价")
    private BigDecimal resourceTotalPrice;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setResourceCode(String resourceCode)
    {
        this.resourceCode = resourceCode;
    }

    public String getResourceCode()
    {
        return resourceCode;
    }

    public void setPigTypeId(Long pigTypeId)
    {
        this.pigTypeId = pigTypeId;
    }

    public Long getPigTypeId()
    {
        return pigTypeId;
    }

    public void setSiteId(Long siteId)
    {
        this.siteId = siteId;
    }

    public Long getSiteId()
    {
        return siteId;
    }

    public void setResourceSource(String resourceSource)
    {
        this.resourceSource = resourceSource;
    }

    public String getResourceSource()
    {
        return resourceSource;
    }

    public void setPurchaseOrderId(Long purchaseOrderId)
    {
        this.purchaseOrderId = purchaseOrderId;
    }

    public Long getPurchaseOrderId()
    {
        return purchaseOrderId;
    }

    public void setResourceCount(Integer resourceCount)
    {
        this.resourceCount = resourceCount;
    }

    public Integer getResourceCount()
    {
        return resourceCount;
    }

    public void setResourceUnitPrice(BigDecimal resourceUnitPrice)
    {
        this.resourceUnitPrice = resourceUnitPrice;
    }

    public BigDecimal getResourceUnitPrice()
    {
        return resourceUnitPrice;
    }

    public void setResourceTotalPrice(BigDecimal resourceTotalPrice)
    {
        this.resourceTotalPrice = resourceTotalPrice;
    }

    public BigDecimal getResourceTotalPrice()
    {
        return resourceTotalPrice;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("resourceCode", getResourceCode())
            .append("pigTypeId", getPigTypeId())
            .append("siteId", getSiteId())
            .append("resourceSource", getResourceSource())
            .append("purchaseOrderId", getPurchaseOrderId())
            .append("resourceCount", getResourceCount())
            .append("resourceUnitPrice", getResourceUnitPrice())
            .append("resourceTotalPrice", getResourceTotalPrice())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
