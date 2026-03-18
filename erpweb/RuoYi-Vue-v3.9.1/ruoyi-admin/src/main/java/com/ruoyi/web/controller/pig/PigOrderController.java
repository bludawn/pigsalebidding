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
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.service.pig.IPigOrderService;

/**
 * 订单Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/pigOrder")
public class PigOrderController extends BaseController
{
    @Autowired
    private IPigOrderService pigOrderService;

    /**
     * 查询订单列表
     */
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:list')")
    @GetMapping("/list")
    public TableDataInfo list(PigOrder pigOrder)
    {
        startPage();
        List<PigOrder> list = pigOrderService.selectPigOrderList(pigOrder);
        return getDataTable(list);
    }

    /**
     * 导出订单列表
     */
    @Log(title = "订单", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, PigOrder pigOrder)
    {
        List<PigOrder> list = pigOrderService.selectPigOrderList(pigOrder);
        ExcelUtil<PigOrder> util = new ExcelUtil<PigOrder>(PigOrder.class);
        util.exportExcel(response, list, "订单数据");
    }

    /**
     * 获取订单详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(pigOrderService.selectPigOrderById(id));
    }

    /**
     * 新增订单
     */
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:add')")
    @Log(title = "订单", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PigOrder pigOrder)
    {
        pigOrder.setCreateBy(String.valueOf(getUserId()));
        return toAjax(pigOrderService.insertPigOrder(pigOrder));
    }

    /**
     * 修改订单
     */
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:edit')")
    @Log(title = "订单", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PigOrder pigOrder)
    {
        pigOrder.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(pigOrderService.updatePigOrder(pigOrder));
    }

    /**
     * 删除订单
     */
    @PreAuthorize("@ss.hasPermi('pig:pigOrder:remove')")
    @Log(title = "订单", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(pigOrderService.deletePigOrderByIds(ids));
    }
}
