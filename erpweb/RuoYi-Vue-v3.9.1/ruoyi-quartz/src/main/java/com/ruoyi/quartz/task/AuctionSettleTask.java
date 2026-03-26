package com.ruoyi.quartz.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.ruoyi.system.service.pig.IAuctionSettlementService;

/**
 * 竞拍结算定时任务
 *
 * @author ruoyi
 */
@Component("auctionSettleTask")
public class AuctionSettleTask
{
    private static final Logger log = LoggerFactory.getLogger(AuctionSettleTask.class);

    @Autowired
    private IAuctionSettlementService auctionSettlementService;

    public void settleExpiredAuctions()
    {
        int count = auctionSettlementService.settleExpiredAuctions();
        log.info("竞拍结算任务执行完成，结算竞拍数量：{}", count);
    }
}
