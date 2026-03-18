package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.DeliveryInfo;

/**
 * 送货信息 Service接口
 * 
 * @author ruoyi
 */
public interface IDeliveryInfoService
{
    public List<DeliveryInfo> selectDeliveryInfoList(DeliveryInfo deliveryInfo);
    public DeliveryInfo selectDeliveryInfoById(Long id);
    public int insertDeliveryInfo(DeliveryInfo deliveryInfo);
    public int updateDeliveryInfo(DeliveryInfo deliveryInfo);
    public int deleteDeliveryInfoById(Long id);
    public int deleteDeliveryInfoByIds(Long[] ids);
}
