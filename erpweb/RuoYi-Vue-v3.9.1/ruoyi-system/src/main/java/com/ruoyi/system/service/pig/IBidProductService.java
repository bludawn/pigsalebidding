package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.BidProduct;

/**
 * 竞价商品 Service接口
 * 
 * @author ruoyi
 */
public interface IBidProductService
{
    public List<BidProduct> selectBidProductList(BidProduct bidProduct);
    public BidProduct selectBidProductById(Long id);
    public int insertBidProduct(BidProduct bidProduct);
    public int updateBidProduct(BidProduct bidProduct);
    public int deleteBidProductById(Long id);
    public int deleteBidProductByIds(Long[] ids);
    public String importBidProduct(List<BidProduct> bidProductList, Boolean updateSupport, String operName);

    /**
     * 生成竞价商品编码
     *
     * @return 竞价商品编码
     */
    public String generateBidProductCode();
}
