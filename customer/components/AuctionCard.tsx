import React from 'react';
import { MyBidStatus } from '../types';

interface AuctionCardProps {
  topBar: React.ReactNode;
  topBarClassName: string;
  onClick: () => void;
  farmIcon: string;
  farmName: string;
  imageUrl: string;
  breed: string;
  quantity: number;
  weightRange: string;
  tags: string[];
  startingCount: number;
  startingPrice: number;
  bidStartTime?: string;
  customerBidStatus?: MyBidStatus;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  topBar,
  topBarClassName,
  onClick,
  farmIcon,
  farmName,
  imageUrl,
  breed,
  quantity,
  weightRange,
  tags,
  startingCount,
  startingPrice,
  bidStartTime,
  customerBidStatus,
}) => {
  const customerStatusConfig: Record<MyBidStatus, { label: string; className: string }> = {
    BIDDING: { label: '我的竞拍中', className: 'bg-amber-50 text-amber-600' },
    BID_SUCCESS: { label: '竞拍成功', className: 'bg-emerald-50 text-emerald-600' },
    BID_FAILED: { label: '竞拍失败', className: 'bg-rose-50 text-rose-600' },
    NO_BID: { label: '未参与', className: 'bg-slate-100 text-slate-400' },
  };
  const customerStatusMeta = customerBidStatus ? customerStatusConfig[customerBidStatus] : null;

  return (
    <div
      className="bg-white rounded-custom overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className={`${topBarClassName} px-3 py-2 flex justify-between items-center`}>
        {topBar}
      </div>

      <div className="px-3 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <img src={farmIcon} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-sm" />
          <span className="text-xs font-bold text-slate-800">{farmName}</span>
        </div>
        {customerStatusMeta && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${customerStatusMeta.className}`}>
            {customerStatusMeta.label}
          </span>
        )}
      </div>

      <div className="p-3 flex gap-4 relative items-center">
        <div className="relative w-28 h-28 flex-shrink-0 group">
          <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-custom border border-slate-100 shadow-inner" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-custom">
            <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <svg className="w-4 h-4 text-industry-red translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
              </svg>
            </div>
          </div>
          <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold backdrop-blur-sm">
            {breed}
          </div>
          <div className="absolute bottom-1 right-1 bg-white/95 text-industry-text text-[9px] px-2 py-0.5 rounded-sm font-bold shadow-sm">
            {quantity}头
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between h-28 py-0.5">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 line-clamp-1">{`${breed} ${weightRange} KG`}</h3>
            {bidStartTime && (
              <div className="text-[10px] text-slate-500 mt-1">竞价开始时间：{bidStartTime}</div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-industry-gray text-[10px] mb-1">
              起拍头数：<span className="text-slate-700 font-bold">{startingCount}</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-industry-red text-xl font-black">¥{startingPrice.toFixed(2)}</span>
              <span className="text-industry-gray text-[10px] font-medium">元/kg</span>
            </div>
          </div>
        </div>

        <div className="self-center">
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
