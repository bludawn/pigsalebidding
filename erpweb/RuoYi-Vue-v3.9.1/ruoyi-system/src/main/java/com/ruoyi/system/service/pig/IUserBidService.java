package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserBid;

/**
 * 用户出价 Service接口
 * 
 * @author ruoyi
 */
public interface IUserBidService
{
    public List<UserBid> selectUserBidList(UserBid userBid);
    public UserBid selectUserBidById(Long id);
    public int insertUserBid(UserBid userBid);
    public int updateUserBid(UserBid userBid);
    public int deleteUserBidById(Long id);
    public int deleteUserBidByIds(Long[] ids);
}
