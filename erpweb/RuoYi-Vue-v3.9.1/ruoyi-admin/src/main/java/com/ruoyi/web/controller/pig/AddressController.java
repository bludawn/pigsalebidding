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
import com.ruoyi.system.domain.pig.Address;
import com.ruoyi.system.service.pig.IAddressService;

/**
 * 地址管理Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/address")
public class AddressController extends BaseController
{
    @Autowired
    private IAddressService addressService;

    /**
     * 查询地址管理列表
     */
    @PreAuthorize("@ss.hasPermi('pig:address:list')")
    @GetMapping("/list")
    public TableDataInfo list(Address address)
    {
        startPage();
        List<Address> list = addressService.selectAddressList(address);
        return getDataTable(list);
    }

    /**
     * 导出地址管理列表
     */
    @Log(title = "地址管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:address:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, Address address)
    {
        List<Address> list = addressService.selectAddressList(address);
        ExcelUtil<Address> util = new ExcelUtil<Address>(Address.class);
        util.exportExcel(response, list, "地址管理数据");
    }

    /**
     * 获取地址管理详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:address:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(addressService.selectAddressById(id));
    }

    /**
     * 新增地址管理
     */
    @PreAuthorize("@ss.hasPermi('pig:address:add')")
    @Log(title = "地址管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Address address)
    {
        address.setCreateBy(String.valueOf(getUserId()));
        return toAjax(addressService.insertAddress(address));
    }

    /**
     * 修改地址管理
     */
    @PreAuthorize("@ss.hasPermi('pig:address:edit')")
    @Log(title = "地址管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Address address)
    {
        address.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(addressService.updateAddress(address));
    }

    /**
     * 删除地址管理
     */
    @PreAuthorize("@ss.hasPermi('pig:address:remove')")
    @Log(title = "地址管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(addressService.deleteAddressByIds(ids));
    }
}
