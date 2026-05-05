package com.ruoyi.web.controller.pig;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.pig.BankAccount;
import com.ruoyi.system.service.pig.IBankAccountService;

/**
 * 银行账号Controller
 */
@RestController
@RequestMapping("/pig/bankAccount")
public class BankAccountController extends BaseController
{
    @Autowired
    private IBankAccountService bankAccountService;

//    @PreAuthorize("@ss.hasPermi('pig:bankAccount:list')")
    @GetMapping("/list")
    public TableDataInfo list(BankAccount bankAccount)
    {
        startPage();
        List<BankAccount> list = bankAccountService.selectBankAccountList(bankAccount);
        return getDataTable(list);
    }

    @Log(title = "银行账号", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:bankAccount:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, BankAccount bankAccount)
    {
        List<BankAccount> list = bankAccountService.selectBankAccountList(bankAccount);
        ExcelUtil<BankAccount> util = new ExcelUtil<BankAccount>(BankAccount.class);
        util.exportExcel(response, list, "银行账号数据");
    }

    @PreAuthorize("@ss.hasPermi('pig:bankAccount:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(bankAccountService.selectBankAccountById(id));
    }

    @PreAuthorize("@ss.hasPermi('pig:bankAccount:add')")
    @Log(title = "银行账号", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody BankAccount bankAccount)
    {
        bankAccount.setCreateBy(String.valueOf(getUserId()));
        return toAjax(bankAccountService.insertBankAccount(bankAccount));
    }

    @PreAuthorize("@ss.hasPermi('pig:bankAccount:edit')")
    @Log(title = "银行账号", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody BankAccount bankAccount)
    {
        bankAccount.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(bankAccountService.updateBankAccount(bankAccount));
    }

    @PreAuthorize("@ss.hasPermi('pig:bankAccount:remove')")
    @Log(title = "银行账号", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(bankAccountService.deleteBankAccountByIds(ids));
    }
}
