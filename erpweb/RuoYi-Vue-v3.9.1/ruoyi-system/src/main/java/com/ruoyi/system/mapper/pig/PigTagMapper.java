package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigTag;

/**
 * 生猪标签Mapper接口
 * 
 * @author ruoyi
 */
public interface PigTagMapper
{
    /**
     * 查询生猪标签列表
     * 
     * @param pigTag 生猪标签
     * @return 生猪标签集合
     */
    public List<PigTag> selectPigTagList(PigTag pigTag);

    /**
     * 查询生猪标签
     * 
     * @param id 生猪标签主键
     * @return 生猪标签
     */
    public PigTag selectPigTagById(Long id);

    /**
     * 新增生猪标签
     * 
     * @param pigTag 生猪标签
     * @return 结果
     */
    public int insertPigTag(PigTag pigTag);

    /**
     * 修改生猪标签
     * 
     * @param pigTag 生猪标签
     * @return 结果
     */
    public int updatePigTag(PigTag pigTag);

    /**
     * 删除生猪标签
     * 
     * @param id 生猪标签主键
     * @return 结果
     */
    public int deletePigTagById(Long id);

    /**
     * 批量删除生猪标签
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePigTagByIds(Long[] ids);
}
