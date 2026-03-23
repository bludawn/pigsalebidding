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
import com.ruoyi.system.domain.pig.PigResource;
import com.ruoyi.system.service.pig.IPigResourceService;

/**
 * 生猪资源Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/pigResource")
public class PigResourceController extends BaseController
{
    @Autowired
    private IPigResourceService pigResourceService;

    /**
     * 查询生猪资源列表
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:list')")
    @GetMapping("/list")
    public TableDataInfo list(PigResource pigResource)
    {
        startPage();
        List<PigResource> list = pigResourceService.selectPigResourceList(pigResource);
        return getDataTable(list);
    }

    /**
     * 导出生猪资源列表
     */
    @Log(title = "生猪资源", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigResource:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, PigResource pigResource)
    {
        List<PigResource> list = pigResourceService.selectPigResourceList(pigResource);
        ExcelUtil<PigResource> util = new ExcelUtil<PigResource>(PigResource.class);
        util.exportExcel(response, list, "生猪资源数据");
    }

    @Log(title = "生猪资源", businessType = BusinessType.IMPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigResource:import')")
    @PostMapping("/importData")
    public AjaxResult importData(MultipartFile file, boolean updateSupport) throws Exception
    {
        ExcelUtil<PigResource> util = new ExcelUtil<PigResource>(PigResource.class);
        List<PigResource> pigResourceList = util.importExcel(file.getInputStream());
        String operName = String.valueOf(getUserId());
        String message = pigResourceService.importPigResource(pigResourceList, updateSupport, operName);
        return success(message);
    }

    @PostMapping("/importTemplate")
    public void importTemplate(HttpServletResponse response)
    {
        ExcelUtil<PigResource> util = new ExcelUtil<PigResource>(PigResource.class);
        util.importTemplateExcel(response, "生猪资源");
    }

    /**
     * 获取生猪资源详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(pigResourceService.selectPigResourceById(id));
    }

    /**
     * 获取生猪资源编码
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:add')")
    @GetMapping("/nextCode")
    public AjaxResult nextCode()
    {
        return success(pigResourceService.generatePigResourceCode());
    }

    /**
     * 新增生猪资源
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:add')")
    @Log(title = "生猪资源", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PigResource pigResource)
    {
        pigResource.setCreateBy(String.valueOf(getUserId()));
        return toAjax(pigResourceService.insertPigResource(pigResource));
    }

    /**
     * 修改生猪资源
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:edit')")
    @Log(title = "生猪资源", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PigResource pigResource)
    {
        pigResource.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(pigResourceService.updatePigResource(pigResource));
    }

    /**
     * 删除生猪资源
     */
    @PreAuthorize("@ss.hasPermi('pig:pigResource:remove')")
    @Log(title = "生猪资源", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(pigResourceService.deletePigResourceByIds(ids));
    }
}
