
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AuctionItem, BidStatus, FilterState, PaginationState } from '../types';
import { getAuctionList, setRequestHeaders } from '../AppApi';
import { useAppContext } from '../App';
import AuctionCard from '../components/AuctionCard';
import CountdownTimer from '../components/CountdownTimer';
import RegionPicker from './RegionPicker';

interface HomeViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const PAGE_SIZE = 20;
const WHEEL_ITEM_HEIGHT = 36;
const WHEEL_VISIBLE_COUNT = 5;
const WHEEL_CONTAINER_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_COUNT;
const WHEEL_PADDING = (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2;

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRegionLastName = (name?: string) => {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  const segments = trimmed.split(/[\s\/\-]+/).filter(Boolean);
  return segments[segments.length - 1] || trimmed;
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { farms, productTags } = useAppContext();

  // 筛选条件状态
  const [filter, setFilter] = useState<FilterState>({
    bidStatus: 'BIDDING',
    distance: 500,
  });
  const [datePicker, setDatePicker] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
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
  const yearWheelRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const dayWheelRef = useRef<HTMLDivElement>(null);
  const wheelRafRef = useRef<Record<'year' | 'month' | 'day', number | null>>({
    year: null,
    month: null,
    day: null,
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  }, []);
  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const dayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(datePicker.year, datePicker.month) }, (_, index) => index + 1),
    [datePicker.year, datePicker.month]
  );

  const getQueryDate = () => filter.date || formatDate(new Date());

  const applyClientFilters = (records: AuctionItem[]) => {
    let nextRecords = records;
    if (filter.bidStatus) {
      nextRecords = nextRecords.filter(item => item.bidStatus === filter.bidStatus);
    }
    const queryDate = getQueryDate();
    if (queryDate) {
      nextRecords = nextRecords.filter(item => {
        const itemDate = item.bidStartTime
          ? item.bidStartTime.slice(0, 10)
          : formatDate(item.endTime);
        return itemDate === queryDate;
      });
    }
    return nextRecords;
  };

  const getNearestIndex = (options: number[], value: number) => {
    const exactIndex = options.indexOf(value);
    if (exactIndex >= 0) return exactIndex;
    return options.reduce((closestIndex, option, index) =>
      Math.abs(option - value) < Math.abs(options[closestIndex] - value) ? index : closestIndex
    , 0);
  };

  const scrollWheelTo = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: index * WHEEL_ITEM_HEIGHT, behavior: 'auto' });
  };

  useEffect(() => () => {
    (['year', 'month', 'day'] as const).forEach(type => {
      const rafId = wheelRafRef.current[type];
      if (rafId) cancelAnimationFrame(rafId);
    });
  }, []);

  useEffect(() => {
    if (!showFilterDrawer || activeFilterTab !== '日期') return;
    const baseDate = filter.date ? new Date(filter.date) : new Date();
    const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
    setDatePicker({
      year: safeDate.getFullYear(),
      month: safeDate.getMonth() + 1,
      day: safeDate.getDate(),
    });
  }, [showFilterDrawer, activeFilterTab, filter.date]);

  useEffect(() => {
    const maxDay = dayOptions.length;
    if (datePicker.day > maxDay) {
      setDatePicker(prev => ({ ...prev, day: maxDay }));
    }
  }, [dayOptions.length, datePicker.day]);

  useEffect(() => {
    if (!showFilterDrawer || activeFilterTab !== '日期') return;
    const yearIndex = getNearestIndex(yearOptions, datePicker.year);
    const monthIndex = getNearestIndex(monthOptions, datePicker.month);
    const dayIndex = getNearestIndex(dayOptions, datePicker.day);
    requestAnimationFrame(() => {
      scrollWheelTo(yearWheelRef, yearIndex);
      scrollWheelTo(monthWheelRef, monthIndex);
      scrollWheelTo(dayWheelRef, dayIndex);
    });
  }, [showFilterDrawer, activeFilterTab, datePicker, yearOptions, monthOptions, dayOptions]);

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
        bidStatus: filter.bidStatus,
        farmId: filter.farmId,
        regionCode: filter.regionCode,
        weightRange: filter.weightRange,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        date: getQueryDate(),
        distance: filter.distance,
      });

      if (res.errcode === 0 && res.data) {
        const { records, total, pages } = res.data;
        const filteredRecords = applyClientFilters(records || []);

        setAuctionList(prev => append ? [...prev, ...filteredRecords] : filteredRecords);
        setPagination(prev => ({
          ...prev,
          current: page,
          total,
          pages,
          hasMore: page < (pages || 1),
          loading: false,
        }));
      } else {
        setAuctionList(prev => (append ? prev : []));
        setPagination(prev => ({
          ...prev,
          current: page,
          total: 0,
          pages: 0,
          hasMore: false,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load auction list:', error);
      setAuctionList(prev => (append ? prev : []));
      setPagination(prev => ({
        ...prev,
        current: page,
        total: 0,
        pages: 0,
        hasMore: false,
        loading: false,
      }));
    }
  }, [searchQuery, filter, selectedTags, pagination.loading]);

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
      case '竞价状态':
        return (
          <div className="flex flex-col gap-2 pb-6">
            {[
              { label: '竞价中', value: 'BIDDING' as BidStatus },
              { label: '等待竞价', value: 'WAITING' as BidStatus },
              { label: '竞价结束', value: 'ENDED' as BidStatus },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(prev => ({ ...prev, bidStatus: option.value }));
                  setShowFilterDrawer(false);
                }}
                className={`w-full text-left py-3.5 px-4 rounded-custom text-sm font-medium transition-colors ${
                  filter.bidStatus === option.value
                    ? 'bg-industry-red/10 text-industry-red'
                    : 'bg-slate-50 text-slate-700 active:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={() => {
                setFilter(prev => ({ ...prev, bidStatus: undefined }));
                setShowFilterDrawer(false);
              }}
              className="w-full text-left py-3.5 px-4 rounded-custom bg-slate-50 text-slate-700 text-sm font-medium active:bg-slate-100 transition-colors"
            >
              全部状态
            </button>
          </div>
        );

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

      case '日期':
        const handleWheelScroll = (
          type: 'year' | 'month' | 'day',
          options: number[],
          ref: React.RefObject<HTMLDivElement>
        ) => {
          const target = ref.current;
          if (!target) return;

          const rafId = wheelRafRef.current[type];
          if (rafId) cancelAnimationFrame(rafId);
          wheelRafRef.current[type] = requestAnimationFrame(() => {
            const index = Math.round(target.scrollTop / WHEEL_ITEM_HEIGHT);
            const safeIndex = Math.min(Math.max(index, 0), options.length - 1);
            const value = options[safeIndex];
            setDatePicker(prev => (prev[type] === value ? prev : { ...prev, [type]: value }));
          });
        };

        const handleWheelSnap = (
          options: number[],
          ref: React.RefObject<HTMLDivElement>
        ) => {
          const target = ref.current;
          if (!target) return;
          const index = Math.round(target.scrollTop / WHEEL_ITEM_HEIGHT);
          const safeIndex = Math.min(Math.max(index, 0), options.length - 1);
          scrollWheelTo(ref, safeIndex);
        };

        const handleWheelClick = (
          type: 'year' | 'month' | 'day',
          value: number,
          index: number,
          ref: React.RefObject<HTMLDivElement>
        ) => {
          setDatePicker(prev => ({ ...prev, [type]: value }));
          scrollWheelTo(ref, index);
        };

        const formattedDate = formatDate(new Date(datePicker.year, datePicker.month - 1, datePicker.day));

        return (
          <div className="pb-6">
            <div className="bg-slate-50 rounded-custom p-4">
              <div className="text-xs text-slate-400 mb-2">选择日期</div>
              <div className="text-sm font-bold text-slate-800">{formattedDate}</div>
              <div className="text-[11px] text-slate-400 mt-1">不选择默认查询今天</div>
              <div className="mt-4 relative">
                <div className="flex">
                  {[
                    { type: 'year' as const, options: yearOptions, ref: yearWheelRef, label: '年' },
                    { type: 'month' as const, options: monthOptions, ref: monthWheelRef, label: '月' },
                    { type: 'day' as const, options: dayOptions, ref: dayWheelRef, label: '日' },
                  ].map(column => (
                    <div key={column.label} className="flex-1 flex flex-col items-center">
                      <div className="text-[10px] text-slate-400 mb-2">{column.label}</div>
                      <div
                        ref={column.ref}
                        onScroll={() => handleWheelScroll(column.type, column.options, column.ref)}
                        onTouchEnd={() => handleWheelSnap(column.options, column.ref)}
                        onMouseUp={() => handleWheelSnap(column.options, column.ref)}
                        onMouseLeave={() => handleWheelSnap(column.options, column.ref)}
                        className="w-full overflow-y-auto overscroll-contain snap-y snap-mandatory hide-scrollbar"
                        style={{
                          height: WHEEL_CONTAINER_HEIGHT,
                          paddingTop: WHEEL_PADDING,
                          paddingBottom: WHEEL_PADDING,
                        }}
                      >
                        {column.options.map((value, index) => (
                          <button
                            key={`${column.label}-${value}`}
                            onClick={() => handleWheelClick(column.type, value, index, column.ref)}
                            className={`w-full flex items-center justify-center text-sm snap-center transition-colors ${
                              datePicker[column.type] === value ? 'text-industry-red font-bold' : 'text-slate-600'
                            }`}
                            style={{ height: WHEEL_ITEM_HEIGHT }}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setFilter(prev => ({ ...prev, date: undefined }));
                  setShowFilterDrawer(false);
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-custom font-bold"
              >
                清除日期
              </button>
              <button
                onClick={() => {
                  setFilter(prev => ({ ...prev, date: formattedDate }));
                  setShowFilterDrawer(false);
                }}
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
      case '竞价状态':
        if (filter.bidStatus === 'WAITING') return '等待竞价';
        if (filter.bidStatus === 'ENDED') return '竞价结束';
        if (filter.bidStatus === 'BIDDING') return '竞价中';
        return '竞价状态';
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
      case '日期':
        return filter.date || '日期';
      default:
        return type;
    }
  };

  const renderAuctionStatusBar = (item: AuctionItem) => {
    if (item.bidStatus === 'BIDDING') {
      return (
        <>
          <span className="text-white text-xs font-medium">竞价中</span>
          <CountdownTimer endTime={item.endTime} />
        </>
      );
    }

    if (item.bidStatus === 'WAITING') {
      return (
        <>
          <span className="text-white text-xs font-medium">等待竞价</span>
          <div className="flex items-center gap-2 text-white text-[10px]">
            <span>开始时间</span>
            <span className="font-mono bg-white/20 px-1 rounded-sm max-w-[140px] truncate">{item.bidStartTime || '-'}</span>
          </div>
        </>
      );
    }

    return (
      <>
        <span className="text-white text-xs font-medium">竞价结束</span>
        <div className="flex items-center gap-0.5 ml-1">
          <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
          <span className="text-white text-[10px]">:</span>
          <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
          <span className="text-white text-[10px]">:</span>
          <span className="bg-white/20 text-white text-[10px] px-1 rounded-sm">00</span>
        </div>
      </>
    );
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
          {['竞价状态', '区域', '场点', '体重段', '产品标签', '距离', '日期'].map(f => (
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
            setFilter(prev => ({ ...prev, regionCode: code, regionName: getRegionLastName(name) }));
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
            <AuctionCard
              key={item.id}
              onClick={() => onNavigate('auction-detail', item)}
              topBar={renderAuctionStatusBar(item)}
              topBarClassName={item.bidStatus === 'ENDED' ? 'bg-slate-400' : 'bg-industry-red'}
              farmIcon={item.farmIcon}
              farmName={item.farmName}
              imageUrl={item.imageUrl}
              breed={item.breed}
              quantity={item.quantity}
              weightRange={item.weightRange}
              tags={item.tags}
              startingCount={item.startingCount}
              startingPrice={item.startingPrice}
            />
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
