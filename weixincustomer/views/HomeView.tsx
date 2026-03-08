
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AuctionItem, BidStatus, FilterState, PaginationState } from '../types';
import { getAuctionList, setRequestHeaders } from '../AppApi';
import { useAppContext } from '../App';
import RegionPicker from './RegionPicker';

interface HomeViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const PIG_IMAGES = [
  'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1597113366853-fea190b6cd82?w=400&h=300&fit=crop',
];

const PAGE_SIZE = 20;

// 倒计时组件
const Countdown: React.FC<{ endTime: Date; bidStatus: BidStatus }> = ({ endTime, bidStatus }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (bidStatus !== 'BIDDING') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ h: '00', m: '00', s: '00' });
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
  }, [endTime, bidStatus]);

  return (
    <div className="flex items-center gap-0.5">
      <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.h}</span>
      <span className="text-white text-[10px]">:</span>
      <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.m}</span>
      <span className="text-white text-[10px]">:</span>
      <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">{timeLeft.s}</span>
    </div>
  );
};

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { farms, productTags } = useAppContext();

  // 筛选条件状态
  const [filter, setFilter] = useState<FilterState>({
    distance: 500,
  });

  // 分页状态
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    size: PAGE_SIZE,
    total: 0,
    pages: 0,
    hasMore: true,
    loading: false,
  });

  // 数据列表
  const [auctionList, setAuctionList] = useState<AuctionItem[]>([]);
  
  // UI状态
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  // 滚动容器引用
  const scrollRef = useRef<HTMLDivElement>(null);
  const pullStartYRef = useRef<number | null>(null);

  // 加载竞价列表数据
  const loadAuctionList = useCallback(async (page: number, append: boolean = false) => {
    if (pagination.loading) return;

    setPagination(prev => ({ ...prev, loading: true }));

    try {
      const res = await getAuctionList({
        current: page,
        size: PAGE_SIZE,
        searchCount: true,
        search: searchQuery || undefined,
        farmId: filter.farmId,
        regionCode: filter.regionCode,
        weightRange: filter.weightRange,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        distance: filter.distance,
      });

      if (res.errcode === 0 && res.data) {
        const { records, total, pages } = res.data;
        
        // 模拟数据（实际使用时删除此段）
        const mockRecords = records.length > 0 ? records : generateMockData(page);
        
        setAuctionList(prev => append ? [...prev, ...mockRecords] : mockRecords);
        setPagination(prev => ({
          ...prev,
          current: page,
          total,
          pages,
          hasMore: page < (pages || 1),
          loading: false,
        }));
      } else {
        // 使用模拟数据
        const mockRecords = generateMockData(page);
        setAuctionList(prev => append ? [...prev, ...mockRecords] : mockRecords);
        setPagination(prev => ({
          ...prev,
          current: page,
          hasMore: page < 3, // 模拟3页数据
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load auction list:', error);
      // 使用模拟数据
      const mockRecords = generateMockData(page);
      setAuctionList(prev => append ? [...prev, ...mockRecords] : mockRecords);
      setPagination(prev => ({
        ...prev,
        current: page,
        hasMore: page < 3,
        loading: false,
      }));
    }
  }, [searchQuery, filter, selectedTags, pagination.loading]);

  // 生成模拟数据
  const generateMockData = (page: number): AuctionItem[] => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const statusPool: BidStatus[] = ['WAITING', 'BIDDING', 'ENDED'];
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const bidStatus = statusPool[(startIndex + i) % statusPool.length];
      const endTime = new Date(Date.now() + 1000 * 60 * (30 + Math.floor(Math.random() * 90)));
      const startTime = new Date(Date.now() + 1000 * 60 * (5 + Math.floor(Math.random() * 120)));
      const bidStartTime = `${startTime.getFullYear()}-${String(startTime.getMonth() + 1).padStart(2, '0')}-${String(startTime.getDate()).padStart(2, '0')} ${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}:${String(startTime.getSeconds()).padStart(2, '0')}`;

      return {
        id: `${startIndex + i + 1}`,
        farmId: `farm-${(startIndex + i) % 5 + 1}`,
        farmName: ['牧原股份·山东五号场', '温氏集团·广东清远基地', '正邦科技·江西基地', '新希望·四川中心场', '天邦股份·江苏基地'][(startIndex + i) % 5],
        farmIcon: PIG_IMAGES[(startIndex + i) % 4],
        breed: ['挪系 A', '三元 A', '法系 A', '杜洛克', '长白'][i % 5],
        quantity: 150 + Math.floor(Math.random() * 100),
        weightRange: ['育肥猪 105-125kg', '大猪 125-140kg', '中猪 90-110kg'][i % 3],
        tags: [
          ['挪系A', '白猪'],
          ['三元A', '黑猪'],
          ['法系A', '白猪'],
          ['杜洛克', '黑猪'],
          ['长白', '白猪'],
        ][i % 5],
        startingPrice: 15 + Math.random() * 3,
        startingCount: 100 + Math.floor(Math.random() * 100),
        endTime: bidStatus === 'ENDED' ? new Date(Date.now() - 1000 * 60 * 10) : endTime,
        imageUrl: PIG_IMAGES[(startIndex + i) % 4],
        bidStatus,
        bidStartTime,
      };
    });
  };

  // 初始加载
  useEffect(() => {
    loadAuctionList(1, false);
  }, [filter, selectedTags]); // 依赖筛选条件变化

  // 获取地理位置并写入请求头
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setRequestHeaders({
          'X-Geo-Latitude': String(latitude),
          'X-Geo-Longitude': String(longitude),
          'X-Geo-Accuracy': String(Math.round(accuracy || 0)),
        });
      },
      (error) => {
        console.warn('获取地理位置失败:', error);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAuctionList(1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 滚动处理 - 触底加载
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // 距离底部50px时触发加载
    if (scrollHeight - scrollTop - clientHeight < 50 && pagination.hasMore && !pagination.loading) {
      loadAuctionList(pagination.current + 1, true);
    }
  }, [pagination, loadAuctionList]);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await loadAuctionList(1, false);
    setIsRefreshing(false);
  }, [isRefreshing, loadAuctionList]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current || scrollRef.current.scrollTop > 0 || isRefreshing) return;
    pullStartYRef.current = e.touches[0].clientY;
    setPullDistance(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pullStartYRef.current === null || isRefreshing) return;
    if (!scrollRef.current || scrollRef.current.scrollTop > 0) return;
    const delta = e.touches[0].clientY - pullStartYRef.current;
    if (delta > 0) {
      e.preventDefault();
      setPullDistance(Math.min(delta, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullStartYRef.current === null) return;
    if (pullDistance >= 50) {
      triggerRefresh();
    }
    pullStartYRef.current = null;
    setPullDistance(0);
  };

  // 打开筛选抽屉
  const openFilter = (tab: string) => {
    setActiveFilterTab(tab);
    setShowFilterDrawer(true);
  };

  // 渲染筛选抽屉内容
  const renderFilterContent = () => {
    switch (activeFilterTab) {
      case '场点':
        return (
          <div className="flex flex-col gap-2 pb-6">
            <button
              onClick={() => {
                setFilter(prev => ({ ...prev, farmId: undefined, farmName: undefined }));
                setShowFilterDrawer(false);
              }}
              className="w-full text-left py-3.5 px-4 rounded-custom bg-slate-50 text-slate-700 text-sm font-medium active:bg-slate-100 transition-colors"
            >
              全部场点
            </button>
            {farms.map(farm => (
              <button
                key={farm.id}
                onClick={() => {
                  setFilter(prev => ({ ...prev, farmId: farm.id, farmName: farm.name }));
                  setShowFilterDrawer(false);
                }}
                className={`w-full text-left py-3.5 px-4 rounded-custom text-sm font-medium transition-colors ${
                  filter.farmId === farm.id 
                    ? 'bg-industry-red/10 text-industry-red' 
                    : 'bg-slate-50 text-slate-700 active:bg-slate-100'
                }`}
              >
                {farm.name}
              </button>
            ))}
          </div>
        );

      case '产品标签':
        return (
          <div className="pb-6">
            <div className="flex flex-wrap gap-2">
              {productTags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTags(prev => 
                        isSelected ? prev.filter(t => t !== tag.id) : [...prev, tag.id]
                      );
                    }}
                    className={`px-3 py-2 rounded-custom text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-industry-red text-white'
                        : 'bg-slate-50 text-slate-700 active:bg-slate-100'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setShowFilterDrawer(false);
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-custom font-bold"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-3 bg-industry-red text-white rounded-custom font-bold"
              >
                确定
              </button>
            </div>
          </div>
        );

      case '体重段':
        const weightOptions = ['全部', '100kg以下', '100-110kg', '110-120kg', '120kg以上'];
        return (
          <div className="flex flex-col gap-2 pb-6">
            {weightOptions.map(item => (
              <button
                key={item}
                onClick={() => {
                  setFilter(prev => ({ 
                    ...prev, 
                    weightRange: item === '全部' ? undefined : item 
                  }));
                  setShowFilterDrawer(false);
                }}
                className={`w-full text-left py-3.5 px-4 rounded-custom text-sm font-medium transition-colors ${
                  (filter.weightRange === item || (item === '全部' && !filter.weightRange))
                    ? 'bg-industry-red/10 text-industry-red'
                    : 'bg-slate-50 text-slate-700 active:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        );

      case '距离':
        return (
          <div className="pb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-slate-500">距离范围 (100km - 900km)</span>
              <span className="text-industry-red font-black text-lg">{filter.distance}km</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setFilter(prev => ({ ...prev, distance: Math.max(100, prev.distance - 100) }))}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 font-bold active:bg-slate-200"
              >
                -
              </button>
              <input
                type="range"
                min="100"
                max="900"
                step="100"
                value={filter.distance}
                onChange={(e) => setFilter(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                className="flex-1 accent-industry-red h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => setFilter(prev => ({ ...prev, distance: Math.min(900, prev.distance + 100) }))}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 font-bold active:bg-slate-200"
              >
                +
              </button>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setFilter(prev => ({ ...prev, distance: 500 }));
                  setShowFilterDrawer(false);
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-custom font-bold"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-3 bg-industry-red text-white rounded-custom font-bold"
              >
                确定
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 获取筛选条件显示文本
  const getFilterLabel = (type: string): string => {
    switch (type) {
      case '场点':
        return filter.farmName || '场点';
      case '区域':
        return filter.regionName || '区域';
      case '体重段':
        return filter.weightRange || '体重段';
      case '产品标签':
        return selectedTags.length > 0 ? `标签(${selectedTags.length})` : '产品标签';
      case '距离':
        return `距离(${filter.distance}km)`;
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-industry-bg relative overflow-hidden">
      {/* Search Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b border-slate-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索场点、品种"
            className="w-full bg-slate-100 rounded-custom px-4 py-2 pl-10 text-sm focus:outline-none"
          />
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 mt-3 overflow-x-auto hide-scrollbar">
          {['场点', '区域', '体重段', '产品标签', '距离'].map(f => (
            <button
              key={f}
              onClick={() => {
                if (f === '区域') {
                  setShowRegionPicker(true);
                } else {
                  openFilter(f);
                }
              }}
              className="flex items-center gap-1 whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded-custom border border-slate-100 text-[11px] text-slate-600 active:bg-slate-100"
            >
              {getFilterLabel(f)}
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Drawer Overlay */}
      {showFilterDrawer && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-end animate-in fade-in duration-200" onClick={() => setShowFilterDrawer(false)}>
          <div className="bg-white w-full rounded-t-xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">选择{activeFilterTab}</h3>
              <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {renderFilterContent()}
          </div>
        </div>,
        document.body
      )}

      {/* Region Picker */}
      {showRegionPicker && typeof document !== 'undefined' && createPortal(
        <RegionPicker
          visible={showRegionPicker}
          onClose={() => setShowRegionPicker(false)}
          onConfirm={(code, name) => {
            setFilter(prev => ({ ...prev, regionCode: code, regionName: name }));
          }}
        />,
        document.body
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center text-xs text-slate-400"
            style={{ height: isRefreshing ? 40 : pullDistance }}
          >
            {isRefreshing ? '正在刷新...' : pullDistance >= 50 ? '松开刷新' : '下拉刷新'}
          </div>
        )}

        {/* Auction List */}
        <div className="px-4 py-4 pb-28 flex flex-col gap-4">
          {auctionList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-custom overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
              onClick={() => onNavigate('auction-detail', item)}
            >
              {/* Countdown Bar */}
              <div className={`${item.bidStatus === 'ENDED' ? 'bg-slate-400' : 'bg-industry-red'} px-3 py-2 flex justify-between items-center`}>
                {item.bidStatus === 'BIDDING' ? (
                  <>
                    <span className="text-white text-xs font-medium">距竞价结束</span>
                    <Countdown endTime={item.endTime} bidStatus={item.bidStatus} />
                  </>
                ) : (
                  <>
                    <span className="text-white text-xs font-medium">
                      {item.bidStatus === 'WAITING' ? '等待竞价' : '竞价结束'}
                    </span>
                    {item.bidStatus === 'WAITING' ? (
                      <div className="flex items-center gap-2 text-white text-[10px]">
                        <span>开始时间</span>
                        <span className="font-mono bg-white/20 px-1 rounded-sm max-w-[140px] truncate">{item.bidStartTime || '-'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
                        <span className="text-white text-[10px]">:</span>
                        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
                        <span className="text-white text-[10px]">:</span>
                        <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Farm Info Bar */}
              <div className="px-3 py-3 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <img src={item.farmIcon} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-sm" />
                  <span className="text-xs font-bold text-slate-800">{item.farmName}</span>
                </div>
              </div>

              {/* Pig Info Bar */}
              <div className="p-3 flex gap-4 relative items-center">
                <div className="relative w-28 h-28 flex-shrink-0 group">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-custom border border-slate-100 shadow-inner" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-custom">
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                      <svg className="w-4 h-4 text-industry-red translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                      </svg>
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
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-industry-gray text-[10px] mb-1">
                      起拍头数：<span className="text-slate-700 font-bold">{item.startingCount}</span>
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-industry-red text-xl font-black">¥{item.startingPrice.toFixed(2)}</span>
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
          ))}

          {/* Loading */}
          {pagination.loading && (
            <div className="py-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* End of List */}
          {!pagination.hasMore && auctionList.length > 0 && (
            <div className="py-6 flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">已到底部</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}

          {/* Empty State */}
          {auctionList.length === 0 && !pagination.loading && (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">暂无匹配竞价信息，请尝试调整过滤条件</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => onNavigate('free-quote')}
        className="fixed bottom-24 right-6 w-15 h-15 bg-industry-red rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-40 border-[5px] border-white ring-1 ring-slate-100"
      >
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[9px] font-black uppercase">报价</span>
        </div>
      </button>
    </div>
  );
};

export default HomeView;
