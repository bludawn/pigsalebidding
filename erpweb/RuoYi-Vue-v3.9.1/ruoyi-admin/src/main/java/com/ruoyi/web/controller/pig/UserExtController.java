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
import com.ruoyi.system.domain.pig.UserExt;
import com.ruoyi.system.service.pig.IUserExtService;

/**
 * 用户信息拓展Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/userExt")
public class UserExtController extends BaseController
{
    @Autowired
    private IUserExtService userExtService;

    /**
     * 查询用户信息拓展列表
     */
    @PreAuthorize("@ss.hasPermi('pig:userExt:list')")
    @GetMapping("/list")
    public TableDataInfo list(UserExt userExt)
    {
        startPage();
        List<UserExt> list = userExtService.selectUserExtList(userExt);
        return getDataTable(list);
    }

    /**
     * 导出用户信息拓展列表
     */
    @Log(title = "用户信息拓展", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:userExt:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, UserExt userExt)
    {
        List<UserExt> list = userExtService.selectUserExtList(userExt);
        ExcelUtil<UserExt> util = new ExcelUtil<UserExt>(UserExt.class);
        util.exportExcel(response, list, "用户信息拓展数据");
    }

    /**
     * 获取用户信息拓展详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:userExt:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(userExtService.selectUserExtById(id));
    }

    /**
     * 新增用户信息拓展
     */
    @PreAuthorize("@ss.hasPermi('pig:userExt:add')")
    @Log(title = "用户信息拓展", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody UserExt userExt)
    {
        userExt.setCreateBy(String.valueOf(getUserId()));
        return toAjax(userExtService.insertUserExt(userExt));
    }

    /**
     * 修改用户信息拓展
     */
    @PreAuthorize("@ss.hasPermi('pig:userExt:edit')")
    @Log(title = "用户信息拓展", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody UserExt userExt)
    {
        userExt.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(userExtService.updateUserExt(userExt));
    }

    /**
     * 删除用户信息拓展
     */
    @PreAuthorize("@ss.hasPermi('pig:userExt:remove')")
    @Log(title = "用户信息拓展", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(userExtService.deleteUserExtByIds(ids));
    }
}
