package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 场点对象 site
 * 
 * @author ruoyi
 */
public class Site extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 所属企业 */
    @Excel(name = "所属企业")
    private Long enterpriseId;

    /** 场点名称 */
    @Excel(name = "场点名称")
    private String siteName;

    /** 场点地址 */
    @Excel(name = "场点地址")
    private String siteAddress;

    /** 场点地址code */
    @Excel(name = "场点地址code")
    private String siteAddressCode;

    /** 场点经度 */
    @Excel(name = "场点经度")
    private String siteLongitude;

    /** 场点纬度 */
    @Excel(name = "场点纬度")
    private String siteLatitude;

    /** 场点电话 */
    @Excel(name = "场点电话")
    private String sitePhone;

    /** 场点介绍 */
    @Excel(name = "场点介绍")
    private String siteIntro;

    /** 场点图片 */
    @Excel(name = "场点图片")
    private String siteImages;

    /** 场点视频 */
    @Excel(name = "场点视频")
    private String siteVideos;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setEnterpriseId(Long enterpriseId)
    {
        this.enterpriseId = enterpriseId;
    }

    public Long getEnterpriseId()
    {
        return enterpriseId;
    }

    public void setSiteName(String siteName)
    {
        this.siteName = siteName;
    }

    public String getSiteName()
    {
        return siteName;
    }

    public void setSiteAddress(String siteAddress)
    {
        this.siteAddress = siteAddress;
    }

    public String getSiteAddress()
    {
        return siteAddress;
    }

    public void setSiteAddressCode(String siteAddressCode)
    {
        this.siteAddressCode = siteAddressCode;
    }

    public String getSiteAddressCode()
    {
        return siteAddressCode;
    }

    public void setSiteLongitude(String siteLongitude)
    {
        this.siteLongitude = siteLongitude;
    }

    public String getSiteLongitude()
    {
        return siteLongitude;
    }

    public void setSiteLatitude(String siteLatitude)
    {
        this.siteLatitude = siteLatitude;
    }

    public String getSiteLatitude()
    {
        return siteLatitude;
    }

    public void setSitePhone(String sitePhone)
    {
        this.sitePhone = sitePhone;
    }

    public String getSitePhone()
    {
        return sitePhone;
    }

    public void setSiteIntro(String siteIntro)
    {
        this.siteIntro = siteIntro;
    }

    public String getSiteIntro()
    {
        return siteIntro;
    }

    public void setSiteImages(String siteImages)
    {
        this.siteImages = siteImages;
    }

    public String getSiteImages()
    {
        return siteImages;
    }

    public void setSiteVideos(String siteVideos)
    {
        this.siteVideos = siteVideos;
    }

    public String getSiteVideos()
    {
        return siteVideos;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("enterpriseId", getEnterpriseId())
            .append("siteName", getSiteName())
            .append("siteAddress", getSiteAddress())
            .append("siteAddressCode", getSiteAddressCode())
            .append("siteLongitude", getSiteLongitude())
            .append("siteLatitude", getSiteLatitude())
            .append("sitePhone", getSitePhone())
            .append("siteIntro", getSiteIntro())
            .append("siteImages", getSiteImages())
            .append("siteVideos", getSiteVideos())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
