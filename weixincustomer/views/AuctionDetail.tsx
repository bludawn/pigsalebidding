
import React, { useState } from 'react';
import { AuctionItem } from '../types';

interface AuctionDetailProps {
  params: AuctionItem;
  onBack: () => void;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ params, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [bidPrice, setBidPrice] = useState(params.startingPrice);
  const [bidCount, setBidCount] = useState(params.startingCount);

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Header Image Section */}
      <div className="relative aspect-[4/3] w-full">
        <img src={params.imageUrl} alt="" className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
          1/4
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
      </div>

      {/* Status Bar */}
      <div className="bg-industry-red px-4 py-2 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-sm font-medium">{params.breed}</span>
          <span className="text-sm font-bold">竞价进行中</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>距结束</span>
          <span className="font-mono bg-white/20 px-1 rounded-sm">00:44:12</span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold">{params.weightRange}</h1>
              <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">{params.category}</span>
            </div>
            <div className="text-xs text-slate-400 mb-2">场次：{params.farmName}</div>
          </div>
          <div className="bg-industry-red/5 px-2 py-1 rounded-sm border border-industry-red/20">
            <span className="text-industry-red text-[10px] font-bold">最高价</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-industry-red text-2xl font-bold">¥{params.startingPrice}</span>
          <span className="text-slate-400 text-xs">元/kg</span>
        </div>
        <div className="mt-3 p-2 bg-amber-50 rounded-sm flex items-start gap-2 border border-amber-100">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <span className="text-xs text-amber-800 leading-tight font-medium">备注：东部区调运，需持有有效调运凭证，提前联系场点核实。</span>
        </div>
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
        <ParamItem label="起拍数量" value={`${params.startingCount}头`} />
        <ParamItem label="加拍幅度" value="0.05元/kg" />
        <ParamItem label="加拍价" value="¥16.55" />
        <ParamItem label="无疫小区" value="是" />
        <ParamItem label="开票范围" value="全国通用" />
        <ParamItem label="自派车" value="允许" />
        <ParamItem label="饲养品质" value="五星推荐" />
        <ParamItem label="防疫状态" value="已接种三联苗" />
      </div>

      {/* Rules */}
      <div className="p-4 border-b-8 border-slate-100">
        <h2 className="text-sm font-bold mb-3">竞价须知</h2>
        <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-custom">
          1. 参与竞价需缴纳保证金，未中标全额退还。<br/>
          2. 中标后请在1小时内完成定金支付。<br/>
          3. 严禁恶意围标、悔标，违者扣除全部保证金。
        </div>
      </div>

      {/* Delegate Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">委托出价</h2>
            <span className="text-[10px] text-slate-400">您暂未设置委托</span>
          </div>
          <div className="flex gap-4">
            <button className="text-industry-red text-xs font-bold">明细</button>
            <button className="text-industry-red text-xs font-bold">设置委托</button>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-1">出价 (元/kg)</label>
            <div className="flex items-center bg-slate-100 rounded-custom p-1">
              <button onClick={() => setBidPrice(p => Math.max(0, p - 0.05))} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">-</button>
              <input type="number" value={bidPrice} onChange={e => setBidPrice(parseFloat(e.target.value))} className="flex-1 bg-transparent text-center font-bold text-sm focus:outline-none" />
              <button onClick={() => setBidPrice(p => p + 0.05)} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">+</button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block mb-1">数量 (头)</label>
            <div className="flex items-center bg-slate-100 rounded-custom p-1">
              <button onClick={() => setBidCount(c => Math.max(0, c - 1))} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">-</button>
              <input type="number" value={bidCount} onChange={e => setBidCount(parseInt(e.target.value))} className="flex-1 bg-transparent text-center font-bold text-sm focus:outline-none" />
              <button onClick={() => setBidCount(c => c + 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 z-30">
        <button className="w-full bg-industry-red text-white py-3 rounded-custom font-bold shadow-lg shadow-industry-red/20 active:scale-95 transition-transform">
          确认出价
        </button>
      </div>
    </div>
  );
};

const ParamItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-slate-400">{label}</span>
    <span className="text-xs font-bold text-slate-800">{value}</span>
  </div>
);

export default AuctionDetail;
