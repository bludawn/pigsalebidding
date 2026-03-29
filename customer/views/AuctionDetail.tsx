import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AddressItem, AuctionDetailInfo, AuctionItem, AuctionMaintenanceInfo, BidRecordItem, MyBidStatus } from '../types';
import { cancelBidRecord, getAuctionDetail, getAuctionMaintenance, getBidRecords, getDefaultAddress, submitBid } from '../AppApi';

interface AuctionDetailProps {
  params: AuctionItem;
  onBack: () => void;
  onNavigate?: (route: string, params?: any) => void;
}

const DEFAULT_BID_RECORD_SIZE = 10;
const ALL_BID_RECORD_SIZE = 9999;


const formatCountdown = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const h = Math.floor(safe / 3600).toString().padStart(2, '0');
  const m = Math.floor((safe % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(safe % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatMediaTime = (seconds: number) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const s = Math.floor(safe % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
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

const AuctionDetail: React.FC<AuctionDetailProps> = ({ params, onBack, onNavigate, refreshKey = 0, isActive = true }) => {
  const [detail, setDetail] = useState<AuctionDetailInfo | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [bidRecords, setBidRecords] = useState<BidRecordItem[]>([]);
  const [bidRecordsTotal, setBidRecordsTotal] = useState(0);
  const [isBidRecordsLoading, setIsBidRecordsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMineOnly, setIsMineOnly] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [bidPrice, setBidPrice] = useState(params.startingPrice);
  const [bidCount, setBidCount] = useState(params.startingCount);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<BidRecordItem | null>(null);
  const [isCancelSubmitting, setIsCancelSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState(0);
  const [isCurrentVideoPlaying, setIsCurrentVideoPlaying] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressItem | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [maintenanceInfo, setMaintenanceInfo] = useState<AuctionMaintenanceInfo | null>(null);
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const prevMediaIndexRef = useRef(0);
  const initializedRef = useRef(false);
  const detailRequestRef = useRef<{ key: string; inFlight: boolean } | null>(null);

  const mediaList = detail?.mediaUrls?.length ? detail.mediaUrls : [params.imageUrl];
  const minBidCount = detail?.startingCount ?? params.startingCount;
  const bidStep = detail?.bidStep ?? 0.05;

  const displayPriceValue = useMemo(() => {
    if (!detail?.price) return params.startingPrice;
    const parsed = parsePriceValue(detail.price);
    return parsed > 0 ? parsed : params.startingPrice;
  }, [detail, params.startingPrice]);

  const loadDetail = async (force = false) => {
    const key = `${params.id}-${refreshKey}`;
    if (!force) {
      if (detailRequestRef.current?.inFlight && detailRequestRef.current.key === key) return;
      if (detailRequestRef.current?.key === key && !detailRequestRef.current.inFlight) return;
    }

    detailRequestRef.current = { key, inFlight: true };
    const res = await getAuctionDetail({ auctionId: params.id });
    if (res.errcode === 0 && res.data) {
      setDetail(res.data);
      setCountdownSeconds(res.data.endCountdownSeconds || 0);
    } else {
      setDetail(null);
      setCountdownSeconds(0);
    }
    detailRequestRef.current = { key, inFlight: false };
  };

  useEffect(() => {
    if (!isActive) return;
    loadDetail();
  }, [params.id, refreshKey, isActive]);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      setIsAddressLoading(true);
      try {
        const res = await getDefaultAddress();
        if (res.errcode === 0 && res.data) {
          setDefaultAddress(res.data);
        } else {
          setDefaultAddress(null);
        }
      } catch (error) {
        console.error('Failed to load default address:', error);
        setDefaultAddress(null);
      } finally {
        setIsAddressLoading(false);
      }
    };

    loadDefaultAddress();
  }, []);

  useEffect(() => {
    if (!detail || initializedRef.current) return;
    setBidPrice(displayPriceValue || params.startingPrice);
    setBidCount(detail.startingCount || params.startingCount);
    initializedRef.current = true;
  }, [detail, displayPriceValue, params.startingCount, params.startingPrice]);

  useEffect(() => {
    const loadMaintenance = async () => {
      setIsMaintenanceLoading(true);
      try {
        const res = await getAuctionMaintenance({ auctionId: params.id });
        if (res.errcode === 0) {
          setMaintenanceInfo(res.data || null);
          return;
        }
        setMaintenanceInfo(null);
      } catch (error) {
        console.error('Failed to load maintenance info:', error);
        setMaintenanceInfo(null);
      } finally {
        setIsMaintenanceLoading(false);
      }
    };

    loadMaintenance();
  }, [params.id, refreshKey]);

  useEffect(() => {
    if (!detail) return;
    const timer = setInterval(() => {
      setCountdownSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [detail]);

  const loadBidRecords = async (loadAll: boolean, onlyMine: boolean = isMineOnly) => {
    if (isBidRecordsLoading) return;
    setIsBidRecordsLoading(true);
    const size = loadAll ? ALL_BID_RECORD_SIZE : DEFAULT_BID_RECORD_SIZE;
    const res = await getBidRecords({
      auctionId: params.id,
      current: 1,
      size,
      searchCount: true,
      isMine: onlyMine,
    });
    if (res.errcode === 0 && res.data) {
      const records = res.data.records || [];
      setBidRecords(records);
      setBidRecordsTotal(res.data.total || records.length);
      setIsBidRecordsLoading(false);
      return;
    }
    setBidRecords([]);
    setBidRecordsTotal(0);
    setIsBidRecordsLoading(false);
  };

  useEffect(() => {
    setIsExpanded(false);
    setIsMineOnly(false);
    loadBidRecords(false, false);
  }, [params.id]);


  const handleMediaScroll = () => {
    if (!mediaRef.current) return;
    const width = mediaRef.current.clientWidth || 1;
    const index = Math.round(mediaRef.current.scrollLeft / width);
    const nextIndex = Math.min(Math.max(index, 0), mediaList.length - 1);
    if (nextIndex === currentMediaIndex) return;

    const prevVideo = videoRefs.current[prevMediaIndexRef.current];
    prevVideo?.pause();

    const nextVideo = videoRefs.current[nextIndex];
    setCurrentVideoTime(nextVideo?.currentTime || 0);
    setCurrentVideoDuration(nextVideo?.duration || 0);
    setIsCurrentVideoPlaying(Boolean(nextVideo && !nextVideo.paused));

    prevMediaIndexRef.current = nextIndex;
    setCurrentMediaIndex(nextIndex);
  };

  const handleToggleVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleExpandRecords = async () => {
    setIsExpanded(true);
    await loadBidRecords(true, isMineOnly);
  };

  const handleCollapseRecords = async () => {
    setIsExpanded(false);
    await loadBidRecords(false, isMineOnly);
  };

  const handleRefreshRecords = () => {
    loadBidRecords(isExpanded, isMineOnly);
  };

  const handleToggleMine = () => {
    const nextValue = !isMineOnly;
    setIsMineOnly(nextValue);
    loadBidRecords(isExpanded, nextValue);
  };

  const bidValidationMessage = useMemo(() => {
    if (!bidPrice || bidPrice <= 0) return '出价必须大于0';
    if (!isStepValid(bidPrice, bidStep)) return `出价需为${bidStep}的整数倍`;
    if (!Number.isInteger(bidCount) || bidCount <= 0) return '数量必须为正整数';
    if (bidCount < minBidCount) return `数量不能低于起拍数量(${minBidCount}头)`;
    return '';
  }, [bidPrice, bidCount, bidStep, minBidCount]);

  const isBidding = detail?.bidStatus === 'BIDDING';
  const canSubmit = isBidding && !bidValidationMessage && !isSubmitting;

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
      await loadDetail(true);
      await loadBidRecords(isExpanded, isMineOnly);
    }
    setIsSubmitting(false);
  };

  const handleOpenCancel = (record: BidRecordItem) => {
    setCancelTarget(record);
    setIsCancelDialogOpen(true);
  };

  const handleCancelBid = async () => {
    if (!cancelTarget || isCancelSubmitting || !isBidding) return;
    setIsCancelSubmitting(true);
    const res = await cancelBidRecord({
      auctionId: params.id,
      bidRecordId: cancelTarget.id,
    });
    if (res.errcode === 0) {
      setBidRecords(prev => prev.map(item => (item.id === cancelTarget.id ? { ...item, isCancelled: true } : item)));
      setIsCancelDialogOpen(false);
      setCancelTarget(null);
    }
    setIsCancelSubmitting(false);
  };

  const totalPrice = useMemo(() => {
    if (!bidPrice || !bidCount) return 0;
    return Number((bidPrice * bidCount).toFixed(2));
  }, [bidPrice, bidCount]);

  const isCurrentMediaVideo = isVideoUrl(mediaList[currentMediaIndex] || '');
  const progressPercent = currentVideoDuration > 0 ? Math.min(100, (currentVideoTime / currentVideoDuration) * 100) : 0;
  const bidStatus = detail?.bidStatus ?? 'BIDDING';
  const isEndedStatus = bidStatus === 'ENDED';
  const isWaitingStatus = bidStatus === 'WAITING';
  const statusLabel = isEndedStatus ? '竞价结束' : isWaitingStatus ? '等待竞价' : '竞价进行中';
  const statusBarClass = isEndedStatus ? 'bg-slate-400' : 'bg-industry-red';
  const countdownLabel = isEndedStatus ? '已结束' : isWaitingStatus ? '开始时间' : '距结束';
  const displayCountdown = isEndedStatus
    ? '00:00:00'
    : isWaitingStatus
      ? detail?.bidStartTime || '-'
      : formatCountdown(countdownSeconds);
  const customerBidStatus = (detail?.customerBidStatus ?? params.customerBidStatus ?? 'NO_BID') as MyBidStatus;
  const customerStatusConfig: Record<MyBidStatus, { label: string; className: string }> = {
    BIDDING: { label: '我的竞拍中', className: 'bg-white/20 text-white' },
    BID_SUCCESS: { label: '竞拍成功', className: 'bg-emerald-500/25 text-white' },
    BID_FAILED: { label: '竞拍失败', className: 'bg-white/20 text-white' },
    NO_BID: { label: '未参与', className: 'bg-white/20 text-white' },
  };
  const customerStatusMeta = customerStatusConfig[customerBidStatus] || customerStatusConfig.NO_BID;

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
                  ref={el => {
                    videoRefs.current[index] = el;
                  }}
                  src={url}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  poster={params.imageUrl}
                  webkit-playsinline="true"
                  autoPlay={index === currentMediaIndex}
                  loop
                  x5-playsinline="true"
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen="false"
                  x5-video-player-orientation="portrait"
                  onClick={() => handleToggleVideo(index)}
                  onTimeUpdate={event => {
                    if (index !== currentMediaIndex) return;
                    const target = event.currentTarget;
                    setCurrentVideoTime(target.currentTime);
                    setCurrentVideoDuration(target.duration || 0);
                  }}
                  onLoadedMetadata={event => {
                    if (index !== currentMediaIndex) return;
                    const target = event.currentTarget;
                    setCurrentVideoDuration(target.duration || 0);
                    setCurrentVideoTime(target.currentTime || 0);
                  }}
                  onPlay={() => {
                    if (index === currentMediaIndex) setIsCurrentVideoPlaying(true);
                  }}
                  onPause={() => {
                    if (index === currentMediaIndex) setIsCurrentVideoPlaying(false);
                  }}
                  onEnded={() => {
                    if (index === currentMediaIndex) setIsCurrentVideoPlaying(false);
                  }}
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
        {isCurrentMediaVideo && (
          <button
            onClick={() => handleToggleVideo(currentMediaIndex)}
            className="absolute bottom-12 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
            aria-label={isCurrentVideoPlaying ? '暂停播放' : '继续播放'}
          >
            {isCurrentVideoPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5z" /></svg>
            )}
          </button>
        )}
        {isCurrentMediaVideo && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white/80" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-[10px] text-white/90 font-mono">
              {formatMediaTime(currentVideoTime)}/{formatMediaTime(currentVideoDuration)}
            </span>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className={`${statusBarClass} px-4 py-2 flex justify-between items-center text-white`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{statusLabel}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${customerStatusMeta.className}`}>
            {customerStatusMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>{countdownLabel}</span>
          <span className="font-mono bg-white/20 px-1 rounded-sm">{displayCountdown}</span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg font-bold">{(detail?.pigTypeName || params.breed) + ' '  + (detail?.weightRanges?.join(' / ') + ' KG'  || params.weightRange)}</h1>
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
            <div className="text-xs text-slate-400 mb-1">场点：{detail?.farmName || params.farmName}</div>
            <div className="text-[11px] text-slate-500">竞价开始时间：{detail?.bidStartTime || params.bidStartTime || '-'}</div>
          </div>
          <div className="bg-industry-red/5 px-2 py-1 rounded-sm border border-industry-red/20">
            <span className="text-industry-red text-[10px] font-bold">最高价</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-industry-red text-2xl font-bold">¥{displayPriceValue.toFixed(2)}</span>
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
      <div className="p-4 flex items-start justify-between gap-4 border-b-8 border-slate-100">
        <div className="flex-1">
          <h2 className="text-sm font-bold">信息维护</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">请确认收货地址、装猪时间等基础信息</p>
          <div className="mt-2 text-[11px] text-slate-500">
            {isMaintenanceLoading ? (
              <span className="text-slate-400">维护信息加载中...</span>
            ) : maintenanceInfo ? (
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-sm font-bold">已维护</span>
                    <span>{maintenanceInfo.contactName}</span>
                    <span>{maintenanceInfo.contactPhone}</span>
                  </div>
                  <div className="mt-1 text-slate-600">{maintenanceInfo.regionName} {maintenanceInfo.detailAddress}</div>
                </div>
                <div>
                  <span className="text-slate-400">装猪时间：</span>
                  <span className="text-slate-700 font-medium">{maintenanceInfo.appointmentTime}</span>
                </div>
                <div>
                  <span className="text-slate-400">备注：</span>
                  <span className="text-slate-700">{maintenanceInfo.remark || '无'}</span>
                </div>
              </div>
            ) : (
              <div>
                {isAddressLoading ? (
                  <span className="text-slate-400">默认地址加载中...</span>
                ) : defaultAddress ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-industry-red/10 text-industry-red rounded-sm font-bold">默认地址</span>
                      <span>{defaultAddress.contactName}</span>
                      <span>{defaultAddress.contactPhone}</span>
                    </div>
                    <div className="mt-1 text-slate-600">{defaultAddress.regionName} {defaultAddress.detailAddress}</div>
                  </div>
                ) : (
                  <span className="text-slate-400">暂无维护信息</span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onNavigate?.('auction-maintenance', { auctionId: params.id })}
          className="bg-industry-red text-white px-4 py-1.5 rounded-custom text-xs font-bold shadow-sm shadow-industry-red/20"
        >
          立即维护
        </button>
      </div>

      {/* Bidding Params */}
      <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8 border-b-8 border-slate-100">
        <ParamItem label="起拍数量" value={`${detail?.startingCount ?? params.startingCount}头`} />
        <ParamItem label="加价幅度" value={`${detail?.bidStep ?? 0}元/kg`} />
        <ParamItem label="加拍价" value={`¥${detail?.addPrice ?? 0}`} />
        <ParamItem label="竞拍头数" value={`${detail?.quantity ?? params.quantity}头`} />
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">{bidRecordsTotal ? `共${bidRecordsTotal}条` : '最新10条'}</span>
            <button
              onClick={handleToggleMine}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${
                isMineOnly ? 'bg-industry-red text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              我的
            </button>
            <button
              onClick={handleRefreshRecords}
              className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 active:bg-slate-200"
            >
              刷新
            </button>
          </div>
        </div>
        <div className="bg-slate-50 rounded-custom overflow-hidden">
          <div className="grid grid-cols-5 text-[10px] text-slate-400 px-3 py-2 border-b border-slate-100">
            <span>客户名称</span>
            <span>价格</span>
            <span>数量</span>
            <span>时间</span>
            <span className="text-right">是否取消</span>
          </div>
          {bidRecords.map(record => {
            const rowClassName = record.isCurrentCustomer
              ? 'grid grid-cols-5 text-[11px] text-industry-red px-3 py-2 border-b border-industry-red/10 bg-industry-red/5 last:border-b-0'
              : 'grid grid-cols-5 text-[11px] text-slate-700 px-3 py-2 border-b border-slate-100 last:border-b-0';

            return (
              <div key={record.id} className={rowClassName}>
                <span className="truncate">{record.customerName}</span>
                <span>¥{record.price.toFixed(2)}</span>
                <span>{record.quantity}头</span>
                <span>{record.time}</span>
                <span className="text-right">
                  {record.isCurrentCustomer ? (
                    record.isCancelled ? (
                      <span className="text-[10px] text-slate-400">已取消</span>
                    ) : isBidding ? (
                      <button
                        onClick={() => handleOpenCancel(record)}
                        className="text-[10px] font-bold text-industry-red bg-white/80 border border-industry-red/30 px-2 py-0.5 rounded-full"
                      >
                        取消
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">-</span>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-400"> </span>
                  )}
                </span>
              </div>
            );
          })}
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
            className="w-full mt-3 py-2 flex justify-center"
            aria-label="展开出价明细"
          >
            <span className="w-7 h-7 rounded-full bg-industry-red/10 text-industry-red flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        )}
        {isExpanded && (
          <button
            onClick={handleCollapseRecords}
            className="w-full mt-3 py-2 flex justify-center"
            aria-label="收起出价明细"
          >
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </span>
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
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-slate-400 block mb-1 text-center">出价 (元/kg)</label>
            <div className="flex items-center justify-center bg-slate-100 rounded-custom p-1">
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
                className="flex-1 min-w-0 bg-transparent text-center font-bold text-sm focus:outline-none"
              />
              <button
                onClick={() => setBidPrice(p => Number((p + bidStep).toFixed(2)))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-slate-400 block mb-1 text-center">数量 (头)</label>
            <div className="flex items-center justify-center bg-slate-100 rounded-custom p-1">
              <button onClick={() => setBidCount(c => Math.max(0, c - 1))} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">-</button>
              <input
                type="number"
                value={bidCount}
                onChange={e => setBidCount(parseInt(e.target.value, 10) || 0)}
                className="flex-1 min-w-0 bg-transparent text-center font-bold text-sm focus:outline-none"
              />
              <button onClick={() => setBidCount(c => c + 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">+</button>
            </div>
          </div>
        </div>
        {bidValidationMessage && (
          <div className="mt-2 text-[10px] text-industry-red">{bidValidationMessage}</div>
        )}

        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={!canSubmit}
          className="w-full mt-4 bg-industry-red text-white py-3 rounded-custom font-bold shadow-lg shadow-industry-red/20 active:scale-95 transition-transform disabled:opacity-60"
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

      {/* Cancel Bid Dialog */}
      {isCancelDialogOpen && cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center px-6" onClick={() => setIsCancelDialogOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-slate-800">确认取消出价</h3>
              <p className="text-[11px] text-slate-400 mt-1">取消后将保留记录并标记为已取消</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>出价时间</span><span className="text-slate-800 font-bold">{cancelTarget.time}</span></div>
              <div className="flex justify-between"><span>出价价格</span><span className="text-slate-800 font-bold">¥{cancelTarget.price.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>出价数量</span><span className="text-slate-800 font-bold">{cancelTarget.quantity}头</span></div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setIsCancelDialogOpen(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-custom font-bold"
              >
                取消
              </button>
              <button
                onClick={handleCancelBid}
                disabled={isCancelSubmitting || !isBidding}
                className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold disabled:opacity-60"
              >
                {isCancelSubmitting ? '处理中...' : '确认取消'}
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
