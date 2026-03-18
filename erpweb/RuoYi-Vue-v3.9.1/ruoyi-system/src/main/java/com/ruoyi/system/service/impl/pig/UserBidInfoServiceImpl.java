package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.UserBidInfo;
import com.ruoyi.system.mapper.pig.UserBidInfoMapper;
import com.ruoyi.system.service.pig.IUserBidInfoService;

/**
 * 用户竞价信息维护 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class UserBidInfoServiceImpl implements IUserBidInfoService
{
    @Autowired
    private UserBidInfoMapper userBidInfoMapper;

    @Override
    public List<UserBidInfo> selectUserBidInfoList(UserBidInfo userBidInfo)
    {
        return userBidInfoMapper.selectUserBidInfoList(userBidInfo);
    }

    @Override
    public UserBidInfo selectUserBidInfoById(Long id)
    {
        return userBidInfoMapper.selectUserBidInfoById(id);
    }

    @Override
    public int insertUserBidInfo(UserBidInfo userBidInfo)
    {
        return userBidInfoMapper.insertUserBidInfo(userBidInfo);
    }

    @Override
    public int updateUserBidInfo(UserBidInfo userBidInfo)
    {
        return userBidInfoMapper.updateUserBidInfo(userBidInfo);
    }

    @Override
    public int deleteUserBidInfoById(Long id)
    {
        return userBidInfoMapper.deleteUserBidInfoById(id);
    }

    @Override
    public int deleteUserBidInfoByIds(Long[] ids)
    {
        return userBidInfoMapper.deleteUserBidInfoByIds(ids);
    }

}
