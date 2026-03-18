package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 用户信息拓展对象 user_ext
 * 
 * @author ruoyi
 */
public class UserExt extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 用户id */
    private Long id;

    /** 是否实名认证 */
    @Excel(name = "是否实名认证")
    private Integer isRealName;

    /** 所属企业id */
    @Excel(name = "所属企业id")
    private Long enterpriseId;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setIsRealName(Integer isRealName)
    {
        this.isRealName = isRealName;
    }

    public Integer getIsRealName()
    {
        return isRealName;
    }

    public void setEnterpriseId(Long enterpriseId)
    {
        this.enterpriseId = enterpriseId;
    }

    public Long getEnterpriseId()
    {
        return enterpriseId;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("isRealName", getIsRealName())
            .append("enterpriseId", getEnterpriseId())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
