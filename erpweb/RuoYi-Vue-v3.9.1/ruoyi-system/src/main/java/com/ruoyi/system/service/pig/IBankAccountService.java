package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.BankAccount;

/**
 * 银行账号 Service接口
 */
public interface IBankAccountService
{
    public List<BankAccount> selectBankAccountList(BankAccount bankAccount);

    public BankAccount selectBankAccountById(Long id);

    public int insertBankAccount(BankAccount bankAccount);

    public int updateBankAccount(BankAccount bankAccount);

    public int deleteBankAccountById(Long id);

    public int deleteBankAccountByIds(Long[] ids);
}
