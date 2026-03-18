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
import com.ruoyi.system.domain.pig.EnterpriseGroup;
import com.ruoyi.system.service.pig.IEnterpriseGroupService;

/**
 * 企业分组Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/enterpriseGroup")
public class EnterpriseGroupController extends BaseController
{
    @Autowired
    private IEnterpriseGroupService enterpriseGroupService;

    /**
     * 查询企业分组列表
     */
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:list')")
    @GetMapping("/list")
    public TableDataInfo list(EnterpriseGroup enterpriseGroup)
    {
        startPage();
        List<EnterpriseGroup> list = enterpriseGroupService.selectEnterpriseGroupList(enterpriseGroup);
        return getDataTable(list);
    }

    /**
     * 导出企业分组列表
     */
    @Log(title = "企业分组", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, EnterpriseGroup enterpriseGroup)
    {
        List<EnterpriseGroup> list = enterpriseGroupService.selectEnterpriseGroupList(enterpriseGroup);
        ExcelUtil<EnterpriseGroup> util = new ExcelUtil<EnterpriseGroup>(EnterpriseGroup.class);
        util.exportExcel(response, list, "企业分组数据");
    }

    /**
     * 获取企业分组详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(enterpriseGroupService.selectEnterpriseGroupById(id));
    }

    /**
     * 新增企业分组
     */
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:add')")
    @Log(title = "企业分组", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody EnterpriseGroup enterpriseGroup)
    {
        enterpriseGroup.setCreateBy(String.valueOf(getUserId()));
        return toAjax(enterpriseGroupService.insertEnterpriseGroup(enterpriseGroup));
    }

    /**
     * 修改企业分组
     */
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:edit')")
    @Log(title = "企业分组", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody EnterpriseGroup enterpriseGroup)
    {
        enterpriseGroup.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(enterpriseGroupService.updateEnterpriseGroup(enterpriseGroup));
    }

    /**
     * 删除企业分组
     */
    @PreAuthorize("@ss.hasPermi('pig:enterpriseGroup:remove')")
    @Log(title = "企业分组", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(enterpriseGroupService.deleteEnterpriseGroupByIds(ids));
    }
}
