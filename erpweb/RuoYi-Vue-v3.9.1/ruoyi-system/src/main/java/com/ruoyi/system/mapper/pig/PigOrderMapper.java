package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigOrder;

/**
 * 订单Mapper接口
 * 
 * @author ruoyi
 */
public interface PigOrderMapper
{
    /**
     * 查询订单列表
     * 
     * @param pigOrder 订单
     * @return 订单集合
     */
    public List<PigOrder> selectPigOrderList(PigOrder pigOrder);

    /**
     * 查询订单
     * 
     * @param id 订单主键
     * @return 订单
     */
    public PigOrder selectPigOrderById(Long id);

    /**
     * 新增订单
     * 
     * @param pigOrder 订单
     * @return 结果
     */
    public int insertPigOrder(PigOrder pigOrder);

    /**
     * 修改订单
     * 
     * @param pigOrder 订单
     * @return 结果
     */
    public int updatePigOrder(PigOrder pigOrder);

    /**
     * 删除订单
     * 
     * @param id 订单主键
     * @return 结果
     */
    public int deletePigOrderById(Long id);

    /**
     * 批量删除订单
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePigOrderByIds(Long[] ids);

    /**
     * 根据出价id查询订单
     *
     * @param userBidId 用户出价id
     * @return 订单
     */
    public PigOrder selectPigOrderByUserBidId(Long userBidId);

    /**
     * 获取最大主键
     *
     * @return 最大主键
     */
    public Long selectMaxId();
}
