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
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.service.pig.IUserBidService;

/**
 * 用户出价Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/userBid")
public class UserBidController extends BaseController
{
    @Autowired
    private IUserBidService userBidService;

    /**
     * 查询用户出价列表
     */
    @PreAuthorize("@ss.hasPermi('pig:userBid:list')")
    @GetMapping("/list")
    public TableDataInfo list(UserBid userBid)
    {
        startPage();
        List<UserBid> list = userBidService.selectUserBidList(userBid);
        return getDataTable(list);
    }

    /**
     * 导出用户出价列表
     */
    @Log(title = "用户出价", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:userBid:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, UserBid userBid)
    {
        List<UserBid> list = userBidService.selectUserBidList(userBid);
        ExcelUtil<UserBid> util = new ExcelUtil<UserBid>(UserBid.class);
        util.exportExcel(response, list, "用户出价数据");
    }

    /**
     * 获取用户出价详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:userBid:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(userBidService.selectUserBidById(id));
    }

    /**
     * 新增用户出价
     */
    @PreAuthorize("@ss.hasPermi('pig:userBid:add')")
    @Log(title = "用户出价", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody UserBid userBid)
    {
        userBid.setCreateBy(String.valueOf(getUserId()));
        return toAjax(userBidService.insertUserBid(userBid));
    }

    /**
     * 修改用户出价
     */
    @PreAuthorize("@ss.hasPermi('pig:userBid:edit')")
    @Log(title = "用户出价", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody UserBid userBid)
    {
        userBid.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(userBidService.updateUserBid(userBid));
    }

    /**
     * 删除用户出价
     */
    @PreAuthorize("@ss.hasPermi('pig:userBid:remove')")
    @Log(title = "用户出价", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(userBidService.deleteUserBidByIds(ids));
    }
}
