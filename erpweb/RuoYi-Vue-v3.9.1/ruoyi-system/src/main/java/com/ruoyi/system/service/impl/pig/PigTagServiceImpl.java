package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.PigTag;
import com.ruoyi.system.mapper.pig.PigTagMapper;
import com.ruoyi.system.service.pig.IPigTagService;

/**
 * 生猪标签 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PigTagServiceImpl implements IPigTagService
{
    @Autowired
    private PigTagMapper pigTagMapper;

    @Override
    public List<PigTag> selectPigTagList(PigTag pigTag)
    {
        return pigTagMapper.selectPigTagList(pigTag);
    }

    @Override
    public PigTag selectPigTagById(Long id)
    {
        return pigTagMapper.selectPigTagById(id);
    }

    @Override
    public int insertPigTag(PigTag pigTag)
    {
        return pigTagMapper.insertPigTag(pigTag);
    }

    @Override
    public int updatePigTag(PigTag pigTag)
    {
        return pigTagMapper.updatePigTag(pigTag);
    }

    @Override
    public int deletePigTagById(Long id)
    {
        return pigTagMapper.deletePigTagById(id);
    }

    @Override
    public int deletePigTagByIds(Long[] ids)
    {
        return pigTagMapper.deletePigTagByIds(ids);
    }

}
