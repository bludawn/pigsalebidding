package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.EnterpriseGroup;
import com.ruoyi.system.mapper.pig.EnterpriseGroupMapper;
import com.ruoyi.system.service.pig.IEnterpriseGroupService;

/**
 * 企业分组 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class EnterpriseGroupServiceImpl implements IEnterpriseGroupService
{
    @Autowired
    private EnterpriseGroupMapper enterpriseGroupMapper;

    @Override
    public List<EnterpriseGroup> selectEnterpriseGroupList(EnterpriseGroup enterpriseGroup)
    {
        return enterpriseGroupMapper.selectEnterpriseGroupList(enterpriseGroup);
    }

    @Override
    public EnterpriseGroup selectEnterpriseGroupById(Long id)
    {
        return enterpriseGroupMapper.selectEnterpriseGroupById(id);
    }

    @Override
    public int insertEnterpriseGroup(EnterpriseGroup enterpriseGroup)
    {
        return enterpriseGroupMapper.insertEnterpriseGroup(enterpriseGroup);
    }

    @Override
    public int updateEnterpriseGroup(EnterpriseGroup enterpriseGroup)
    {
        return enterpriseGroupMapper.updateEnterpriseGroup(enterpriseGroup);
    }

    @Override
    public int deleteEnterpriseGroupById(Long id)
    {
        return enterpriseGroupMapper.deleteEnterpriseGroupById(id);
    }

    @Override
    public int deleteEnterpriseGroupByIds(Long[] ids)
    {
        return enterpriseGroupMapper.deleteEnterpriseGroupByIds(ids);
    }

}
