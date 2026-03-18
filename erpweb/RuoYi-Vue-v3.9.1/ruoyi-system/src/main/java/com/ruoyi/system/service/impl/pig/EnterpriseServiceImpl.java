package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.Enterprise;
import com.ruoyi.system.mapper.pig.EnterpriseMapper;
import com.ruoyi.system.service.pig.IEnterpriseService;

/**
 * 企业信息 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class EnterpriseServiceImpl implements IEnterpriseService
{
    @Autowired
    private EnterpriseMapper enterpriseMapper;

    @Override
    public List<Enterprise> selectEnterpriseList(Enterprise enterprise)
    {
        return enterpriseMapper.selectEnterpriseList(enterprise);
    }

    @Override
    public Enterprise selectEnterpriseById(Long id)
    {
        return enterpriseMapper.selectEnterpriseById(id);
    }

    @Override
    public int insertEnterprise(Enterprise enterprise)
    {
        return enterpriseMapper.insertEnterprise(enterprise);
    }

    @Override
    public int updateEnterprise(Enterprise enterprise)
    {
        return enterpriseMapper.updateEnterprise(enterprise);
    }

    @Override
    public int deleteEnterpriseById(Long id)
    {
        return enterpriseMapper.deleteEnterpriseById(id);
    }

    @Override
    public int deleteEnterpriseByIds(Long[] ids)
    {
        return enterpriseMapper.deleteEnterpriseByIds(ids);
    }

}
