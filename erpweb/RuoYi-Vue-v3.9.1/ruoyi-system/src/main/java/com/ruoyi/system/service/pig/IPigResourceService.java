package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigResource;

/**
 * 生猪资源 Service接口
 * 
 * @author ruoyi
 */
public interface IPigResourceService
{
    public List<PigResource> selectPigResourceList(PigResource pigResource);
    public PigResource selectPigResourceById(Long id);
    public int insertPigResource(PigResource pigResource);
    public int updatePigResource(PigResource pigResource);
    public int deletePigResourceById(Long id);
    public int deletePigResourceByIds(Long[] ids);
    public String importPigResource(List<PigResource> pigResourceList, Boolean updateSupport, String operName);

    /**
     * 生成生猪资源编码
     *
     * @return 生猪资源编码
     */
    public String generatePigResourceCode();
}
