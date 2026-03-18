package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.UserBidInfo;

/**
 * 用户竞价信息维护Mapper接口
 * 
 * @author ruoyi
 */
public interface UserBidInfoMapper
{
    /**
     * 查询用户竞价信息维护列表
     * 
     * @param userBidInfo 用户竞价信息维护
     * @return 用户竞价信息维护集合
     */
    public List<UserBidInfo> selectUserBidInfoList(UserBidInfo userBidInfo);

    /**
     * 查询用户竞价信息维护
     * 
     * @param id 用户竞价信息维护主键
     * @return 用户竞价信息维护
     */
    public UserBidInfo selectUserBidInfoById(Long id);

    /**
     * 新增用户竞价信息维护
     * 
     * @param userBidInfo 用户竞价信息维护
     * @return 结果
     */
    public int insertUserBidInfo(UserBidInfo userBidInfo);

    /**
     * 修改用户竞价信息维护
     * 
     * @param userBidInfo 用户竞价信息维护
     * @return 结果
     */
    public int updateUserBidInfo(UserBidInfo userBidInfo);

    /**
     * 删除用户竞价信息维护
     * 
     * @param id 用户竞价信息维护主键
     * @return 结果
     */
    public int deleteUserBidInfoById(Long id);

    /**
     * 批量删除用户竞价信息维护
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteUserBidInfoByIds(Long[] ids);
}
