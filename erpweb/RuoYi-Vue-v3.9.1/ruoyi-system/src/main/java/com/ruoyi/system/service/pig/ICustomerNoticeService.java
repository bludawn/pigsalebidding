package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.CustomerNotice;

/**
 * 客户端通知 Service接口
 */
public interface ICustomerNoticeService
{
    public List<CustomerNotice> selectCustomerNoticeList(CustomerNotice customerNotice);

    public CustomerNotice selectCustomerNoticeById(Long id);

    public CustomerNotice selectCustomerNoticeBySourceEventId(String sourceEventId);

    public int insertCustomerNotice(CustomerNotice customerNotice);

    public int createNoticeIfAbsent(CustomerNotice customerNotice);

    public int updateCustomerNotice(CustomerNotice customerNotice);

    public Long countUnreadByUserId(Long userId);

    public Long countUnreadByUserIdAndBizType(Long userId, String bizType);

    public int markReadByIdAndUserId(Long id, Long userId, String updateBy);

    public int markAllReadByUserId(Long userId, String bizType, String updateBy);
}
