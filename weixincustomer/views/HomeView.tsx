
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';

interface HomeViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const PIG_IMAGES = [
  'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&h=300&fit=crop', // 猪只1
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop', // 猪只2
  'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=300&fit=crop', // 养殖场
  'https://images.unsplash.com/photo-1597113366853-fea190b6cd82?w=400&h=300&fit=crop', // 猪群
];

const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: '1',
    farmName: '牧原股份·山东五号场',
    farmIcon: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=100&h=100&fit=crop',
    breed: '挪系 A',
    quantity: 240,
    weightRange: '育肥猪 105-125kg',
    category: '白猪',
    quality: 'A 票',
    startingPrice: 16.5,
    startingCount: 200,
    endTime: new Date(Date.now() + 1000 * 60 * 45),
    imageUrl: PIG_IMAGES[0]
  },
  {
    id: '2',
    farmName: '温氏集团·广东清远基地',
    farmIcon: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=100&h=100&fit=crop',
    breed: '三元 A',
    quantity: 180,
    weightRange: '大猪 125-140kg',
    category: '黑猪',
    quality: 'B 票',
    startingPrice: 17.2,
    startingCount: 150,
    endTime: new Date(Date.now() + 1000 * 60 * 120),
    imageUrl: PIG_IMAGES[1]
  }
];

const Countdown: React.FC<{ endTime: Date }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1">
      <span className="text-white text-xs font-medium">距竞价结束</span>
      <div className="flex items-center gap-0.5 ml-1">
        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.h}</span>
        <span className="text-white text-[10px]">:</span>
        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.m}</span>
        <span className="text-white text-[10px]">:</span>
        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.s}</span>
      </div>
    </div>
  );
};

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [distance, setDistance] = useState(500);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filterConfigs = {
    '区域': ['全省', '济南市', '青岛市', '淄博市', '枣庄市'],
    '体重段': ['全部', '100kg以下', '100-110kg', '110-120kg', '120kg以上'],
    '产品等级': ['全部', '挪系A', '挪系', '三元A', '三元', '法系A', '法系', '其他'],
    'AB票': ['全部', 'A票', 'B票']
  };

  const openFilter = (tab: string) => {
    setActiveFilterTab(tab);
    setShowFilterDrawer(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-industry-bg relative">
      {/* Search Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b border-slate-100 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索场点、品种或地区" 
            className="w-full bg-slate-100 rounded-custom px-4 py-2 pl-10 text-sm focus:outline-none"
          />
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            </button>
          )}
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-3 mt-3 overflow-x-auto hide-scrollbar">
          {Object.keys(filterConfigs).map(f => (
            <button 
              key={f} 
              onClick={() => openFilter(f)}
              className="flex items-center gap-1 whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded-custom border border-slate-100 text-[11px] text-slate-600 active:bg-slate-100"
            >
              {f} <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          ))}
          <button onClick={() => openFilter('距离')} className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-custom border text-[11px] bg-slate-50 border-slate-100 text-slate-600 active:bg-slate-100`}>
            距离({distance}km)
          </button>
        </div>
      </div>

      {/* Filter Drawer Overlay */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-in fade-in duration-200" onClick={() => setShowFilterDrawer(false)}>
          <div className="bg-white w-full rounded-t-xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">选择{activeFilterTab}</h3>
              <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {activeFilterTab === '距离' ? (
              <div className="pb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-slate-500">距离范围 (100km - 900km)</span>
                  <span className="text-industry-red font-black text-lg">{distance}km</span>
                </div>
                <div className="flex items-center gap-6">
                  <button onClick={() => setDistance(prev => Math.max(100, prev - 100))} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 font-bold active:bg-slate-200">-</button>
                  <input 
                    type="range" min="100" max="900" step="100" value={distance} 
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="flex-1 accent-industry-red h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <button onClick={() => setDistance(prev => Math.min(900, prev + 100))} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 font-bold active:bg-slate-200">+</button>
                </div>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => { setDistance(500); setShowFilterDrawer(false); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-custom font-bold">重置</button>
                  <button onClick={() => setShowFilterDrawer(false)} className="flex-1 py-3 bg-industry-red text-white rounded-custom font-bold">确定</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pb-6">
                {(filterConfigs[activeFilterTab as keyof typeof filterConfigs] || []).map(item => (
                  <button 
                    key={item} 
                    onClick={() => setShowFilterDrawer(false)}
                    className="w-full text-left py-3.5 px-4 rounded-custom bg-slate-50 text-slate-700 text-sm font-medium active:bg-slate-100 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auction List */}
      <div className="px-4 py-4 flex flex-col gap-4">
        {MOCK_AUCTIONS.map(item => (
          <div key={item.id} className="bg-white rounded-custom overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-transform" onClick={() => onNavigate('auction-detail', item)}>
            {/* Countdown Bar */}
            <div className="bg-industry-red px-3 py-2 flex justify-between items-center">
              <Countdown endTime={item.endTime} />
            </div>
            
            {/* Farm Info Bar */}
            <div className="px-3 py-3 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <img src={item.farmIcon} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-sm" />
                <span className="text-xs font-bold text-slate-800">{item.farmName}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); alert('已关注场点'); }}
                className="flex items-center gap-1 text-[10px] text-industry-red border border-industry-red/30 px-2 py-1 rounded-full active:bg-industry-red active:text-white transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                关注
              </button>
            </div>

            {/* Pig Info Bar */}
            <div className="p-3 flex gap-4 relative items-center">
              <div className="relative w-28 h-28 flex-shrink-0 group">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-custom border border-slate-100 shadow-inner" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-custom">
                  <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <svg className="w-4 h-4 text-industry-red translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" /></svg>
                  </div>
                </div>
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold backdrop-blur-sm">
                  {item.breed}
                </div>
                <div className="absolute bottom-1 right-1 bg-white/95 text-industry-text text-[9px] px-2 py-0.5 rounded-sm font-bold shadow-sm">
                  {item.quantity}头
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between h-28 py-0.5">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 line-clamp-1">{item.weightRange}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-sm font-medium">{item.category}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-sm font-medium">{item.quality}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-industry-gray text-[10px] mb-1">起拍头数：<span className="text-slate-700 font-bold">{item.startingCount}</span></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-industry-red text-xl font-black">¥{item.startingPrice}</span>
                    <span className="text-industry-gray text-[10px] font-medium">元/kg</span>
                  </div>
                </div>
              </div>

              <div className="self-center">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State if no results */}
      {MOCK_AUCTIONS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-slate-400 text-sm">暂无匹配竞价信息，请尝试调整过滤条件</p>
        </div>
      )}

      {/* Floating Plus Button */}
      <button 
        onClick={() => onNavigate('free-quote')}
        className="fixed bottom-24 right-6 w-15 h-15 bg-industry-red rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-40 border-[5px] border-white ring-1 ring-slate-100"
      >
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span className="text-[9px] font-black uppercase">报价</span>
        </div>
      </button>
    </div>
  );
};

export default HomeView;
