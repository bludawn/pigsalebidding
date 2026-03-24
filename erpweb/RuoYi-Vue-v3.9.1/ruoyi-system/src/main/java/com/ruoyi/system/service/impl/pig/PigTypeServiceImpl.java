package com.ruoyi.system.service.impl.pig;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.domain.pig.PigTag;
import com.ruoyi.system.domain.pig.PigType;
import com.ruoyi.system.mapper.pig.PigTagMapper;
import com.ruoyi.system.mapper.pig.PigTypeMapper;
import com.ruoyi.system.service.pig.IPigTypeService;

/**
 * 生猪类型 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PigTypeServiceImpl implements IPigTypeService
{
    @Autowired
    private PigTypeMapper pigTypeMapper;

    @Autowired
    private PigTagMapper pigTagMapper;

    @Override
    public List<PigType> selectPigTypeList(PigType pigType)
    {
        return pigTypeMapper.selectPigTypeList(pigType);
    }

    @Override
    public PigType selectPigTypeById(Long id)
    {
        return pigTypeMapper.selectPigTypeById(id);
    }

    @Override
    public int insertPigType(PigType pigType)
    {
        pigType.setPigCode(generatePigTypeCode());
        return pigTypeMapper.insertPigType(pigType);
    }

    @Override
    public int updatePigType(PigType pigType)
    {
        return pigTypeMapper.updatePigType(pigType);
    }

    @Override
    public int deletePigTypeById(Long id)
    {
        return pigTypeMapper.deletePigTypeById(id);
    }

    @Override
    public int deletePigTypeByIds(Long[] ids)
    {
        return pigTypeMapper.deletePigTypeByIds(ids);
    }

    @Override
    public String generatePigTypeCode()
    {
        Long maxId = pigTypeMapper.selectMaxId();
        long nextId = maxId == null ? 1L : maxId + 1L;
        return "PT-" + nextId;
    }

    @Override
    public void fillPigTagNames(List<PigType> pigTypeList)
    {
        if (pigTypeList == null || pigTypeList.isEmpty())
        {
            return;
        }
        Map<Long, String> tagIdNameMap = getPigTagIdNameMap();
        for (PigType pigType : pigTypeList)
        {
            pigType.setPigTagNames(convertPigTagIdsToNames(pigType.getPigTagIds(), tagIdNameMap));
        }
    }

    @Override
    public String importPigType(List<PigType> pigTypeList, Boolean updateSupport, String operName)
    {
        if (StringUtils.isNull(pigTypeList) || pigTypeList.size() == 0)
        {
            throw new ServiceException("导入生猪类型数据不能为空！");
        }
        Map<String, Long> tagNameIdMap = new HashMap<>();
        Map<String, Long> tagIdMap = new HashMap<>();
        List<PigTag> pigTags = pigTagMapper.selectPigTagList(new PigTag());
        for (PigTag tag : pigTags)
        {
            if (StringUtils.isNotEmpty(tag.getTagName()))
            {
                tagNameIdMap.put(tag.getTagName(), tag.getId());
            }
            if (tag.getId() != null)
            {
                tagIdMap.put(String.valueOf(tag.getId()), tag.getId());
            }
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (PigType pigType : pigTypeList)
        {
            try
            {
                pigType.setPigTagIds(convertPigTagNamesToIds(pigType.getPigTagNames(), tagNameIdMap, tagIdMap));
                if (updateSupport != null && updateSupport)
                {
                    if (StringUtils.isEmpty(pigType.getPigCode()))
                    {
                        pigType.setCreateBy(operName);
                        this.insertPigType(pigType);
                        successNum++;
                        continue;
                    }
                    PigType exist = pigTypeMapper.selectPigTypeByPigCode(pigType.getPigCode());
                    if (exist != null)
                    {
                        pigType.setId(exist.getId());
                        pigType.setUpdateBy(operName);
                        this.updatePigType(pigType);
                    }
                    else
                    {
                        pigType.setCreateBy(operName);
                        this.insertPigType(pigType);
                    }
                    successNum++;
                }
                else
                {
                    pigType.setCreateBy(operName);
                    this.insertPigType(pigType);
                    successNum++;
                }
            }
            catch (Exception e)
            {
                failureNum++;
                String pigCode = StringUtils.isNotEmpty(pigType.getPigCode()) ? pigType.getPigCode() : "未知编码";
                String msg = failureNum + "、" + pigCode + " 导入失败：";
                failureMsg.append(msg).append(e.getMessage()).append("\n");
            }
        }
        if (failureNum > 0)
        {
            failureMsg.insert(0, "很抱歉，导入失败！共 " + failureNum + " 条数据格式不正确，错误如下：\n");
            throw new ServiceException(failureMsg.toString());
        }
        else
        {
            successMsg.insert(0, "恭喜您，数据已全部导入成功！共 " + successNum + " 条");
        }
        return successMsg.toString();
    }

    private Map<Long, String> getPigTagIdNameMap()
    {
        List<PigTag> pigTags = pigTagMapper.selectPigTagList(new PigTag());
        Map<Long, String> tagIdNameMap = new HashMap<>();
        for (PigTag tag : pigTags)
        {
            if (tag.getId() != null)
            {
                tagIdNameMap.put(tag.getId(), tag.getTagName());
            }
        }
        return tagIdNameMap;
    }

    private String convertPigTagNamesToIds(String pigTagNames, Map<String, Long> tagNameIdMap, Map<String, Long> tagIdMap)
    {
        if (StringUtils.isEmpty(pigTagNames))
        {
            return null;
        }
        String[] parts = pigTagNames.split("[,，、;；]");
        List<String> ids = new ArrayList<>();
        for (String part : parts)
        {
            if (StringUtils.isEmpty(part))
            {
                continue;
            }
            String name = part.trim();
            if (StringUtils.isEmpty(name))
            {
                continue;
            }
            Long tagId = tagNameIdMap.get(name);
            if (tagId == null)
            {
                tagId = tagIdMap.get(name);
            }
            if (tagId == null)
            {
                throw new ServiceException("生猪标签【" + name + "】不存在");
            }
            ids.add(String.valueOf(tagId));
        }
        return ids.isEmpty() ? null : String.join(",", ids);
    }

    private String convertPigTagIdsToNames(String pigTagIds, Map<Long, String> tagIdNameMap)
    {
        if (StringUtils.isEmpty(pigTagIds))
        {
            return null;
        }
        String[] parts = pigTagIds.split(",");
        List<String> names = new ArrayList<>();
        for (String part : parts)
        {
            if (StringUtils.isEmpty(part))
            {
                continue;
            }
            String value = part.trim();
            if (StringUtils.isEmpty(value))
            {
                continue;
            }
            Long tagId = null;
            try
            {
                tagId = Long.valueOf(value);
            }
            catch (NumberFormatException ex)
            {
                tagId = null;
            }
            String name = tagId != null ? tagIdNameMap.get(tagId) : null;
            names.add(name != null ? name : value);
        }
        return names.isEmpty() ? null : String.join("、", names);
    }

}
