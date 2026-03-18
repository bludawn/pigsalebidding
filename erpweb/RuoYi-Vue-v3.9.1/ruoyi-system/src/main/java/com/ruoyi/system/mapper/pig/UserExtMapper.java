package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserExt;

/**
 * 用户信息拓展Mapper接口
 * 
 * @author ruoyi
 */
public interface UserExtMapper
{
    /**
     * 查询用户信息拓展列表
     * 
     * @param userExt 用户信息拓展
     * @return 用户信息拓展集合
     */
    public List<UserExt> selectUserExtList(UserExt userExt);

    /**
     * 查询用户信息拓展
     * 
     * @param id 用户信息拓展主键
     * @return 用户信息拓展
     */
    public UserExt selectUserExtById(Long id);

    /**
     * 新增用户信息拓展
     * 
     * @param userExt 用户信息拓展
     * @return 结果
     */
    public int insertUserExt(UserExt userExt);

    /**
     * 修改用户信息拓展
     * 
     * @param userExt 用户信息拓展
     * @return 结果
     */
    public int updateUserExt(UserExt userExt);

    /**
     * 删除用户信息拓展
     * 
     * @param id 用户信息拓展主键
     * @return 结果
     */
    public int deleteUserExtById(Long id);

    /**
     * 批量删除用户信息拓展
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteUserExtByIds(Long[] ids);
}
