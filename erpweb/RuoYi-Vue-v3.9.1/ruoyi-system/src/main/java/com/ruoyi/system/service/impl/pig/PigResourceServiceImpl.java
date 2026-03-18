package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;

import com.ruoyi.system.domain.pig.PigResource;
import com.ruoyi.system.mapper.pig.PigResourceMapper;
import com.ruoyi.system.service.pig.IPigResourceService;

/**
 * 生猪资源 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PigResourceServiceImpl implements IPigResourceService
{
    @Autowired
    private PigResourceMapper pigResourceMapper;

    @Override
    public List<PigResource> selectPigResourceList(PigResource pigResource)
    {
        return pigResourceMapper.selectPigResourceList(pigResource);
    }

    @Override
    public PigResource selectPigResourceById(Long id)
    {
        return pigResourceMapper.selectPigResourceById(id);
    }

    @Override
    public int insertPigResource(PigResource pigResource)
    {
        return pigResourceMapper.insertPigResource(pigResource);
    }

    @Override
    public int updatePigResource(PigResource pigResource)
    {
        return pigResourceMapper.updatePigResource(pigResource);
    }

    @Override
    public int deletePigResourceById(Long id)
    {
        return pigResourceMapper.deletePigResourceById(id);
    }

    @Override
    public int deletePigResourceByIds(Long[] ids)
    {
        return pigResourceMapper.deletePigResourceByIds(ids);
    }

    @Override
    public String importPigResource(List<PigResource> pigResourceList, Boolean updateSupport, String operName)
    {
        if (StringUtils.isNull(pigResourceList) || pigResourceList.size() == 0)
        {
            throw new ServiceException("导入生猪资源数据不能为空！");
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (PigResource pigResource : pigResourceList)
        {
            try
            {
                if (updateSupport != null && updateSupport && pigResource.getId() != null && selectPigResourceById(pigResource.getId()) != null)
                {
                    pigResource.setUpdateBy(operName);
                    this.updatePigResource(pigResource);
                    successNum++;
                }
                else
                {
                    pigResource.setCreateBy(operName);
                    this.insertPigResource(pigResource);
                    successNum++;
                }
            }
            catch (Exception e)
            {
                failureNum++;
                String msg = failureNum + "、" + pigResource.getId() + " 导入失败：";
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

}
