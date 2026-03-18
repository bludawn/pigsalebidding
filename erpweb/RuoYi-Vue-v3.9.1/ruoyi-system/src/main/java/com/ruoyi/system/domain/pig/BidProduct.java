package com.ruoyi.system.domain.pig;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 竞价商品对象 bid_product
 * 
 * @author ruoyi
 */
public class BidProduct extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 竞价商品编码 */
    @Excel(name = "竞价商品编码")
    private String bidProductCode;

    /** 生猪资源id */
    @Excel(name = "生猪资源id")
    private Long pigResourceId;

    /** 企业分组id */
    @Excel(name = "企业分组id")
    private Long enterpriseGroupId;

    /** 场点id */
    @Excel(name = "场点id")
    private Long siteId;

    /** 起始单价 */
    @Excel(name = "起始单价")
    private BigDecimal startPrice;

    /** 开始时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "开始时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    /** 结束时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "结束时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    /** 当前最高出价 */
    @Excel(name = "当前最高出价")
    private BigDecimal currentHighestPrice;

    /** 竞价须知 */
    @Excel(name = "竞价须知")
    private String bidNotice;

    /** 备注 */
    @Excel(name = "备注")
    private String remark;

    /** 总头数 */
    @Excel(name = "总头数")
    private Integer totalHeadCount;

    /** 起拍头数 */
    @Excel(name = "起拍头数")
    private Integer startBidCount;

    /** 加价幅度 */
    @Excel(name = "加价幅度")
    private BigDecimal priceStep;

    /** 加拍价 */
    @Excel(name = "加拍价")
    private BigDecimal addPrice;

    /** 竞价状态 */
    @Excel(name = "竞价状态")
    private String bidStatus;

    /** 审批状态 */
    @Excel(name = "审批状态")
    private String approvalStatus;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setBidProductCode(String bidProductCode)
    {
        this.bidProductCode = bidProductCode;
    }

    public String getBidProductCode()
    {
        return bidProductCode;
    }

    public void setPigResourceId(Long pigResourceId)
    {
        this.pigResourceId = pigResourceId;
    }

    public Long getPigResourceId()
    {
        return pigResourceId;
    }

    public void setEnterpriseGroupId(Long enterpriseGroupId)
    {
        this.enterpriseGroupId = enterpriseGroupId;
    }

    public Long getEnterpriseGroupId()
    {
        return enterpriseGroupId;
    }

    public void setSiteId(Long siteId)
    {
        this.siteId = siteId;
    }

    public Long getSiteId()
    {
        return siteId;
    }

    public void setStartPrice(BigDecimal startPrice)
    {
        this.startPrice = startPrice;
    }

    public BigDecimal getStartPrice()
    {
        return startPrice;
    }

    public void setStartTime(Date startTime)
    {
        this.startTime = startTime;
    }

    public Date getStartTime()
    {
        return startTime;
    }

    public void setEndTime(Date endTime)
    {
        this.endTime = endTime;
    }

    public Date getEndTime()
    {
        return endTime;
    }

    public void setCurrentHighestPrice(BigDecimal currentHighestPrice)
    {
        this.currentHighestPrice = currentHighestPrice;
    }

    public BigDecimal getCurrentHighestPrice()
    {
        return currentHighestPrice;
    }

    public void setBidNotice(String bidNotice)
    {
        this.bidNotice = bidNotice;
    }

    public String getBidNotice()
    {
        return bidNotice;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setTotalHeadCount(Integer totalHeadCount)
    {
        this.totalHeadCount = totalHeadCount;
    }

    public Integer getTotalHeadCount()
    {
        return totalHeadCount;
    }

    public void setStartBidCount(Integer startBidCount)
    {
        this.startBidCount = startBidCount;
    }

    public Integer getStartBidCount()
    {
        return startBidCount;
    }

    public void setPriceStep(BigDecimal priceStep)
    {
        this.priceStep = priceStep;
    }

    public BigDecimal getPriceStep()
    {
        return priceStep;
    }

    public void setAddPrice(BigDecimal addPrice)
    {
        this.addPrice = addPrice;
    }

    public BigDecimal getAddPrice()
    {
        return addPrice;
    }

    public void setBidStatus(String bidStatus)
    {
        this.bidStatus = bidStatus;
    }

    public String getBidStatus()
    {
        return bidStatus;
    }

    public void setApprovalStatus(String approvalStatus)
    {
        this.approvalStatus = approvalStatus;
    }

    public String getApprovalStatus()
    {
        return approvalStatus;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("bidProductCode", getBidProductCode())
            .append("pigResourceId", getPigResourceId())
            .append("enterpriseGroupId", getEnterpriseGroupId())
            .append("siteId", getSiteId())
            .append("startPrice", getStartPrice())
            .append("startTime", getStartTime())
            .append("endTime", getEndTime())
            .append("currentHighestPrice", getCurrentHighestPrice())
            .append("bidNotice", getBidNotice())
            .append("remark", getRemark())
            .append("totalHeadCount", getTotalHeadCount())
            .append("startBidCount", getStartBidCount())
            .append("priceStep", getPriceStep())
            .append("addPrice", getAddPrice())
            .append("bidStatus", getBidStatus())
            .append("approvalStatus", getApprovalStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
