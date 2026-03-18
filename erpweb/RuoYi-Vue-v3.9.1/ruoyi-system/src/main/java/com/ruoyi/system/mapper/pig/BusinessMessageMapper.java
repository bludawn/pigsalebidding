package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.BusinessMessage;

/**
 * 业务消息Mapper接口
 * 
 * @author ruoyi
 */
public interface BusinessMessageMapper
{
    /**
     * 查询业务消息列表
     * 
     * @param businessMessage 业务消息
     * @return 业务消息集合
     */
    public List<BusinessMessage> selectBusinessMessageList(BusinessMessage businessMessage);

    /**
     * 查询业务消息
     * 
     * @param id 业务消息主键
     * @return 业务消息
     */
    public BusinessMessage selectBusinessMessageById(Long id);

    /**
     * 新增业务消息
     * 
     * @param businessMessage 业务消息
     * @return 结果
     */
    public int insertBusinessMessage(BusinessMessage businessMessage);

    /**
     * 修改业务消息
     * 
     * @param businessMessage 业务消息
     * @return 结果
     */
    public int updateBusinessMessage(BusinessMessage businessMessage);

    /**
     * 删除业务消息
     * 
     * @param id 业务消息主键
     * @return 结果
     */
    public int deleteBusinessMessageById(Long id);

    /**
     * 批量删除业务消息
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteBusinessMessageByIds(Long[] ids);
}
