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
import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.service.pig.IBidProductService;

/**
 * 竞价商品Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/pig/bidProduct")
public class BidProductController extends BaseController
{
    @Autowired
    private IBidProductService bidProductService;

    /**
     * 查询竞价商品列表
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:list')")
    @GetMapping("/list")
    public TableDataInfo list(BidProduct bidProduct)
    {
        startPage();
        List<BidProduct> list = bidProductService.selectBidProductList(bidProduct);
        return getDataTable(list);
    }

    /**
     * 导出竞价商品列表
     */
    @Log(title = "竞价商品", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, BidProduct bidProduct)
    {
        List<BidProduct> list = bidProductService.selectBidProductList(bidProduct);
        ExcelUtil<BidProduct> util = new ExcelUtil<BidProduct>(BidProduct.class);
        util.exportExcel(response, list, "竞价商品数据");
    }

    @Log(title = "竞价商品", businessType = BusinessType.IMPORT)
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:import')")
    @PostMapping("/importData")
    public AjaxResult importData(MultipartFile file, boolean updateSupport) throws Exception
    {
        ExcelUtil<BidProduct> util = new ExcelUtil<BidProduct>(BidProduct.class);
        List<BidProduct> bidProductList = util.importExcel(file.getInputStream());
        String operName = String.valueOf(getUserId());
        String message = bidProductService.importBidProduct(bidProductList, updateSupport, operName);
        return success(message);
    }

    @PostMapping("/importTemplate")
    public void importTemplate(HttpServletResponse response)
    {
        ExcelUtil<BidProduct> util = new ExcelUtil<BidProduct>(BidProduct.class);
        util.importTemplateExcel(response, "竞价商品");
    }

    /**
     * 获取竞价商品详细信息
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(bidProductService.selectBidProductById(id));
    }

    /**
     * 获取竞价商品编码
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:add')")
    @GetMapping("/nextCode")
    public AjaxResult nextCode()
    {
        return success(bidProductService.generateBidProductCode());
    }

    /**
     * 新增竞价商品
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:add')")
    @Log(title = "竞价商品", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody BidProduct bidProduct)
    {
        bidProduct.setCreateBy(String.valueOf(getUserId()));
        return toAjax(bidProductService.insertBidProduct(bidProduct));
    }

    /**
     * 修改竞价商品
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:edit')")
    @Log(title = "竞价商品", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody BidProduct bidProduct)
    {
        bidProduct.setUpdateBy(String.valueOf(getUserId()));
        return toAjax(bidProductService.updateBidProduct(bidProduct));
    }

    /**
     * 删除竞价商品
     */
    @PreAuthorize("@ss.hasPermi('pig:bidProduct:remove')")
    @Log(title = "竞价商品", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(bidProductService.deleteBidProductByIds(ids));
    }
}
