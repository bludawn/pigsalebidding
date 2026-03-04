
import React from 'react';

interface MatchDetailProps {
  onBack: () => void;
}

const MatchDetail: React.FC<MatchDetailProps> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack}>
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">报单匹配详情</h1>
        <button className="text-xs text-industry-red font-bold">原始报单</button>
      </div>

      <div className="bg-industry-red px-6 py-4 text-white">
        <h2 className="text-base font-bold">您的报单过磅完成～</h2>
        <p className="text-[11px] opacity-80 mt-1">恭喜！本次报单匹配圆满完成，款项已在结算中。</p>
      </div>

      <div className="bg-white m-4 rounded-custom border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-industry-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <span className="text-xs font-bold">牧原股份华东区第一场</span>
          </div>
          <span className="bg-industry-red text-white text-[9px] px-2 py-0.5 rounded-sm">整车</span>
        </div>
        
        <div className="p-4 flex gap-4 border-b border-slate-50">
          <img src="https://images.unsplash.com/photo-1544216717-3bbf52512659?w=160&fit=crop" alt="" className="w-20 h-20 rounded-custom object-cover" />
          <div className="flex-1">
             <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold">育肥猪 105-125kg</h3>
             </div>
             <div className="text-[10px] text-slate-400 mt-1">品系：挪系 A</div>
             <div className="mt-2 text-industry-red font-bold text-lg">¥16.50 <span className="text-[10px] font-normal text-slate-400">元/kg</span></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
           <div className="grid grid-cols-2 gap-y-4">
              <DetailItem label="品相" value="优质 A 级" />
              <DetailItem label="产品等级" value="精选 A 级" />
              <DetailItem label="匹配数量" value="240头" />
              <DetailItem label="计划编号" value="JH20240508001" />
           </div>
           <div className="pt-2 border-t border-slate-50">
              <DetailItem label="报单时间" value="2024-05-08 09:30:12" />
           </div>
        </div>
      </div>

      <div className="bg-white m-4 rounded-custom border border-slate-100 p-4 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold flex items-center gap-2">
          <div className="w-1 h-3 bg-industry-red rounded-full"></div>
          物流信息
        </h3>
        <DetailItem label="装猪时间" value="2024-05-10 14:00" />
        <DetailItem label="派车类型" value="自派车" />
        <DetailItem label="收货地址" value="江苏省苏州市工业园区娄葑街道 102 号" />
      </div>

      <div className="bg-white m-4 rounded-custom border border-slate-100 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold">预计金额</span>
          <span className="text-xl font-black text-industry-red">¥ 455,400.00</span>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-slate-400">{label}</span>
    <span className="text-[11px] font-bold text-slate-800">{value}</span>
  </div>
);

export default MatchDetail;
