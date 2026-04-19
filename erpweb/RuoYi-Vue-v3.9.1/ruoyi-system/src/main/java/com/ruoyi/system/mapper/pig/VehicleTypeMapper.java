package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.VehicleType;

/**
 * 车辆类型Mapper接口
 */
public interface VehicleTypeMapper
{
    public List<VehicleType> selectVehicleTypeList(VehicleType vehicleType);

    public VehicleType selectVehicleTypeById(Long id);

    public int insertVehicleType(VehicleType vehicleType);

    public int updateVehicleType(VehicleType vehicleType);

    public int deleteVehicleTypeById(Long id);

    public int deleteVehicleTypeByIds(Long[] ids);
}
