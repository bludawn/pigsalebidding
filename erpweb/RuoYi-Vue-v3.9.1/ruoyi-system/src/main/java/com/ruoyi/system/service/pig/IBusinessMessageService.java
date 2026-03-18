package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.BusinessMessage;

/**
 * 业务消息 Service接口
 * 
 * @author ruoyi
 */
public interface IBusinessMessageService
{
    public List<BusinessMessage> selectBusinessMessageList(BusinessMessage businessMessage);
    public BusinessMessage selectBusinessMessageById(Long id);
    public int insertBusinessMessage(BusinessMessage businessMessage);
    public int updateBusinessMessage(BusinessMessage businessMessage);
    public int deleteBusinessMessageById(Long id);
    public int deleteBusinessMessageByIds(Long[] ids);
}
