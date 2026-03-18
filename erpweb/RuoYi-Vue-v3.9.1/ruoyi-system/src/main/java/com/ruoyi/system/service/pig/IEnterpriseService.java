package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Enterprise;

/**
 * 企业信息 Service接口
 * 
 * @author ruoyi
 */
public interface IEnterpriseService
{
    public List<Enterprise> selectEnterpriseList(Enterprise enterprise);
    public Enterprise selectEnterpriseById(Long id);
    public int insertEnterprise(Enterprise enterprise);
    public int updateEnterprise(Enterprise enterprise);
    public int deleteEnterpriseById(Long id);
    public int deleteEnterpriseByIds(Long[] ids);
}
