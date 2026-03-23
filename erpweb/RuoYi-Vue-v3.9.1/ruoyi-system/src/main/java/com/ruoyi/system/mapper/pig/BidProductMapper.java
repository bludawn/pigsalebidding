package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.BidProduct;

/**
 * 竞价商品Mapper接口
 * 
 * @author ruoyi
 */
public interface BidProductMapper
{
    /**
     * 查询竞价商品列表
     * 
     * @param bidProduct 竞价商品
     * @return 竞价商品集合
     */
    public List<BidProduct> selectBidProductList(BidProduct bidProduct);

    /**
     * 查询竞价商品
     * 
     * @param id 竞价商品主键
     * @return 竞价商品
     */
    public BidProduct selectBidProductById(Long id);

    /**
     * 新增竞价商品
     * 
     * @param bidProduct 竞价商品
     * @return 结果
     */
    public int insertBidProduct(BidProduct bidProduct);

    /**
     * 修改竞价商品
     * 
     * @param bidProduct 竞价商品
     * @return 结果
     */
    public int updateBidProduct(BidProduct bidProduct);

    /**
     * 删除竞价商品
     * 
     * @param id 竞价商品主键
     * @return 结果
     */
    public int deleteBidProductById(Long id);

    /**
     * 批量删除竞价商品
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteBidProductByIds(Long[] ids);

    /**
     * 获取最大主键
     *
     * @return 最大主键
     */
    public Long selectMaxId();
}
