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
import com.ruoyi.system.domain.pig.UserBidInfo;
import com.ruoyi.system.service.pig.IUserBidInfoService;

/**
 * 用户竞价信息维护Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/userBidInfo")
public class UserBidInfoController extends BaseController
{
    @Autowired
    private IUserBidInfoService userBidInfoService;

    /**
     * 查询用户竞价信息维护列表
     */
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:list')")
    @GetMapping("/list")
    public TableDataInfo list(UserBidInfo userBidInfo)
    {
        startPage();
        List<UserBidInfo> list = userBidInfoService.selectUserBidInfoList(userBidInfo);
        return getDataTable(list);
    }

    /**
     * 导出用户竞价信息维护列表
     */
    @Log(title = "用户竞价信息维护", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, UserBidInfo userBidInfo)
    {
        List<UserBidInfo> list = userBidInfoService.selectUserBidInfoList(userBidInfo);
        ExcelUtil<UserBidInfo> util = new ExcelUtil<UserBidInfo>(UserBidInfo.class);
        util.exportExcel(response, list, "用户竞价信息维护数据");
    }

    /**
     * 获取用户竞价信息维护详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(userBidInfoService.selectUserBidInfoById(id));
    }

    /**
     * 新增用户竞价信息维护
     */
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:add')")
    @Log(title = "用户竞价信息维护", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody UserBidInfo userBidInfo)
    {
        userBidInfo.setCreateBy(String.valueOf(getUserId()));
        return toAjax(userBidInfoService.insertUserBidInfo(userBidInfo));
    }

    /**
     * 修改用户竞价信息维护
     */
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:edit')")
    @Log(title = "用户竞价信息维护", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody UserBidInfo userBidInfo)
    {
        userBidInfo.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(userBidInfoService.updateUserBidInfo(userBidInfo));
    }

    /**
     * 删除用户竞价信息维护
     */
    @PreAuthorize("@ss.hasPermi('pig:userBidInfo:remove')")
    @Log(title = "用户竞价信息维护", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(userBidInfoService.deleteUserBidInfoByIds(ids));
    }
}
