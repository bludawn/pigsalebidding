package com.ruoyi.system.mapper.pig;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.system.domain.pig.CustomerNotice;

/**
 * 客户端通知Mapper接口
 */
public interface CustomerNoticeMapper
{
    public List<CustomerNotice> selectCustomerNoticeList(CustomerNotice customerNotice);

    public CustomerNotice selectCustomerNoticeById(Long id);

    public CustomerNotice selectCustomerNoticeBySourceEventId(String sourceEventId);

    public int insertCustomerNotice(CustomerNotice customerNotice);

    public int updateCustomerNotice(CustomerNotice customerNotice);

    public Long countUnreadByUserId(Long userId);

    public Long countUnreadByUserIdAndBizType(@Param("userId") Long userId, @Param("bizType") String bizType);

    public int markReadByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId, @Param("updateBy") String updateBy);

    public int markAllReadByUserId(@Param("userId") Long userId, @Param("bizType") String bizType, @Param("updateBy") String updateBy);
}
