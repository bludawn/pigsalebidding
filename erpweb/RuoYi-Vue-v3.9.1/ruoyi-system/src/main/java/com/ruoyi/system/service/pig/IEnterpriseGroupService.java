package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.EnterpriseGroup;

/**
 * 企业分组 Service接口
 * 
 * @author ruoyi
 */
public interface IEnterpriseGroupService
{
    public List<EnterpriseGroup> selectEnterpriseGroupList(EnterpriseGroup enterpriseGroup);
    public EnterpriseGroup selectEnterpriseGroupById(Long id);
    public int insertEnterpriseGroup(EnterpriseGroup enterpriseGroup);
    public int updateEnterpriseGroup(EnterpriseGroup enterpriseGroup);
    public int deleteEnterpriseGroupById(Long id);
    public int deleteEnterpriseGroupByIds(Long[] ids);
}
