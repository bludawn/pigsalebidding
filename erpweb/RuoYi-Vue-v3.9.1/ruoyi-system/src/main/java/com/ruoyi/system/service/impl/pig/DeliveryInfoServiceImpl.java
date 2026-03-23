package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.DeliveryInfo;
import com.ruoyi.system.mapper.pig.DeliveryInfoMapper;
import com.ruoyi.system.service.pig.IDeliveryInfoService;

/**
 * 送货信息 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class DeliveryInfoServiceImpl implements IDeliveryInfoService
{
    @Autowired
    private DeliveryInfoMapper deliveryInfoMapper;

    @Override
    public List<DeliveryInfo> selectDeliveryInfoList(DeliveryInfo deliveryInfo)
    {
        return deliveryInfoMapper.selectDeliveryInfoList(deliveryInfo);
    }

    @Override
    public DeliveryInfo selectDeliveryInfoById(Long id)
    {
        return deliveryInfoMapper.selectDeliveryInfoById(id);
    }

    @Override
    public int insertDeliveryInfo(DeliveryInfo deliveryInfo)
    {
        deliveryInfo.setTransportCode(generateTransportCode());
        return deliveryInfoMapper.insertDeliveryInfo(deliveryInfo);
    }

    @Override
    public int updateDeliveryInfo(DeliveryInfo deliveryInfo)
    {
        return deliveryInfoMapper.updateDeliveryInfo(deliveryInfo);
    }

    @Override
    public int deleteDeliveryInfoById(Long id)
    {
        return deliveryInfoMapper.deleteDeliveryInfoById(id);
    }

    @Override
    public int deleteDeliveryInfoByIds(Long[] ids)
    {
        return deliveryInfoMapper.deleteDeliveryInfoByIds(ids);
    }

    @Override
    public String generateTransportCode()
    {
        Long maxId = deliveryInfoMapper.selectMaxId();
        long nextId = maxId == null ? 1L : maxId + 1L;
        return "TS-" + String.format("%012d", nextId);
    }

}
