
import React, { useState } from 'react';

interface FreeQuoteProps {
  onBack: () => void;
}

const FreeQuote: React.FC<FreeQuoteProps> = ({ onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [bidPrice, setBidPrice] = useState(16.5);
  const [bidCount, setBidCount] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('报价已成功提交，请在“我的报单”中查看进度！');
      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative overflow-y-auto">
      {/* Header Image Section */}
      <div className="relative aspect-[4/3] w-full bg-slate-200">
        <img src="https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=800&fit=crop" alt="" className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm font-black tracking-widest">
          1 / 3
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-4 right-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform">
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <span className="bg-industry-red text-[10px] px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter">自由报价</span>
          <span className="text-sm font-black tracking-tight">收集报价中</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="opacity-60 uppercase tracking-tighter">Ends In</span>
          <span className="font-mono bg-white/10 px-2 py-0.5 rounded-sm">02 : 15 : 33</span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-5 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-[19px] font-black text-slate-800 tracking-tight">育肥猪 105-125kg 白猪</h1>
              <span className="text-[10px] text-industry-red bg-industry-red/5 px-2 py-1 rounded-sm border border-industry-red/10 font-black">挪系 A</span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              场次：自由贸易区 - 华东 012 号数字化中心
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-industry-red text-2xl font-black tracking-tighter">¥ 16.50</span>
          <span className="text-slate-400 text-[10px] font-black uppercase">参考指导价 元/kg</span>
        </div>
      </div>

      {/* Info Maintenance Section */}
      <div className="p-5 border-b-8 border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-black text-slate-800">报单信息维护</h2>
            <span className="text-industry-red text-[10px] font-black">必填项</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-custom border border-slate-100 active:bg-slate-100 transition-colors cursor-pointer group" onClick={() => alert('进入信息维护界面')}>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-600 font-bold">装车地址与时间</span>
              <span className="text-[10px] text-slate-400">请完善卸货地址、装猪时间及特殊要求</span>
            </div>
            <button className="text-industry-red text-[11px] font-black border-b-2 border-industry-red/20 group-hover:border-industry-red transition-all">立即去完善 &gt;</button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <h2 className="text-[14px] font-black text-slate-800">自由报价参数</h2>
        <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-custom border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">起拍数量限制</div>
                <div className="text-sm font-black text-slate-800 tracking-tight">100 头起报</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-custom border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">加拍价格步长</div>
                <div className="text-sm font-black text-slate-800 tracking-tight">0.10 元 / kg</div>
             </div>
        </div>
      </div>

      {/* Bid Input area */}
      <div className="p-5 bg-slate-50/50 mt-2 border-y border-slate-100">
        <div className="flex gap-5">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 font-black block mb-2 uppercase tracking-widest">您的实时报价 (元/kg)</label>
            <div className="flex items-center bg-white rounded-custom p-1 border border-slate-200 shadow-sm overflow-hidden focus-within:border-industry-red/50 transition-colors">
              <button onClick={() => setBidPrice(p => Math.max(0, parseFloat((p - 0.1).toFixed(2))))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-industry-red active:bg-slate-50 font-black text-lg transition-colors">-</button>
              <input type="number" step="0.1" value={bidPrice} onChange={e => setBidPrice(parseFloat(e.target.value))} className="flex-1 bg-transparent text-center font-black text-[17px] text-industry-text focus:outline-none tracking-tighter" />
              <button onClick={() => setBidPrice(p => parseFloat((p + 0.1).toFixed(2)))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-industry-red active:bg-slate-50 font-black text-lg transition-colors">+</button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 font-black block mb-2 uppercase tracking-widest">报价总头数 (头)</label>
            <div className="flex items-center bg-white rounded-custom p-1 border border-slate-200 shadow-sm overflow-hidden focus-within:border-industry-red/50 transition-colors">
              <button onClick={() => setBidCount(c => Math.max(100, c - 10))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-industry-red active:bg-slate-50 font-black text-lg transition-colors">-</button>
              <input type="number" value={bidCount} onChange={e => setBidCount(parseInt(e.target.value))} className="flex-1 bg-transparent text-center font-black text-[17px] text-industry-text focus:outline-none tracking-tighter" />
              <button onClick={() => setBidCount(c => c + 10)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-industry-red active:bg-slate-50 font-black text-lg transition-colors">+</button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-slate-400 font-medium text-center italic">注：您的报价将直接参与平台大数据撮合，请谨慎出价</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-white border-t border-slate-100 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-custom font-black shadow-xl shadow-industry-red/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-industry-red hover:bg-[#991B1B] text-white'}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              提交报价中...
            </>
          ) : '确认提交并参与撮合'}
        </button>
      </div>
    </div>
  );
};

export default FreeQuote;
