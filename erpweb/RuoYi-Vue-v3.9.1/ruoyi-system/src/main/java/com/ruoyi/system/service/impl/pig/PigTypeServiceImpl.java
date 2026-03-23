package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;

import com.ruoyi.system.domain.pig.PigType;
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
    public String importPigType(List<PigType> pigTypeList, Boolean updateSupport, String operName)
    {
        if (StringUtils.isNull(pigTypeList) || pigTypeList.size() == 0)
        {
            throw new ServiceException("导入生猪类型数据不能为空！");
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (PigType pigType : pigTypeList)
        {
            try
            {
                if (updateSupport != null && updateSupport && pigType.getId() != null && selectPigTypeById(pigType.getId()) != null)
                {
                    pigType.setUpdateBy(operName);
                    this.updatePigType(pigType);
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
                String msg = failureNum + "、" + pigType.getId() + " 导入失败：";
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
