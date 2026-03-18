package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.BusinessMessage;
import com.ruoyi.system.mapper.pig.BusinessMessageMapper;
import com.ruoyi.system.service.pig.IBusinessMessageService;

/**
 * 业务消息 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class BusinessMessageServiceImpl implements IBusinessMessageService
{
    @Autowired
    private BusinessMessageMapper businessMessageMapper;

    @Override
    public List<BusinessMessage> selectBusinessMessageList(BusinessMessage businessMessage)
    {
        return businessMessageMapper.selectBusinessMessageList(businessMessage);
    }

    @Override
    public BusinessMessage selectBusinessMessageById(Long id)
    {
        return businessMessageMapper.selectBusinessMessageById(id);
    }

    @Override
    public int insertBusinessMessage(BusinessMessage businessMessage)
    {
        return businessMessageMapper.insertBusinessMessage(businessMessage);
    }

    @Override
    public int updateBusinessMessage(BusinessMessage businessMessage)
    {
        return businessMessageMapper.updateBusinessMessage(businessMessage);
    }

    @Override
    public int deleteBusinessMessageById(Long id)
    {
        return businessMessageMapper.deleteBusinessMessageById(id);
    }

    @Override
    public int deleteBusinessMessageByIds(Long[] ids)
    {
        return businessMessageMapper.deleteBusinessMessageByIds(ids);
    }

}
