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
import com.ruoyi.system.domain.pig.VehicleType;
import com.ruoyi.system.service.pig.IVehicleTypeService;

/**
 * 车辆类型Controller
 */
@RestController
@RequestMapping("/pig/vehicleType")
public class VehicleTypeController extends BaseController
{
    @Autowired
    private IVehicleTypeService vehicleTypeService;

    @PreAuthorize("@ss.hasPermi('pig:vehicleType:list')")
    @GetMapping("/list")
    public TableDataInfo list(VehicleType vehicleType)
    {
        startPage();
        List<VehicleType> list = vehicleTypeService.selectVehicleTypeList(vehicleType);
        return getDataTable(list);
    }

    @Log(title = "车辆类型", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:vehicleType:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, VehicleType vehicleType)
    {
        List<VehicleType> list = vehicleTypeService.selectVehicleTypeList(vehicleType);
        ExcelUtil<VehicleType> util = new ExcelUtil<VehicleType>(VehicleType.class);
        util.exportExcel(response, list, "车辆类型数据");
    }

    @PreAuthorize("@ss.hasPermi('pig:vehicleType:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(vehicleTypeService.selectVehicleTypeById(id));
    }

    @PreAuthorize("@ss.hasPermi('pig:vehicleType:add')")
    @Log(title = "车辆类型", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody VehicleType vehicleType)
    {
        vehicleType.setCreateBy(String.valueOf(getUserId()));
        return toAjax(vehicleTypeService.insertVehicleType(vehicleType));
    }

    @PreAuthorize("@ss.hasPermi('pig:vehicleType:edit')")
    @Log(title = "车辆类型", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody VehicleType vehicleType)
    {
        vehicleType.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(vehicleTypeService.updateVehicleType(vehicleType));
    }

    @PreAuthorize("@ss.hasPermi('pig:vehicleType:remove')")
    @Log(title = "车辆类型", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(vehicleTypeService.deleteVehicleTypeByIds(ids));
    }
}
