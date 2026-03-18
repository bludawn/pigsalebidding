package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserExt;

/**
 * 用户信息拓展 Service接口
 * 
 * @author ruoyi
 */
public interface IUserExtService
{
    public List<UserExt> selectUserExtList(UserExt userExt);
    public UserExt selectUserExtById(Long id);
    public int insertUserExt(UserExt userExt);
    public int updateUserExt(UserExt userExt);
    public int deleteUserExtById(Long id);
    public int deleteUserExtByIds(Long[] ids);
}
