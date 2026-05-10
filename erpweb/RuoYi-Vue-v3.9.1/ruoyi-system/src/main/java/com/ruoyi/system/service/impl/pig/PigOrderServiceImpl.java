package com.ruoyi.system.service.impl.pig;

import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
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
        if (StringUtils.isBlank(pigOrder.getPayStatus())) {
            pigOrder.setPayStatus("UNPAID");
        }
        if (pigOrder.getOrderCreateEventTime() == null) {
            pigOrder.setOrderCreateEventTime(new Date());
        }
        return pigOrderMapper.insertPigOrder(pigOrder);
    }

    @Override
    public int updatePigOrder(PigOrder pigOrder)
    {
        if (pigOrder == null || pigOrder.getId() == null)
        {
            return pigOrderMapper.updatePigOrder(pigOrder);
        }

        PigOrder dbOrder = pigOrderMapper.selectPigOrderById(pigOrder.getId());
        Date now = new Date();

        if (dbOrder != null)
        {
            if ("WAIT_RECEIVE".equalsIgnoreCase(pigOrder.getOrderStatus()) && dbOrder.getShipEventTime() == null)
            {
                pigOrder.setShipEventTime(now);
            }
            if ("COMPLETED".equalsIgnoreCase(pigOrder.getOrderStatus()) && dbOrder.getCompletedEventTime() == null)
            {
                pigOrder.setCompletedEventTime(now);
            }
        }

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
