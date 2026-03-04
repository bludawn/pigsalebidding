
import React from 'react';

interface ProfileViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-4 z-10">
          <button onClick={() => alert('已开启扫一扫')} className="text-slate-800 p-1 active:bg-slate-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          </button>
          <button onClick={() => alert('进入系统设置')} className="text-slate-800 p-1 active:bg-slate-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?w=150&h=150&fit=crop" alt="" className="w-18 h-18 rounded-full border-4 border-industry-red/5 object-cover shadow-sm" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-slate-50">
              <svg className="w-3.5 h-3.5 text-industry-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800">生猪达人_5892</h2>
              <span className="bg-industry-red/10 text-industry-red text-[10px] px-2 py-0.5 rounded-custom font-black border border-industry-red/20 uppercase tracking-tighter">Gold VIP</span>
            </div>
            <div className="flex gap-6 mt-3">
              <button className="flex flex-col items-start active:opacity-70">
                <span className="text-base font-black text-slate-800 leading-none">24</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1">我的收藏</span>
              </button>
              <button className="flex flex-col items-start active:opacity-70">
                <span className="text-base font-black text-slate-800 leading-none">156</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1">我的足迹</span>
              </button>
            </div>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="mt-8 flex gap-4">
          <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-custom p-4 text-white flex justify-between items-center shadow-lg active:scale-95 transition-transform">
            <div>
               <div className="text-[10px] opacity-70 font-bold">积分可抵</div>
               <div className="text-base font-black mt-1 tracking-tight">¥ 2,450.00</div>
            </div>
            <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-industry-red to-[#991B1B] rounded-custom p-4 text-white flex justify-between items-center shadow-lg active:scale-95 transition-transform">
            <div>
               <div className="text-[10px] opacity-70 font-bold">优惠券</div>
               <div className="text-base font-black mt-1 tracking-tight">5 张可用</div>
            </div>
            <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white m-4 rounded-custom p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[15px] font-black text-slate-800">我的订单</h3>
          <button className="text-[11px] text-slate-400 font-bold hover:text-industry-red transition-colors">全部订单 &gt;</button>
        </div>
        <div className="flex justify-around">
          <OrderItem label="待付款" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <OrderItem label="待发货" count={2} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} />
          <OrderItem label="待收货" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>} />
          <OrderItem label="待评价" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>} />
          <OrderItem label="售后" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>} />
        </div>
      </div>

      {/* Asset & Stats Section */}
      <div className="bg-white mx-4 mt-2 rounded-custom p-5 shadow-sm border border-slate-100">
        <div className="pb-6 border-b border-slate-50">
           <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-black text-slate-800">账户总资产</h3>
              <span className="text-industry-red text-[17px] font-black tracking-tighter">¥ 1,280,450.00</span>
           </div>
           <div className="flex gap-4">
              <AssetBtn label="赊销账单" value="12,000" icon="📄" />
              <AssetBtn label="运费余额" value="2,450.00" icon="🚛" />
           </div>
        </div>
        
        <div className="pt-6">
          <h3 className="text-[14px] font-black text-slate-800 mb-5">业务统计</h3>
          <div className="grid grid-cols-4 gap-4">
             <StatItem label="匹配中" value="2" color="text-slate-800" />
             <StatItem label="待确认" value="0" color="text-slate-400" />
             <StatItem label="待报价" value="4" color="text-industry-red" />
             <StatItem label="已回复" value="1" color="text-slate-800" />
          </div>
        </div>
      </div>

      {/* Function Grid */}
      <div className="bg-white mx-4 mt-4 rounded-custom p-5 shadow-sm border border-slate-100 grid grid-cols-4 gap-y-8">
        <FuncBtn label="服务经理" icon="👔" />
        <FuncBtn label="预付定金" icon="💳" />
        <FuncBtn label="发票管理" icon="🧾" />
        <FuncBtn label="地址管理" icon="📍" />
        <FuncBtn label="车辆管理" icon="🚚" />
        <FuncBtn label="购物车" icon="🛒" />
        <FuncBtn label="合同协议" icon="🤝" />
        <FuncBtn label="投诉工单" icon="⚠️" />
        <FuncBtn label="我的评价" icon="📝" />
        <FuncBtn label="商家入驻" icon="🏢" />
      </div>

      {/* Featured Products */}
      <div className="p-4 mt-4 pb-12">
         <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[15px] font-black text-slate-800">优质场次甄选</h2>
            <div className="flex gap-5">
               <span className="text-[11px] font-black text-industry-red border-b-2 border-industry-red pb-0.5">育肥猪</span>
               <span className="text-[11px] font-bold text-slate-400 active:text-industry-red transition-colors">仔猪</span>
               <span className="text-[11px] font-bold text-slate-400 active:text-industry-red transition-colors">母猪</span>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <FeaturedCard 
              image="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop"
              title="牧原·鲁南中心场"
              price="16.50"
              tag="挪系A级"
            />
            <FeaturedCard 
              image="https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&h=300&fit=crop"
              title="温氏·清远优质场"
              price="15.80"
              tag="三元精选"
            />
         </div>
      </div>
    </div>
  );
};

