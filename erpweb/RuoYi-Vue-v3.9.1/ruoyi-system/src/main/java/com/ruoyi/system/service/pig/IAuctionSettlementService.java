package com.ruoyi.system.service.pig;

/**
 * 竞拍结算 Service接口
 *
 * @author ruoyi
 */
public interface IAuctionSettlementService
{
    /**
     * 结算已结束竞拍
     *
     * @return 结算的竞拍数量
     */
    int settleExpiredAuctions();
}
