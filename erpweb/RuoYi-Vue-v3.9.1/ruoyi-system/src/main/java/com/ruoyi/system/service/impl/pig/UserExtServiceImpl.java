package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.UserExt;
import com.ruoyi.system.mapper.pig.UserExtMapper;
import com.ruoyi.system.service.pig.IUserExtService;

/**
 * 用户信息拓展 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class UserExtServiceImpl implements IUserExtService
{
    @Autowired
    private UserExtMapper userExtMapper;

    @Override
    public List<UserExt> selectUserExtList(UserExt userExt)
    {
        return userExtMapper.selectUserExtList(userExt);
    }

    @Override
    public UserExt selectUserExtById(Long id)
    {
        return userExtMapper.selectUserExtById(id);
    }

    @Override
    public int insertUserExt(UserExt userExt)
    {
        return userExtMapper.insertUserExt(userExt);
    }

    @Override
    public int updateUserExt(UserExt userExt)
    {
        return userExtMapper.updateUserExt(userExt);
    }

    @Override
    public int deleteUserExtById(Long id)
    {
        return userExtMapper.deleteUserExtById(id);
    }

    @Override
    public int deleteUserExtByIds(Long[] ids)
    {
        return userExtMapper.deleteUserExtByIds(ids);
    }

}
