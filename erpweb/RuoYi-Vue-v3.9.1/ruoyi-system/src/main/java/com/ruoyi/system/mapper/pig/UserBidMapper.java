package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserBid;

/**
 * 用户出价Mapper接口
 * 
 * @author ruoyi
 */
public interface UserBidMapper
{
    /**
     * 查询用户出价列表
     * 
     * @param userBid 用户出价
     * @return 用户出价集合
     */
    public List<UserBid> selectUserBidList(UserBid userBid);

    /**
     * 查询用户出价
     * 
     * @param id 用户出价主键
     * @return 用户出价
     */
    public UserBid selectUserBidById(Long id);

    /**
     * 新增用户出价
     * 
     * @param userBid 用户出价
     * @return 结果
     */
    public int insertUserBid(UserBid userBid);

    /**
     * 修改用户出价
     * 
     * @param userBid 用户出价
     * @return 结果
     */
    public int updateUserBid(UserBid userBid);

    /**
     * 删除用户出价
     * 
     * @param id 用户出价主键
     * @return 结果
     */
    public int deleteUserBidById(Long id);

    /**
     * 批量删除用户出价
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteUserBidByIds(Long[] ids);

    /**
     * 查询竞拍结算用出价记录
     *
     * @param bidProductId 竞价商品id
     * @return 出价记录
     */
    public List<UserBid> selectUserBidsForSettlement(Long bidProductId);
}
