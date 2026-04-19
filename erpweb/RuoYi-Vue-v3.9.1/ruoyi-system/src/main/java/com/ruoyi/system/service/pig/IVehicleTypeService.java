package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.VehicleType;

/**
 * 车辆类型 Service接口
 */
public interface IVehicleTypeService
{
    public List<VehicleType> selectVehicleTypeList(VehicleType vehicleType);

    public VehicleType selectVehicleTypeById(Long id);

    public int insertVehicleType(VehicleType vehicleType);

    public int updateVehicleType(VehicleType vehicleType);

    public int deleteVehicleTypeById(Long id);

    public int deleteVehicleTypeByIds(Long[] ids);
}
