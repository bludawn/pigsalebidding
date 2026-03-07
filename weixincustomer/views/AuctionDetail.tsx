import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AuctionDetailInfo, AuctionItem, BidRecordItem } from '../types';
import { getAuctionDetail, getBidRecords, submitBid } from '../AppApi';

interface AuctionDetailProps {
  params: AuctionItem;
  onBack: () => void;
}

const DEFAULT_BID_RECORD_INTERVAL = 10;
const DEFAULT_BID_RECORD_SIZE = 10;
const ALL_BID_RECORD_SIZE = 9999;

const formatCountdown = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const h = Math.floor(safe / 3600).toString().padStart(2, '0');
  const m = Math.floor((safe % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(safe % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

const parsePriceValue = (value: string) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isStepValid = (value: number, step: number) => {
  if (!step || step <= 0) return true;
  const ratio = value / step;
  return Math.abs(ratio - Math.round(ratio)) < 1e-6;
};

const AuctionDetail: React.FC<AuctionDetailProps> = ({ params, onBack }) => {
  const [detail, setDetail] = useState<AuctionDetailInfo | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [bidRecords, setBidRecords] = useState<BidRecordItem[]>([]);
  const [bidRecordsTotal, setBidRecordsTotal] = useState(0);
  const [isBidRecordsLoading, setIsBidRecordsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [bidPrice, setBidPrice] = useState(params.startingPrice);
  const [bidCount, setBidCount] = useState(params.startingCount);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const mediaList = detail?.mediaUrls?.length ? detail.mediaUrls : [params.imageUrl];
  const bidIntervalSeconds = detail?.bidRecordIntervalSeconds || DEFAULT_BID_RECORD_INTERVAL;
  const minBidCount = detail?.startingCount ?? params.startingCount;
  const bidStep = detail?.bidStep ?? 0.05;

  const displayPriceValue = useMemo(() => {
    if (!detail?.price) return params.startingPrice;
    const parsed = parsePriceValue(detail.price);
    return parsed > 0 ? parsed : params.startingPrice;
  }, [detail, params.startingPrice]);

  useEffect(() => {
    const loadDetail = async () => {
      const res = await getAuctionDetail({ auctionId: params.id });
      if (res.errcode === 0 && res.data) {
        setDetail(res.data);
        setCountdownSeconds(res.data.endCountdownSeconds || 0);
      }
    };

    loadDetail();
  }, [params.id]);

  useEffect(() => {
    if (!detail || initializedRef.current) return;
    setBidPrice(displayPriceValue || params.startingPrice);
    setBidCount(detail.startingCount || params.startingCount);
    initializedRef.current = true;
  }, [detail, displayPriceValue, params.startingCount, params.startingPrice]);

  useEffect(() => {
    if (!detail) return;
    const timer = setInterval(() => {
      setCountdownSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [detail]);

  const loadBidRecords = async (loadAll: boolean) => {
    if (isBidRecordsLoading) return;
    setIsBidRecordsLoading(true);
    const size = loadAll ? ALL_BID_RECORD_SIZE : DEFAULT_BID_RECORD_SIZE;
    const res = await getBidRecords({
      auctionId: params.id,
      current: 1,
      size,
      searchCount: true,
    });
    if (res.errcode === 0 && res.data) {
      const records = res.data.records || [];
      setBidRecords(records);
      setBidRecordsTotal(res.data.total || records.length);
    }
    setIsBidRecordsLoading(false);
  };

  useEffect(() => {
    loadBidRecords(false);
  }, [params.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadBidRecords(isExpanded);
    }, bidIntervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [bidIntervalSeconds, isExpanded, params.id]);

  const handleMediaScroll = () => {
    if (!mediaRef.current) return;
    const width = mediaRef.current.clientWidth || 1;
    const index = Math.round(mediaRef.current.scrollLeft / width);
    setCurrentMediaIndex(Math.min(Math.max(index, 0), mediaList.length - 1));
  };

  const handleExpandRecords = async () => {
    setIsExpanded(true);
    await loadBidRecords(true);
  };

  const bidValidationMessage = useMemo(() => {
    if (!bidPrice || bidPrice <= 0) return '出价必须大于0';
    if (!isStepValid(bidPrice, bidStep)) return `出价需为${bidStep}的整数倍`;
    if (!Number.isInteger(bidCount) || bidCount <= 0) return '数量必须为正整数';
    if (bidCount < minBidCount) return `数量不能低于起拍数量(${minBidCount}头)`;
    return '';
  }, [bidPrice, bidCount, bidStep, minBidCount]);

  const canSubmit = !bidValidationMessage && !isSubmitting;

  const handleSubmitBid = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    const res = await submitBid({
      auctionId: params.id,
      bidPrice,
      bidCount,
    });
    if (res.errcode === 0) {
      setIsDialogOpen(false);
      await loadBidRecords(isExpanded);
    }
    setIsSubmitting(false);
  };

  const totalPrice = useMemo(() => {
    if (!bidPrice || !bidCount) return 0;
    return Number((bidPrice * bidCount).toFixed(2));
  }, [bidPrice, bidCount]);

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Header Media Section */}
      <div className="relative aspect-[4/3] w-full bg-black">
        <div
          ref={mediaRef}
          onScroll={handleMediaScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
        >
          {mediaList.map((url, index) => (
            <div key={`${url}-${index}`} className="w-full h-full flex-shrink-0 snap-center">
              {isVideoUrl(url) ? (
                <video
                  src={url}
                  muted={isMuted}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        {mediaList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {currentMediaIndex + 1}/{mediaList.length}
          </div>
        )}
        {mediaList.some(isVideoUrl) && (
          <button onClick={() => setIsMuted(!isMuted)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-industry-red px-4 py-2 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-sm font-medium">{detail?.pigTypeName || params.breed}</span>
          <span className="text-sm font-bold">竞价进行中</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>距结束</span>
          <span className="font-mono bg-white/20 px-1 rounded-sm">{formatCountdown(countdownSeconds)}</span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg font-bold">{detail?.weightRanges?.join(' / ') || params.weightRange}</h1>
              {detail?.productTags?.length
                ? detail.productTags.map(tag => (
                    <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))
                : params.tags?.map(tag => (
                    <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
            </div>
            <div className="text-xs text-slate-400 mb-2">场次：{detail?.sessionName || params.farmName}</div>
          </div>
          <div className="bg-industry-red/5 px-2 py-1 rounded-sm border border-industry-red/20">
            <span className="text-industry-red text-[10px] font-bold">最高价</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-industry-red text-2xl font-bold">¥{detail?.price || params.startingPrice}</span>
          <span className="text-slate-400 text-xs">元/kg</span>
        </div>
        {detail?.remark && (
          <div className="mt-3 p-2 bg-amber-50 rounded-sm flex items-start gap-2 border border-amber-100">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <span className="text-xs text-amber-800 leading-tight font-medium">备注：{detail.remark}</span>
          </div>
        )}
      </div>

      {/* Info Maintenance */}
      <div className="p-4 flex items-center justify-between border-b-8 border-slate-100">
        <div>
          <h2 className="text-sm font-bold">信息维护</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">请确认收货地址、装猪时间等基础信息</p>
        </div>
        <button className="bg-industry-red text-white px-4 py-1.5 rounded-custom text-xs font-bold shadow-sm shadow-industry-red/20">立即维护</button>
      </div>

      {/* Bidding Params */}
      <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8 border-b-8 border-slate-100">
        <ParamItem label="起拍数量" value={`${detail?.startingCount ?? params.startingCount}头`} />
        <ParamItem label="加价幅度" value={`${detail?.bidStep ?? 0}元/kg`} />
        <ParamItem label="加拍价" value={`¥${detail?.addPrice ?? 0}`} />
        <ParamItem label="无疫地区" value={detail?.quarantineRegion || '-'} />
        <ParamItem label="开票范围" value={detail?.invoiceScope || '-'} />
        <ParamItem label="是否配送" value={detail?.deliverySupport || '-'} />
        <ParamItem label="食料品质" value={detail?.feedQuality || '-'} />
        <ParamItem label="防疫状态" value={detail?.epidemicStatus || '-'} />
      </div>

      {/* Bid Records */}
      <div className="p-4 border-b-8 border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">出价明细</h2>
          <span className="text-[10px] text-slate-400">{bidRecordsTotal ? `共${bidRecordsTotal}条` : '最新10条'}</span>
        </div>
        <div className="bg-slate-50 rounded-custom overflow-hidden">
          <div className="grid grid-cols-4 text-[10px] text-slate-400 px-3 py-2 border-b border-slate-100">
            <span>客户名称</span>
            <span>价格</span>
            <span>数量</span>
            <span>时间</span>
          </div>
          {bidRecords.map(record => (
            <div key={record.id} className="grid grid-cols-4 text-[11px] text-slate-700 px-3 py-2 border-b border-slate-100 last:border-b-0">
              <span className="truncate">{record.customerName}</span>
              <span>¥{record.price.toFixed(2)}</span>
              <span>{record.quantity}头</span>
              <span>{record.time}</span>
            </div>
          ))}
          {!bidRecords.length && !isBidRecordsLoading && (
            <div className="py-6 text-center text-xs text-slate-400">暂无出价明细</div>
          )}
          {isBidRecordsLoading && (
            <div className="py-4 flex justify-center">
              <div className="w-5 h-5 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {!isExpanded && bidRecordsTotal > DEFAULT_BID_RECORD_SIZE && (
          <button
            onClick={handleExpandRecords}
            className="w-full mt-3 py-2 text-xs text-industry-red font-bold bg-industry-red/5 rounded-custom"
          >
            展开全部
          </button>
        )}
      </div>

      {/* Rules */}
      <div className="p-4 border-b-8 border-slate-100">
        <h2 className="text-sm font-bold mb-3">竞价须知</h2>
        <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-custom whitespace-pre-line">
          {detail?.biddingNotice || '暂无竞价须知'}
        </div>
      </div>

      {/* Bid Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">委托出价</h2>
            <span className="text-[10px] text-slate-400">您暂未设置委托</span>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-1">出价 (元/kg)</label>
            <div className="flex items-center bg-slate-100 rounded-custom p-1">
              <button
                onClick={() => setBidPrice(p => Math.max(0, Number((p - bidStep).toFixed(2))))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={bidPrice}
                onChange={e => setBidPrice(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-transparent text-center font-bold text-sm focus:outline-none"
              />
              <button
                onClick={() => setBidPrice(p => Number((p + bidStep).toFixed(2)))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-1">数量 (头)</label>
            <div className="flex items-center bg-slate-100 rounded-custom p-1">
              <button onClick={() => setBidCount(c => Math.max(0, c - 1))} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">-</button>
              <input
                type="number"
                value={bidCount}
                onChange={e => setBidCount(parseInt(e.target.value, 10) || 0)}
                className="flex-1 bg-transparent text-center font-bold text-sm focus:outline-none"
              />
              <button onClick={() => setBidCount(c => c + 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">+</button>
            </div>
          </div>
        </div>
        {bidValidationMessage && (
          <div className="mt-2 text-[10px] text-industry-red">{bidValidationMessage}</div>
        )}
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 z-30">
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={!canSubmit}
          className="w-full bg-industry-red text-white py-3 rounded-custom font-bold shadow-lg shadow-industry-red/20 active:scale-95 transition-transform disabled:opacity-60"
        >
          确认出价
        </button>
      </div>

      {/* Bid Confirm Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center px-6" onClick={() => setIsDialogOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-slate-800">确认出价</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>生猪类型</span><span className="text-slate-800 font-bold">{detail?.pigTypeName || params.breed}</span></div>
              <div className="flex justify-between"><span>数量</span><span className="text-slate-800 font-bold">{bidCount}头</span></div>
              <div className="flex justify-between"><span>价格</span><span className="text-slate-800 font-bold">¥{bidPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>总价</span><span className="text-industry-red font-bold">¥{totalPrice.toFixed(2)}</span></div>
            </div>
            {bidValidationMessage && (
              <div className="mt-3 text-[10px] text-industry-red">{bidValidationMessage}</div>
            )}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setIsDialogOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-custom font-bold">取消</button>
              <button
                onClick={handleSubmitBid}
                disabled={!canSubmit}
                className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold disabled:opacity-60"
              >
                {isSubmitting ? '提交中...' : '确认出价'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ParamItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-slate-400">{label}</span>
    <span className="text-xs font-bold text-slate-800">{value}</span>
  </div>
);

export default AuctionDetail;
