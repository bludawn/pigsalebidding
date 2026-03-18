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
import org.springframework.web.multipart.MultipartFile;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.pig.Site;
import com.ruoyi.system.service.pig.ISiteService;

/**
 * 场点Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/site")
public class SiteController extends BaseController
{
    @Autowired
    private ISiteService siteService;

    /**
     * 查询场点列表
     */
    @PreAuthorize("@ss.hasPermi('pig:site:list')")
    @GetMapping("/list")
    public TableDataInfo list(Site site)
    {
        startPage();
        List<Site> list = siteService.selectSiteList(site);
        return getDataTable(list);
    }

    /**
     * 导出场点列表
     */
    @Log(title = "场点", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:site:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, Site site)
    {
        List<Site> list = siteService.selectSiteList(site);
        ExcelUtil<Site> util = new ExcelUtil<Site>(Site.class);
        util.exportExcel(response, list, "场点数据");
    }

    @Log(title = "场点", businessType = BusinessType.IMPORT)
    @PreAuthorize("@ss.hasPermi('pig:site:import')")
    @PostMapping("/importData")
    public AjaxResult importData(MultipartFile file, boolean updateSupport) throws Exception
    {
        ExcelUtil<Site> util = new ExcelUtil<Site>(Site.class);
        List<Site> siteList = util.importExcel(file.getInputStream());
        String operName = String.valueOf(getUserId());
        String message = siteService.importSite(siteList, updateSupport, operName);
        return success(message);
    }

    @PostMapping("/importTemplate")
    public void importTemplate(HttpServletResponse response)
    {
        ExcelUtil<Site> util = new ExcelUtil<Site>(Site.class);
        util.importTemplateExcel(response, "场点");
    }

    /**
     * 获取场点详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:site:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(siteService.selectSiteById(id));
    }

    /**
     * 新增场点
     */
    @PreAuthorize("@ss.hasPermi('pig:site:add')")
    @Log(title = "场点", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Site site)
    {
        site.setCreateBy(String.valueOf(getUserId()));
        return toAjax(siteService.insertSite(site));
    }

    /**
     * 修改场点
     */
    @PreAuthorize("@ss.hasPermi('pig:site:edit')")
    @Log(title = "场点", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Site site)
    {
        site.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(siteService.updateSite(site));
    }

    /**
     * 删除场点
     */
    @PreAuthorize("@ss.hasPermi('pig:site:remove')")
    @Log(title = "场点", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(siteService.deleteSiteByIds(ids));
    }
}