const OrderItem: React.FC<{ label: string, icon: React.ReactNode, count?: number }> = ({ label, icon, count }) => (
  <button className="flex flex-col items-center gap-2 relative active:scale-95 transition-transform group">
    <div className="text-slate-600 group-active:text-industry-red transition-colors">{icon}</div>
    <span className="text-[10px] text-slate-500 font-bold">{label}</span>
    {count && count > 0 && (
      <span className="absolute -top-1 -right-1 bg-industry-red text-white text-[9px] min-w-[15px] h-3.5 rounded-full flex items-center justify-center border border-white font-black shadow-sm px-1">
        {count}
      </span>
    )}
  </button>
);

const AssetBtn: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <button className="flex-1 flex items-center gap-3 bg-slate-50 p-3 rounded-custom text-left border border-slate-100/50 active:bg-slate-100 transition-colors">
    <span className="text-xl filter drop-shadow-sm">{icon}</span>
    <div className="flex flex-col">
       <span className="text-[10px] text-slate-400 font-bold">{label}</span>
       <span className="text-[13px] font-black text-slate-800 tracking-tighter">¥{value}</span>
    </div>
  </button>
);

const StatItem: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 rounded-custom border border-slate-50 active:bg-slate-100 transition-colors cursor-pointer">
    <span className={`text-base font-black tracking-tight ${color}`}>{value}</span>
    <span className="text-[10px] text-slate-400 font-black">{label}</span>
  </div>
);

const FuncBtn: React.FC<{ label: string, icon: string }> = ({ label, icon }) => (
  <button onClick={() => alert(`正在进入: ${label}`)} className="flex flex-col items-center gap-3 active:scale-90 transition-transform group">
    <div className="w-11 h-11 bg-slate-50 group-active:bg-industry-red/5 rounded-custom flex items-center justify-center text-xl shadow-sm border border-slate-100/30 group-hover:border-industry-red/20 transition-all">{icon}</div>
    <span className="text-[10px] text-slate-600 font-bold">{label}</span>
  </button>
);

const FeaturedCard: React.FC<{ image: string, title: string, price: string, tag: string }> = ({ image, title, price, tag }) => (
  <div className="bg-white rounded-custom border border-slate-100 overflow-hidden shadow-sm active:shadow-md transition-shadow cursor-pointer">
    <div className="relative h-28">
      <img src={image} alt="" className="w-full h-full object-cover" />
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-sm font-black">
        {tag}
      </div>
    </div>
    <div className="p-3">
       <div className="text-[11px] font-black text-slate-800 truncate">{title}</div>
       <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-industry-red text-sm font-black tracking-tighter">¥ {price}</span>
          <span className="text-[9px] text-slate-400 font-bold">元/kg</span>
       </div>
    </div>
  </div>
);

export default ProfileView;
