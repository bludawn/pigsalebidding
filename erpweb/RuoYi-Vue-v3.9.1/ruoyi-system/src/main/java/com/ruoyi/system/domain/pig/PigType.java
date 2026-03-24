package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 生猪类型对象 pig_type
 * 
 * @author ruoyi
 */
public class PigType extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 生猪名称 */
    @Excel(name = "生猪名称")
    private String pigName;

    /** 生猪编码 */
    @Excel(name = "生猪编码")
    private String pigCode;

    /** 生猪介绍 */
    @Excel(name = "生猪介绍")
    private String pigIntro;

    /** 生猪标签id字符串数组 */
    @Excel(name = "生猪标签id字符串数组")
    private String pigTagIds;

    /** 体重区间 */
    @Excel(name = "体重区间")
    private String weightRange;

    /** 生猪图片视频 */
    @Excel(name = "生猪图片视频")
    private String pigMedia;

    /** 食料品质 */
    @Excel(name = "食料品质")
    private String feedQuality;

    /** 防疫状态 */
    @Excel(name = "防疫状态")
    private String epidemicStatus;

    /** 无疫地区 */
    @Excel(name = "无疫地区")
    private String diseaseFreeRegion;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setPigName(String pigName)
    {
        this.pigName = pigName;
    }

    public String getPigName()
    {
        return pigName;
    }

    public void setPigCode(String pigCode)
    {
        this.pigCode = pigCode;
    }

    public String getPigCode()
    {
        return pigCode;
    }

    public void setPigIntro(String pigIntro)
    {
        this.pigIntro = pigIntro;
    }

    public String getPigIntro()
    {
        return pigIntro;
    }

    public void setPigTagIds(String pigTagIds)
    {
        this.pigTagIds = pigTagIds;
    }

    public String getPigTagIds()
    {
        return pigTagIds;
    }

    public void setWeightRange(String weightRange)
    {
        this.weightRange = weightRange;
    }

    public String getWeightRange()
    {
        return weightRange;
    }

    public void setPigMedia(String pigMedia)
    {
        this.pigMedia = pigMedia;
    }

    public String getPigMedia()
    {
        return pigMedia;
    }

    public void setFeedQuality(String feedQuality)
    {
        this.feedQuality = feedQuality;
    }

    public String getFeedQuality()
    {
        return feedQuality;
    }

    public void setEpidemicStatus(String epidemicStatus)
    {
        this.epidemicStatus = epidemicStatus;
    }

    public String getEpidemicStatus()
    {
        return epidemicStatus;
    }

    public void setDiseaseFreeRegion(String diseaseFreeRegion)
    {
        this.diseaseFreeRegion = diseaseFreeRegion;
    }

    public String getDiseaseFreeRegion()
    {
        return diseaseFreeRegion;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("pigName", getPigName())
            .append("pigCode", getPigCode())
            .append("pigIntro", getPigIntro())
            .append("pigTagIds", getPigTagIds())
            .append("weightRange", getWeightRange())
            .append("pigMedia", getPigMedia())
            .append("feedQuality", getFeedQuality())
            .append("epidemicStatus", getEpidemicStatus())
            .append("diseaseFreeRegion", getDiseaseFreeRegion())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
