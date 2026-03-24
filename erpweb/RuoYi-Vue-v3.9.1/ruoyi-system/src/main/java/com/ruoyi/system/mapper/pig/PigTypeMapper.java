package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.PigType;

/**
 * 生猪类型Mapper接口
 * 
 * @author ruoyi
 */
public interface PigTypeMapper
{
    /**
     * 查询生猪类型列表
     * 
     * @param pigType 生猪类型
     * @return 生猪类型集合
     */
    public List<PigType> selectPigTypeList(PigType pigType);

    /**
     * 查询生猪类型
     * 
     * @param id 生猪类型主键
     * @return 生猪类型
     */
    public PigType selectPigTypeById(Long id);

    /**
     * 新增生猪类型
     * 
     * @param pigType 生猪类型
     * @return 结果
     */
    public int insertPigType(PigType pigType);

    /**
     * 修改生猪类型
     * 
     * @param pigType 生猪类型
     * @return 结果
     */
    public int updatePigType(PigType pigType);

    /**
     * 删除生猪类型
     * 
     * @param id 生猪类型主键
     * @return 结果
     */
    public int deletePigTypeById(Long id);

    /**
     * 批量删除生猪类型
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePigTypeByIds(Long[] ids);

    /**
     * 获取最大主键
     *
     * @return 最大主键
     */
    public Long selectMaxId();

    /**
     * 通过生猪编码查询生猪类型
     *
     * @param pigCode 生猪编码
     * @return 生猪类型
     */
    public PigType selectPigTypeByPigCode(String pigCode);
}
