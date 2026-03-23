package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;

import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.mapper.pig.BidProductMapper;
import com.ruoyi.system.service.pig.IBidProductService;

/**
 * 竞价商品 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class BidProductServiceImpl implements IBidProductService
{
    @Autowired
    private BidProductMapper bidProductMapper;

    @Override
    public List<BidProduct> selectBidProductList(BidProduct bidProduct)
    {
        return bidProductMapper.selectBidProductList(bidProduct);
    }

    @Override
    public BidProduct selectBidProductById(Long id)
    {
        return bidProductMapper.selectBidProductById(id);
    }

    @Override
    public int insertBidProduct(BidProduct bidProduct)
    {
        return bidProductMapper.insertBidProduct(bidProduct);
    }

    @Override
    public int updateBidProduct(BidProduct bidProduct)
    {
        return bidProductMapper.updateBidProduct(bidProduct);
    }

    @Override
    public int deleteBidProductById(Long id)
    {
        return bidProductMapper.deleteBidProductById(id);
    }

    @Override
    public int deleteBidProductByIds(Long[] ids)
    {
        return bidProductMapper.deleteBidProductByIds(ids);
    }

    @Override
    public String generateBidProductCode()
    {
        Long maxId = bidProductMapper.selectMaxId();
        long nextId = maxId == null ? 1L : maxId + 1L;
        return "GD-" + nextId;
    }

    @Override
    public String importBidProduct(List<BidProduct> bidProductList, Boolean updateSupport, String operName)
    {
        if (StringUtils.isNull(bidProductList) || bidProductList.size() == 0)
        {
            throw new ServiceException("导入竞价商品数据不能为空！");
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (BidProduct bidProduct : bidProductList)
        {
            try
            {
                if (updateSupport != null && updateSupport && bidProduct.getId() != null && selectBidProductById(bidProduct.getId()) != null)
                {
                    bidProduct.setUpdateBy(operName);
                    this.updateBidProduct(bidProduct);
                    successNum++;
                }
                else
                {
                    bidProduct.setCreateBy(operName);
                    this.insertBidProduct(bidProduct);
                    successNum++;
                }
            }
            catch (Exception e)
            {
                failureNum++;
                String msg = failureNum + "、" + bidProduct.getId() + " 导入失败：";
                failureMsg.append(msg).append(e.getMessage()).append("\n");
            }
        }
        if (failureNum > 0)
        {
            failureMsg.insert(0, "很抱歉，导入失败！共 " + failureNum + " 条数据格式不正确，错误如下：\n");
            throw new ServiceException(failureMsg.toString());
        }
        else
        {
            successMsg.insert(0, "恭喜您，数据已全部导入成功！共 " + successNum + " 条");
        }
        return successMsg.toString();
    }

}
