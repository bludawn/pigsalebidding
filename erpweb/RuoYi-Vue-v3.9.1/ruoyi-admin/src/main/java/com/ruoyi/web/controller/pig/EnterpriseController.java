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
import com.ruoyi.system.domain.pig.Enterprise;
import com.ruoyi.system.service.pig.IEnterpriseService;

/**
 * 企业信息Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/enterprise")
public class EnterpriseController extends BaseController
{
    @Autowired
    private IEnterpriseService enterpriseService;

    /**
     * 查询企业信息列表
     */
    @PreAuthorize("@ss.hasPermi('pig:enterprise:list')")
    @GetMapping("/list")
    public TableDataInfo list(Enterprise enterprise)
    {
        startPage();
        List<Enterprise> list = enterpriseService.selectEnterpriseList(enterprise);
        return getDataTable(list);
    }

    /**
     * 导出企业信息列表
     */
    @Log(title = "企业信息", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:enterprise:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, Enterprise enterprise)
    {
        List<Enterprise> list = enterpriseService.selectEnterpriseList(enterprise);
        ExcelUtil<Enterprise> util = new ExcelUtil<Enterprise>(Enterprise.class);
        util.exportExcel(response, list, "企业信息数据");
    }

    /**
     * 获取企业信息详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:enterprise:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(enterpriseService.selectEnterpriseById(id));
    }

    /**
     * 新增企业信息
     */
    @PreAuthorize("@ss.hasPermi('pig:enterprise:add')")
    @Log(title = "企业信息", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Enterprise enterprise)
    {
        enterprise.setCreateBy(String.valueOf(getUserId()));
        return toAjax(enterpriseService.insertEnterprise(enterprise));
    }

    /**
     * 修改企业信息
     */
    @PreAuthorize("@ss.hasPermi('pig:enterprise:edit')")
    @Log(title = "企业信息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Enterprise enterprise)
    {
        enterprise.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(enterpriseService.updateEnterprise(enterprise));
    }

    /**
     * 删除企业信息
     */
    @PreAuthorize("@ss.hasPermi('pig:enterprise:remove')")
    @Log(title = "企业信息", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(enterpriseService.deleteEnterpriseByIds(ids));
    }
}
