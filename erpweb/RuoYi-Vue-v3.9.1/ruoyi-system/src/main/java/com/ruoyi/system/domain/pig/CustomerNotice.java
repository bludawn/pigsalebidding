package com.ruoyi.system.domain.pig;

import java.util.Date;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 客户端通知对象 customer_notice
 */
public class CustomerNotice extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 接收用户id */
    @Excel(name = "接收用户id")
    private Long userId;

    /** 业务类型 */
    @Excel(name = "业务类型")
    private String bizType;

    /** 事件类型 */
    @Excel(name = "事件类型")
    private String eventType;

    /** 通知标题 */
    @Excel(name = "通知标题")
    private String title;

    /** 通知内容 */
    @Excel(name = "通知内容")
    private String content;

    /** 跳转目标类型 */
    @Excel(name = "跳转目标类型")
    private String targetType;

    /** 跳转目标id */
    @Excel(name = "跳转目标id")
    private Long targetId;

    /** 跳转路由标识 */
    @Excel(name = "跳转路由标识")
    private String targetRoute;

    /** 扩展数据json */
    @Excel(name = "扩展数据json")
    private String payload;

    /** 是否已读：0未读 1已读 */
    @Excel(name = "是否已读")
    private Integer readStatus;

    /** 阅读时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "阅读时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date readTime;

    /** 来源事件唯一标识 */
    @Excel(name = "来源事件唯一标识")
    private String sourceEventId;

    /** 是否删除：0否 1是 */
    @Excel(name = "是否删除")
    private Integer isDeleted;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public String getBizType()
    {
        return bizType;
    }

    public void setBizType(String bizType)
    {
        this.bizType = bizType;
    }

    public String getEventType()
    {
        return eventType;
    }

    public void setEventType(String eventType)
    {
        this.eventType = eventType;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }

    public String getTargetType()
    {
        return targetType;
    }

    public void setTargetType(String targetType)
    {
        this.targetType = targetType;
    }

    public Long getTargetId()
    {
        return targetId;
    }

    public void setTargetId(Long targetId)
    {
        this.targetId = targetId;
    }

    public String getTargetRoute()
    {
        return targetRoute;
    }

    public void setTargetRoute(String targetRoute)
    {
        this.targetRoute = targetRoute;
    }

    public String getPayload()
    {
        return payload;
    }

    public void setPayload(String payload)
    {
        this.payload = payload;
    }

    public Integer getReadStatus()
    {
        return readStatus;
    }

    public void setReadStatus(Integer readStatus)
    {
        this.readStatus = readStatus;
    }

    public Date getReadTime()
    {
        return readTime;
    }

    public void setReadTime(Date readTime)
    {
        this.readTime = readTime;
    }

    public String getSourceEventId()
    {
        return sourceEventId;
    }

    public void setSourceEventId(String sourceEventId)
    {
        this.sourceEventId = sourceEventId;
    }

    public Integer getIsDeleted()
    {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted)
    {
        this.isDeleted = isDeleted;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("userId", getUserId())
            .append("bizType", getBizType())
            .append("eventType", getEventType())
            .append("title", getTitle())
            .append("content", getContent())
            .append("targetType", getTargetType())
            .append("targetId", getTargetId())
            .append("targetRoute", getTargetRoute())
            .append("payload", getPayload())
            .append("readStatus", getReadStatus())
            .append("readTime", getReadTime())
            .append("sourceEventId", getSourceEventId())
            .append("isDeleted", getIsDeleted())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
