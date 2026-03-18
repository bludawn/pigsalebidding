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
import com.ruoyi.system.domain.pig.PigType;
import com.ruoyi.system.service.pig.IPigTypeService;

/**
 * 生猪类型Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/pigType")
public class PigTypeController extends BaseController
{
    @Autowired
    private IPigTypeService pigTypeService;

    /**
     * 查询生猪类型列表
     */
    @PreAuthorize("@ss.hasPermi('pig:pigType:list')")
    @GetMapping("/list")
    public TableDataInfo list(PigType pigType)
    {
        startPage();
        List<PigType> list = pigTypeService.selectPigTypeList(pigType);
        return getDataTable(list);
    }

    /**
     * 导出生猪类型列表
     */
    @Log(title = "生猪类型", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigType:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, PigType pigType)
    {
        List<PigType> list = pigTypeService.selectPigTypeList(pigType);
        ExcelUtil<PigType> util = new ExcelUtil<PigType>(PigType.class);
        util.exportExcel(response, list, "生猪类型数据");
    }

    @Log(title = "生猪类型", businessType = BusinessType.IMPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigType:import')")
    @PostMapping("/importData")
    public AjaxResult importData(MultipartFile file, boolean updateSupport) throws Exception
    {
        ExcelUtil<PigType> util = new ExcelUtil<PigType>(PigType.class);
        List<PigType> pigTypeList = util.importExcel(file.getInputStream());
        String operName = String.valueOf(getUserId());
        String message = pigTypeService.importPigType(pigTypeList, updateSupport, operName);
        return success(message);
    }

    @PostMapping("/importTemplate")
    public void importTemplate(HttpServletResponse response)
    {
        ExcelUtil<PigType> util = new ExcelUtil<PigType>(PigType.class);
        util.importTemplateExcel(response, "生猪类型");
    }

    /**
     * 获取生猪类型详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:pigType:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(pigTypeService.selectPigTypeById(id));
    }

    /**
     * 新增生猪类型
     */
    @PreAuthorize("@ss.hasPermi('pig:pigType:add')")
    @Log(title = "生猪类型", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PigType pigType)
    {
        pigType.setCreateBy(String.valueOf(getUserId()));
        return toAjax(pigTypeService.insertPigType(pigType));
    }

    /**
     * 修改生猪类型
     */
    @PreAuthorize("@ss.hasPermi('pig:pigType:edit')")
    @Log(title = "生猪类型", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PigType pigType)
    {
        pigType.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(pigTypeService.updatePigType(pigType));
    }

    /**
     * 删除生猪类型
     */
    @PreAuthorize("@ss.hasPermi('pig:pigType:remove')")
    @Log(title = "生猪类型", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(pigTypeService.deletePigTypeByIds(ids));
    }
}
