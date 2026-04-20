package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.pig.BankAccount;
import com.ruoyi.system.mapper.pig.BankAccountMapper;
import com.ruoyi.system.service.pig.IBankAccountService;

/**
 * 银行账号 Service业务层处理
 */
@Service
public class BankAccountServiceImpl implements IBankAccountService
{
    @Autowired
    private BankAccountMapper bankAccountMapper;

    @Override
    public List<BankAccount> selectBankAccountList(BankAccount bankAccount)
    {
        return bankAccountMapper.selectBankAccountList(bankAccount);
    }

    @Override
    public BankAccount selectBankAccountById(Long id)
    {
        return bankAccountMapper.selectBankAccountById(id);
    }

    @Override
    public int insertBankAccount(BankAccount bankAccount)
    {
        return bankAccountMapper.insertBankAccount(bankAccount);
    }

    @Override
    public int updateBankAccount(BankAccount bankAccount)
    {
        return bankAccountMapper.updateBankAccount(bankAccount);
    }

    @Override
    public int deleteBankAccountById(Long id)
    {
        return bankAccountMapper.deleteBankAccountById(id);
    }

    @Override
    public int deleteBankAccountByIds(Long[] ids)
    {
        return bankAccountMapper.deleteBankAccountByIds(ids);
    }
}
