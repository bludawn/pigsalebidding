package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.CustomerNotice;
import com.ruoyi.system.mapper.pig.CustomerNoticeMapper;
import com.ruoyi.system.service.pig.ICustomerNoticeService;

/**
 * 客户端通知 Service业务层处理
 */
@Service
public class CustomerNoticeServiceImpl implements ICustomerNoticeService
{
    @Autowired
    private CustomerNoticeMapper customerNoticeMapper;

    @Override
    public List<CustomerNotice> selectCustomerNoticeList(CustomerNotice customerNotice)
    {
        return customerNoticeMapper.selectCustomerNoticeList(customerNotice);
    }

    @Override
    public CustomerNotice selectCustomerNoticeById(Long id)
    {
        return customerNoticeMapper.selectCustomerNoticeById(id);
    }

    @Override
    public CustomerNotice selectCustomerNoticeBySourceEventId(String sourceEventId)
    {
        if (StringUtils.isBlank(sourceEventId))
        {
            return null;
        }
        return customerNoticeMapper.selectCustomerNoticeBySourceEventId(sourceEventId);
    }

    @Override
    public int insertCustomerNotice(CustomerNotice customerNotice)
    {
        return customerNoticeMapper.insertCustomerNotice(customerNotice);
    }

    @Override
    public int createNoticeIfAbsent(CustomerNotice customerNotice)
    {
        if (customerNotice == null)
        {
            return 0;
        }
        if (StringUtils.isNotBlank(customerNotice.getSourceEventId()))
        {
            CustomerNotice exists = customerNoticeMapper.selectCustomerNoticeBySourceEventId(customerNotice.getSourceEventId());
            if (exists != null)
            {
                return 0;
            }
        }
        return customerNoticeMapper.insertCustomerNotice(customerNotice);
    }

    @Override
    public int updateCustomerNotice(CustomerNotice customerNotice)
    {
        return customerNoticeMapper.updateCustomerNotice(customerNotice);
    }

    @Override
    public Long countUnreadByUserId(Long userId)
    {
        Long count = customerNoticeMapper.countUnreadByUserId(userId);
        return count == null ? 0L : count;
    }

    @Override
    public Long countUnreadByUserIdAndBizType(Long userId, String bizType)
    {
        Long count = customerNoticeMapper.countUnreadByUserIdAndBizType(userId, bizType);
        return count == null ? 0L : count;
    }

    @Override
    public int markReadByIdAndUserId(Long id, Long userId, String updateBy)
    {
        return customerNoticeMapper.markReadByIdAndUserId(id, userId, updateBy);
    }

    @Override
    public int markAllReadByUserId(Long userId, String bizType, String updateBy)
    {
        return customerNoticeMapper.markAllReadByUserId(userId, bizType, updateBy);
    }
}
