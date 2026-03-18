package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Address;

/**
 * 地址管理 Service接口
 * 
 * @author ruoyi
 */
public interface IAddressService
{
    public List<Address> selectAddressList(Address address);
    public Address selectAddressById(Long id);
    public int insertAddress(Address address);
    public int updateAddress(Address address);
    public int deleteAddressById(Long id);
    public int deleteAddressByIds(Long[] ids);
}
