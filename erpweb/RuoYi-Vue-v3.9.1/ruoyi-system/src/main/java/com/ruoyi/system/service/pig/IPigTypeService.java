package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigType;

/**
 * 生猪类型 Service接口
 * 
 * @author ruoyi
 */
public interface IPigTypeService
{
    public List<PigType> selectPigTypeList(PigType pigType);
    public PigType selectPigTypeById(Long id);
    public int insertPigType(PigType pigType);
    public int updatePigType(PigType pigType);
    public int deletePigTypeById(Long id);
    public int deletePigTypeByIds(Long[] ids);
    public String importPigType(List<PigType> pigTypeList, Boolean updateSupport, String operName);

    /**
     * 生成生猪类型编码
     *
     * @return 生猪类型编码
     */
    public String generatePigTypeCode();
}
