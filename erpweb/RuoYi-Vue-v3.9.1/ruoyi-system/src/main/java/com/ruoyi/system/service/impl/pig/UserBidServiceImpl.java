package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.mapper.pig.UserBidMapper;
import com.ruoyi.system.service.pig.IUserBidService;

/**
 * 用户出价 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class UserBidServiceImpl implements IUserBidService
{
    @Autowired
    private UserBidMapper userBidMapper;

    @Override
    public List<UserBid> selectUserBidList(UserBid userBid)
    {
        return userBidMapper.selectUserBidList(userBid);
    }

    @Override
    public UserBid selectUserBidById(Long id)
    {
        return userBidMapper.selectUserBidById(id);
    }

    @Override
    public int insertUserBid(UserBid userBid)
    {
        return userBidMapper.insertUserBid(userBid);
    }

    @Override
    public int updateUserBid(UserBid userBid)
    {
        return userBidMapper.updateUserBid(userBid);
    }

    @Override
    public int deleteUserBidById(Long id)
    {
        return userBidMapper.deleteUserBidById(id);
    }

    @Override
    public int deleteUserBidByIds(Long[] ids)
    {
        return userBidMapper.deleteUserBidByIds(ids);
    }

}
