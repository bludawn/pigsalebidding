package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserBidInfo;

/**
 * 用户竞价信息维护 Service接口
 * 
 * @author ruoyi
 */
public interface IUserBidInfoService
{
    public List<UserBidInfo> selectUserBidInfoList(UserBidInfo userBidInfo);
    public UserBidInfo selectUserBidInfoById(Long id);
    public int insertUserBidInfo(UserBidInfo userBidInfo);
    public int updateUserBidInfo(UserBidInfo userBidInfo);
    public int deleteUserBidInfoById(Long id);
    public int deleteUserBidInfoByIds(Long[] ids);
}
