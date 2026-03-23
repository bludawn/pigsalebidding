package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.DeliveryInfo;

/**
 * 送货信息Mapper接口
 * 
 * @author ruoyi
 */
public interface DeliveryInfoMapper
{
    /**
     * 查询送货信息列表
     * 
     * @param deliveryInfo 送货信息
     * @return 送货信息集合
     */
    public List<DeliveryInfo> selectDeliveryInfoList(DeliveryInfo deliveryInfo);

    /**
     * 查询送货信息
     * 
     * @param id 送货信息主键
     * @return 送货信息
     */
    public DeliveryInfo selectDeliveryInfoById(Long id);

    /**
     * 新增送货信息
     * 
     * @param deliveryInfo 送货信息
     * @return 结果
     */
    public int insertDeliveryInfo(DeliveryInfo deliveryInfo);

    /**
     * 修改送货信息
     * 
     * @param deliveryInfo 送货信息
     * @return 结果
     */
    public int updateDeliveryInfo(DeliveryInfo deliveryInfo);

    /**
     * 删除送货信息
     * 
     * @param id 送货信息主键
     * @return 结果
     */
    public int deleteDeliveryInfoById(Long id);

    /**
     * 批量删除送货信息
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDeliveryInfoByIds(Long[] ids);

    /**
     * 获取最大主键
     *
     * @return 最大主键
     */
    public Long selectMaxId();
}
