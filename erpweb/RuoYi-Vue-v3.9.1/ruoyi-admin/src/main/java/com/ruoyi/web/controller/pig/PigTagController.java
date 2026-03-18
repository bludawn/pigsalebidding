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
import com.ruoyi.system.domain.pig.PigTag;
import com.ruoyi.system.service.pig.IPigTagService;

/**
 * 生猪标签Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/pigTag")
public class PigTagController extends BaseController
{
    @Autowired
    private IPigTagService pigTagService;

    /**
     * 查询生猪标签列表
     */
    @PreAuthorize("@ss.hasPermi('pig:pigTag:list')")
    @GetMapping("/list")
    public TableDataInfo list(PigTag pigTag)
    {
        startPage();
        List<PigTag> list = pigTagService.selectPigTagList(pigTag);
        return getDataTable(list);
    }

    /**
     * 导出生猪标签列表
     */
    @Log(title = "生猪标签", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigTag:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, PigTag pigTag)
    {
        List<PigTag> list = pigTagService.selectPigTagList(pigTag);
        ExcelUtil<PigTag> util = new ExcelUtil<PigTag>(PigTag.class);
        util.exportExcel(response, list, "生猪标签数据");
    }

    /**
     * 获取生猪标签详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:pigTag:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(pigTagService.selectPigTagById(id));
    }

    /**
     * 新增生猪标签
     */
    @PreAuthorize("@ss.hasPermi('pig:pigTag:add')")
    @Log(title = "生猪标签", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PigTag pigTag)
    {
        pigTag.setCreateBy(String.valueOf(getUserId()));
        return toAjax(pigTagService.insertPigTag(pigTag));
    }

    /**
     * 修改生猪标签
     */
    @PreAuthorize("@ss.hasPermi('pig:pigTag:edit')")
    @Log(title = "生猪标签", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PigTag pigTag)
    {
        pigTag.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(pigTagService.updatePigTag(pigTag));
    }

    /**
     * 删除生猪标签
     */
    @PreAuthorize("@ss.hasPermi('pig:pigTag:remove')")
    @Log(title = "生猪标签", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(pigTagService.deletePigTagByIds(ids));
    }
}
