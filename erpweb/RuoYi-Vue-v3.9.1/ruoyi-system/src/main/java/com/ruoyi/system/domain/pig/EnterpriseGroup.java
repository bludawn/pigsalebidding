package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 企业分组对象 enterprise_group
 * 
 * @author ruoyi
 */
public class EnterpriseGroup extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 组名 */
    @Excel(name = "组名")
    private String groupName;

    /** 组描述 */
    @Excel(name = "组描述")
    private String groupDesc;

    /** 企业id数组 */
    @Excel(name = "企业id数组")
    private String enterpriseIds;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setGroupName(String groupName)
    {
        this.groupName = groupName;
    }

    public String getGroupName()
    {
        return groupName;
    }

    public void setGroupDesc(String groupDesc)
    {
        this.groupDesc = groupDesc;
    }

    public String getGroupDesc()
    {
        return groupDesc;
    }

    public void setEnterpriseIds(String enterpriseIds)
    {
        this.enterpriseIds = enterpriseIds;
    }

    public String getEnterpriseIds()
    {
        return enterpriseIds;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("groupName", getGroupName())
            .append("groupDesc", getGroupDesc())
            .append("enterpriseIds", getEnterpriseIds())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
