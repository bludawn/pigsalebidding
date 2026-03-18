package com.ruoyi.system.domain.pig;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 企业信息对象 enterprise
 * 
 * @author ruoyi
 */
public class Enterprise extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 企业名称 */
    @Excel(name = "企业名称")
    private String enterpriseName;

    /** 统一社会信用代码 */
    @Excel(name = "统一社会信用代码")
    private String creditCode;

    /** 法定代表人 */
    @Excel(name = "法定代表人")
    private String legalPerson;

    /** 联系人 */
    @Excel(name = "联系人")
    private String contactPerson;

    /** 联系电话 */
    @Excel(name = "联系电话")
    private String contactPhone;

    /** 营业执照 */
    @Excel(name = "营业执照")
    private String businessLicenseUrl;

    /** 其他资料 */
    @Excel(name = "其他资料")
    private String otherMaterialUrls;

    /** 是否认证 */
    @Excel(name = "是否认证")
    private Integer isVerified;

    /** 是否可以参与竞价 */
    @Excel(name = "是否可以参与竞价")
    private Integer canBid;

    /** 是否缴纳保证金 */
    @Excel(name = "是否缴纳保证金")
    private Integer hasDeposit;

    /** 保证金 */
    @Excel(name = "保证金")
    private BigDecimal depositAmount;

    /** 货款 */
    @Excel(name = "货款")
    private BigDecimal paymentAmount;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setEnterpriseName(String enterpriseName)
    {
        this.enterpriseName = enterpriseName;
    }

    public String getEnterpriseName()
    {
        return enterpriseName;
    }

    public void setCreditCode(String creditCode)
    {
        this.creditCode = creditCode;
    }

    public String getCreditCode()
    {
        return creditCode;
    }

    public void setLegalPerson(String legalPerson)
    {
        this.legalPerson = legalPerson;
    }

    public String getLegalPerson()
    {
        return legalPerson;
    }

    public void setContactPerson(String contactPerson)
    {
        this.contactPerson = contactPerson;
    }

    public String getContactPerson()
    {
        return contactPerson;
    }

    public void setContactPhone(String contactPhone)
    {
        this.contactPhone = contactPhone;
    }

    public String getContactPhone()
    {
        return contactPhone;
    }

    public void setBusinessLicenseUrl(String businessLicenseUrl)
    {
        this.businessLicenseUrl = businessLicenseUrl;
    }

    public String getBusinessLicenseUrl()
    {
        return businessLicenseUrl;
    }

    public void setOtherMaterialUrls(String otherMaterialUrls)
    {
        this.otherMaterialUrls = otherMaterialUrls;
    }

    public String getOtherMaterialUrls()
    {
        return otherMaterialUrls;
    }

    public void setIsVerified(Integer isVerified)
    {
        this.isVerified = isVerified;
    }

    public Integer getIsVerified()
    {
        return isVerified;
    }

    public void setCanBid(Integer canBid)
    {
        this.canBid = canBid;
    }

    public Integer getCanBid()
    {
        return canBid;
    }

    public void setHasDeposit(Integer hasDeposit)
    {
        this.hasDeposit = hasDeposit;
    }

    public Integer getHasDeposit()
    {
        return hasDeposit;
    }

    public void setDepositAmount(BigDecimal depositAmount)
    {
        this.depositAmount = depositAmount;
    }

    public BigDecimal getDepositAmount()
    {
        return depositAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount)
    {
        this.paymentAmount = paymentAmount;
    }

    public BigDecimal getPaymentAmount()
    {
        return paymentAmount;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("enterpriseName", getEnterpriseName())
            .append("creditCode", getCreditCode())
            .append("legalPerson", getLegalPerson())
            .append("contactPerson", getContactPerson())
            .append("contactPhone", getContactPhone())
            .append("businessLicenseUrl", getBusinessLicenseUrl())
            .append("otherMaterialUrls", getOtherMaterialUrls())
            .append("isVerified", getIsVerified())
            .append("canBid", getCanBid())
            .append("hasDeposit", getHasDeposit())
            .append("depositAmount", getDepositAmount())
            .append("paymentAmount", getPaymentAmount())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
