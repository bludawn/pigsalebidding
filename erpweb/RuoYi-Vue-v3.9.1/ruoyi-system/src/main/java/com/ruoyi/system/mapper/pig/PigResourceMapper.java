package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigResource;

/**
 * 生猪资源Mapper接口
 * 
 * @author ruoyi
 */
public interface PigResourceMapper
{
    /**
     * 查询生猪资源列表
     * 
     * @param pigResource 生猪资源
     * @return 生猪资源集合
     */
    public List<PigResource> selectPigResourceList(PigResource pigResource);

    /**
     * 查询生猪资源
     * 
     * @param id 生猪资源主键
     * @return 生猪资源
     */
    public PigResource selectPigResourceById(Long id);

    /**
     * 新增生猪资源
     * 
     * @param pigResource 生猪资源
     * @return 结果
     */
    public int insertPigResource(PigResource pigResource);

    /**
     * 修改生猪资源
     * 
     * @param pigResource 生猪资源
     * @return 结果
     */
    public int updatePigResource(PigResource pigResource);

    /**
     * 删除生猪资源
     * 
     * @param id 生猪资源主键
     * @return 结果
     */
    public int deletePigResourceById(Long id);

    /**
     * 批量删除生猪资源
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePigResourceByIds(Long[] ids);

    /**
     * 获取最大主键
     *
     * @return 最大主键
     */
    public Long selectMaxId();
}
