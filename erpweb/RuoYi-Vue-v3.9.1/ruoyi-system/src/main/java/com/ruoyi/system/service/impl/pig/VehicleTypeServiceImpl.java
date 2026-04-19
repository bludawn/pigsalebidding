package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.VehicleType;
import com.ruoyi.system.mapper.pig.VehicleTypeMapper;
import com.ruoyi.system.service.pig.IVehicleTypeService;

/**
 * 车辆类型 Service业务层处理
 */
@Service
public class VehicleTypeServiceImpl implements IVehicleTypeService
{
    @Autowired
    private VehicleTypeMapper vehicleTypeMapper;

    @Override
    public List<VehicleType> selectVehicleTypeList(VehicleType vehicleType)
    {
        return vehicleTypeMapper.selectVehicleTypeList(vehicleType);
    }

    @Override
    public VehicleType selectVehicleTypeById(Long id)
    {
        return vehicleTypeMapper.selectVehicleTypeById(id);
    }

    @Override
    public int insertVehicleType(VehicleType vehicleType)
    {
        return vehicleTypeMapper.insertVehicleType(vehicleType);
    }

    @Override
    public int updateVehicleType(VehicleType vehicleType)
    {
        return vehicleTypeMapper.updateVehicleType(vehicleType);
    }

    @Override
    public int deleteVehicleTypeById(Long id)
    {
        return vehicleTypeMapper.deleteVehicleTypeById(id);
    }

    @Override
    public int deleteVehicleTypeByIds(Long[] ids)
    {
        return vehicleTypeMapper.deleteVehicleTypeByIds(ids);
    }
}
