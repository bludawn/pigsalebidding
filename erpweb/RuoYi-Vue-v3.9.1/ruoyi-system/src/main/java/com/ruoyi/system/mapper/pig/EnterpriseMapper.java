package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Enterprise;

/**
 * 企业信息Mapper接口
 * 
 * @author ruoyi
 */
public interface EnterpriseMapper
{
    /**
     * 查询企业信息列表
     * 
     * @param enterprise 企业信息
     * @return 企业信息集合
     */
    public List<Enterprise> selectEnterpriseList(Enterprise enterprise);

    /**
     * 查询企业信息
     * 
     * @param id 企业信息主键
     * @return 企业信息
     */
    public Enterprise selectEnterpriseById(Long id);

    /**
     * 新增企业信息
     * 
     * @param enterprise 企业信息
     * @return 结果
     */
    public int insertEnterprise(Enterprise enterprise);

    /**
     * 修改企业信息
     * 
     * @param enterprise 企业信息
     * @return 结果
     */
    public int updateEnterprise(Enterprise enterprise);

    /**
     * 删除企业信息
     * 
     * @param id 企业信息主键
     * @return 结果
     */
    public int deleteEnterpriseById(Long id);

    /**
     * 批量删除企业信息
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteEnterpriseByIds(Long[] ids);
}
