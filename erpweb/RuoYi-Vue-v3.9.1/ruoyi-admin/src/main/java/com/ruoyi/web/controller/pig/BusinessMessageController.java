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
import com.ruoyi.system.domain.pig.BusinessMessage;
import com.ruoyi.system.service.pig.IBusinessMessageService;

/**
 * 业务消息Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/businessMessage")
public class BusinessMessageController extends BaseController
{
    @Autowired
    private IBusinessMessageService businessMessageService;

    /**
     * 查询业务消息列表
     */
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:list')")
    @GetMapping("/list")
    public TableDataInfo list(BusinessMessage businessMessage)
    {
        startPage();
        List<BusinessMessage> list = businessMessageService.selectBusinessMessageList(businessMessage);
        return getDataTable(list);
    }

    /**
     * 导出业务消息列表
     */
    @Log(title = "业务消息", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, BusinessMessage businessMessage)
    {
        List<BusinessMessage> list = businessMessageService.selectBusinessMessageList(businessMessage);
        ExcelUtil<BusinessMessage> util = new ExcelUtil<BusinessMessage>(BusinessMessage.class);
        util.exportExcel(response, list, "业务消息数据");
    }

    /**
     * 获取业务消息详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(businessMessageService.selectBusinessMessageById(id));
    }

    /**
     * 新增业务消息
     */
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:add')")
    @Log(title = "业务消息", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody BusinessMessage businessMessage)
    {
        businessMessage.setCreateBy(String.valueOf(getUserId()));
        return toAjax(businessMessageService.insertBusinessMessage(businessMessage));
    }

    /**
     * 修改业务消息
     */
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:edit')")
    @Log(title = "业务消息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody BusinessMessage businessMessage)
    {
        businessMessage.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(businessMessageService.updateBusinessMessage(businessMessage));
    }

    /**
     * 删除业务消息
     */
    @PreAuthorize("@ss.hasPermi('pig:businessMessage:remove')")
    @Log(title = "业务消息", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(businessMessageService.deleteBusinessMessageByIds(ids));
    }
}
