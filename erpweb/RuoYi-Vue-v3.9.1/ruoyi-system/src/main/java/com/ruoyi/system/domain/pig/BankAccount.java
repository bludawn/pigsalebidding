package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 银行账号对象 bank_account
 */
public class BankAccount extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 名称 */
    @Excel(name = "名称")
    private String accountName;

    /** 账户名 */
    @Excel(name = "账户名")
    private String holderName;

    /** 银行卡号 */
    @Excel(name = "银行卡号")
    private String bankCardNo;

    /** 银行网点 */
    @Excel(name = "银行网点")
    private String bankBranch;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setAccountName(String accountName)
    {
        this.accountName = accountName;
    }

    public String getAccountName()
    {
        return accountName;
    }

    public void setHolderName(String holderName)
    {
        this.holderName = holderName;
    }

    public String getHolderName()
    {
        return holderName;
    }

    public void setBankCardNo(String bankCardNo)
    {
        this.bankCardNo = bankCardNo;
    }

    public String getBankCardNo()
    {
        return bankCardNo;
    }

    public void setBankBranch(String bankBranch)
    {
        this.bankBranch = bankBranch;
    }

    public String getBankBranch()
    {
        return bankBranch;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("accountName", getAccountName())
            .append("holderName", getHolderName())
            .append("bankCardNo", getBankCardNo())
            .append("bankBranch", getBankBranch())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
