package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigOrder;

/**
 * 订单 Service接口
 * 
 * @author ruoyi
 */
public interface IPigOrderService
{
    public List<PigOrder> selectPigOrderList(PigOrder pigOrder);
    public PigOrder selectPigOrderById(Long id);
    public int insertPigOrder(PigOrder pigOrder);
    public int updatePigOrder(PigOrder pigOrder);
    public int deletePigOrderById(Long id);
    public int deletePigOrderByIds(Long[] ids);
}
