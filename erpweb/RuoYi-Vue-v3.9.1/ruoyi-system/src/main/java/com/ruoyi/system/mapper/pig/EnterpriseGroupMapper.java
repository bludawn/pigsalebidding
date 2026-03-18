package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.EnterpriseGroup;

/**
 * 企业分组Mapper接口
 * 
 * @author ruoyi
 */
public interface EnterpriseGroupMapper
{
    /**
     * 查询企业分组列表
     * 
     * @param enterpriseGroup 企业分组
     * @return 企业分组集合
     */
    public List<EnterpriseGroup> selectEnterpriseGroupList(EnterpriseGroup enterpriseGroup);

    /**
     * 查询企业分组
     * 
     * @param id 企业分组主键
     * @return 企业分组
     */
    public EnterpriseGroup selectEnterpriseGroupById(Long id);

    /**
     * 新增企业分组
     * 
     * @param enterpriseGroup 企业分组
     * @return 结果
     */
    public int insertEnterpriseGroup(EnterpriseGroup enterpriseGroup);

    /**
     * 修改企业分组
     * 
     * @param enterpriseGroup 企业分组
     * @return 结果
     */
    public int updateEnterpriseGroup(EnterpriseGroup enterpriseGroup);

    /**
     * 删除企业分组
     * 
     * @param id 企业分组主键
     * @return 结果
     */
    public int deleteEnterpriseGroupById(Long id);

    /**
     * 批量删除企业分组
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteEnterpriseGroupByIds(Long[] ids);
}
