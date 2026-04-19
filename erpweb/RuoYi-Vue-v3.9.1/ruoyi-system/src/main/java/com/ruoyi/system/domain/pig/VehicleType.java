package com.ruoyi.system.domain.pig;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 车辆类型对象 vehicle_type
 */
public class VehicleType extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    private Long id;

    /** 车辆类型名称 */
    @Excel(name = "车辆类型名称")
    private String vehicleTypeName;

    /** 车辆类型描述 */
    @Excel(name = "车辆类型描述")
    private String vehicleTypeDesc;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setVehicleTypeName(String vehicleTypeName)
    {
        this.vehicleTypeName = vehicleTypeName;
    }

    public String getVehicleTypeName()
    {
        return vehicleTypeName;
    }

    public void setVehicleTypeDesc(String vehicleTypeDesc)
    {
        this.vehicleTypeDesc = vehicleTypeDesc;
    }

    public String getVehicleTypeDesc()
    {
        return vehicleTypeDesc;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("vehicleTypeName", getVehicleTypeName())
            .append("vehicleTypeDesc", getVehicleTypeDesc())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
