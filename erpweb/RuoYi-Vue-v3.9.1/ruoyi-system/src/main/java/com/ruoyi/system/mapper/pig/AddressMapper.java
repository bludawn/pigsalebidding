package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Address;

/**
 * 地址管理Mapper接口
 * 
 * @author ruoyi
 */
public interface AddressMapper
{
    /**
     * 查询地址管理列表
     * 
     * @param address 地址管理
     * @return 地址管理集合
     */
    public List<Address> selectAddressList(Address address);

    /**
     * 查询地址管理
     * 
     * @param id 地址管理主键
     * @return 地址管理
     */
    public Address selectAddressById(Long id);

    /**
     * 新增地址管理
     * 
     * @param address 地址管理
     * @return 结果
     */
    public int insertAddress(Address address);

    /**
     * 修改地址管理
     * 
     * @param address 地址管理
     * @return 结果
     */
    public int updateAddress(Address address);

    /**
     * 删除地址管理
     * 
     * @param id 地址管理主键
     * @return 结果
     */
    public int deleteAddressById(Long id);

    /**
     * 批量删除地址管理
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteAddressByIds(Long[] ids);
}
