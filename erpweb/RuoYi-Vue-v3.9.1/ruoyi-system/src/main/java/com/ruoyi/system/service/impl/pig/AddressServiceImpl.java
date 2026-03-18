package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.Address;
import com.ruoyi.system.mapper.pig.AddressMapper;
import com.ruoyi.system.service.pig.IAddressService;

/**
 * 地址管理 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class AddressServiceImpl implements IAddressService
{
    @Autowired
    private AddressMapper addressMapper;

    @Override
    public List<Address> selectAddressList(Address address)
    {
        return addressMapper.selectAddressList(address);
    }

    @Override
    public Address selectAddressById(Long id)
    {
        return addressMapper.selectAddressById(id);
    }

    @Override
    public int insertAddress(Address address)
    {
        return addressMapper.insertAddress(address);
    }

    @Override
    public int updateAddress(Address address)
    {
        return addressMapper.updateAddress(address);
    }

    @Override
    public int deleteAddressById(Long id)
    {
        return addressMapper.deleteAddressById(id);
    }

    @Override
    public int deleteAddressByIds(Long[] ids)
    {
        return addressMapper.deleteAddressByIds(ids);
    }

}
