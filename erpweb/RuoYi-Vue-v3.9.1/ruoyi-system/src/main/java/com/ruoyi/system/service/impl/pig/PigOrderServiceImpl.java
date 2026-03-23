package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.mapper.pig.PigOrderMapper;
import com.ruoyi.system.service.pig.IPigOrderService;

/**
 * 订单 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PigOrderServiceImpl implements IPigOrderService
{
    @Autowired
    private PigOrderMapper pigOrderMapper;

    @Override
    public List<PigOrder> selectPigOrderList(PigOrder pigOrder)
    {
        return pigOrderMapper.selectPigOrderList(pigOrder);
    }

    @Override
    public PigOrder selectPigOrderById(Long id)
    {
        return pigOrderMapper.selectPigOrderById(id);
    }

    @Override
    public int insertPigOrder(PigOrder pigOrder)
    {
        pigOrder.setOrderNo(generateOrderNo());
        return pigOrderMapper.insertPigOrder(pigOrder);
    }

    @Override
    public int updatePigOrder(PigOrder pigOrder)
    {
        return pigOrderMapper.updatePigOrder(pigOrder);
    }

    @Override
    public int deletePigOrderById(Long id)
    {
        return pigOrderMapper.deletePigOrderById(id);
    }

    @Override
    public int deletePigOrderByIds(Long[] ids)
    {
        return pigOrderMapper.deletePigOrderByIds(ids);
    }

    @Override
    public String generateOrderNo()
    {
        Long maxId = pigOrderMapper.selectMaxId();
        long nextId = maxId == null ? 1L : maxId + 1L;
        return "ORDER-" + String.format("%012d", nextId);
    }

}
