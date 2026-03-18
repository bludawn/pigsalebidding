package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 送货信息对象 delivery_info
 * 
 * @author ruoyi
 */
public class DeliveryInfo extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 送货人姓名 */
    @Excel(name = "送货人姓名")
    private String delivererName;

    /** 送货人电话 */
    @Excel(name = "送货人电话")
    private String delivererPhone;

    /** 车牌号 */
    @Excel(name = "车牌号")
    private String vehicleNo;

    /** 车辆类型 */
    @Excel(name = "车辆类型")
    private String vehicleType;

    /** 装猪数量 */
    @Excel(name = "装猪数量")
    private Integer loadCount;

    /** 送货状态 */
    @Excel(name = "送货状态")
    private String deliveryStatus;

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

    public void setDelivererName(String delivererName)
    {
        this.delivererName = delivererName;
    }

    public String getDelivererName()
    {
        return delivererName;
    }

    public void setDelivererPhone(String delivererPhone)
    {
        this.delivererPhone = delivererPhone;
    }

    public String getDelivererPhone()
    {
        return delivererPhone;
    }

    public void setVehicleNo(String vehicleNo)
    {
        this.vehicleNo = vehicleNo;
    }

    public String getVehicleNo()
    {
        return vehicleNo;
    }

    public void setVehicleType(String vehicleType)
    {
        this.vehicleType = vehicleType;
    }

    public String getVehicleType()
    {
        return vehicleType;
    }

    public void setLoadCount(Integer loadCount)
    {
        this.loadCount = loadCount;
    }

    public Integer getLoadCount()
    {
        return loadCount;
    }

    public void setDeliveryStatus(String deliveryStatus)
    {
        this.deliveryStatus = deliveryStatus;
    }

    public String getDeliveryStatus()
    {
        return deliveryStatus;
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
            .append("delivererName", getDelivererName())
            .append("delivererPhone", getDelivererPhone())
            .append("vehicleNo", getVehicleNo())
            .append("vehicleType", getVehicleType())
            .append("loadCount", getLoadCount())
            .append("deliveryStatus", getDeliveryStatus())
            .append("remark", getRemark())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
