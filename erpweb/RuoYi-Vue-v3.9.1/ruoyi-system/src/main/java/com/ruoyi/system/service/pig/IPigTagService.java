package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigTag;

/**
 * 生猪标签 Service接口
 * 
 * @author ruoyi
 */
public interface IPigTagService
{
    public List<PigTag> selectPigTagList(PigTag pigTag);
    public PigTag selectPigTagById(Long id);
    public int insertPigTag(PigTag pigTag);
    public int updatePigTag(PigTag pigTag);
    public int deletePigTagById(Long id);
    public int deletePigTagByIds(Long[] ids);
}
