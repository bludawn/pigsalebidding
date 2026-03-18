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
import com.ruoyi.system.domain.pig.DeliveryInfo;
import com.ruoyi.system.service.pig.IDeliveryInfoService;

/**
 * 送货信息Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/deliveryInfo")
public class DeliveryInfoController extends BaseController
{
    @Autowired
    private IDeliveryInfoService deliveryInfoService;

    /**
     * 查询送货信息列表
     */
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:list')")
    @GetMapping("/list")
    public TableDataInfo list(DeliveryInfo deliveryInfo)
    {
        startPage();
        List<DeliveryInfo> list = deliveryInfoService.selectDeliveryInfoList(deliveryInfo);
        return getDataTable(list);
    }

    /**
     * 导出送货信息列表
     */
    @Log(title = "送货信息", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, DeliveryInfo deliveryInfo)
    {
        List<DeliveryInfo> list = deliveryInfoService.selectDeliveryInfoList(deliveryInfo);
        ExcelUtil<DeliveryInfo> util = new ExcelUtil<DeliveryInfo>(DeliveryInfo.class);
        util.exportExcel(response, list, "送货信息数据");
    }

    /**
     * 获取送货信息详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(deliveryInfoService.selectDeliveryInfoById(id));
    }

    /**
     * 新增送货信息
     */
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:add')")
    @Log(title = "送货信息", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody DeliveryInfo deliveryInfo)
    {
        deliveryInfo.setCreateBy(String.valueOf(getUserId()));
        return toAjax(deliveryInfoService.insertDeliveryInfo(deliveryInfo));
    }

    /**
     * 修改送货信息
     */
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:edit')")
    @Log(title = "送货信息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody DeliveryInfo deliveryInfo)
    {
        deliveryInfo.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(deliveryInfoService.updateDeliveryInfo(deliveryInfo));
    }

    /**
     * 删除送货信息
     */
    @PreAuthorize("@ss.hasPermi('pig:deliveryInfo:remove')")
    @Log(title = "送货信息", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(deliveryInfoService.deleteDeliveryInfoByIds(ids));
    }
}
