import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MyBidItem, MyBidStatus, MyBidStatusCounts, PaginationState } from '../types';
import { getMyBidList, getMyBidStatusCounts } from '../AppApi';
import AuctionCard from '../components/AuctionCard';
import CountdownTimer from '../components/CountdownTimer';

interface MyBidsViewProps {
  onBack: () => void;
  onNavigate: (route: string, params?: any) => void;
}

const PAGE_SIZE = 20;

const TAB_ITEMS: { label: string; status: MyBidStatus }[] = [
  { label: '竞拍中', status: 'BIDDING' },
  { label: '竞拍成功', status: 'BID_SUCCESS' },
  { label: '竞拍失败', status: 'BID_FAILED' },
];

const MyBidsView: React.FC<MyBidsViewProps> = ({ onBack, onNavigate }) => {
  const [activeStatus, setActiveStatus] = useState<MyBidStatus>('BIDDING');
  const [bidList, setBidList] = useState<MyBidItem[]>([]);
  const [statusCounts, setStatusCounts] = useState<MyBidStatusCounts | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    size: PAGE_SIZE,
    total: 0,
    pages: 0,
    hasMore: true,
    loading: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMyBids = useCallback(async (page: number, append: boolean = false) => {
    if (pagination.loading) return;
    setPagination(prev => ({ ...prev, loading: true }));

    try {
      const res = await getMyBidList({
        current: page,
        size: PAGE_SIZE,
        searchCount: true,
        status: activeStatus,
      });

      if (res.errcode === 0 && res.data) {
        const { records, total, pages } = res.data;
        const list = records || [];

        setBidList(prev => (append ? [...prev, ...list] : list));
        setPagination(prev => ({
          ...prev,
          current: page,
          total,
          pages,
          hasMore: page < (pages || 1),
          loading: false,
        }));
      } else {
        setBidList(prev => (append ? prev : []));
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
      console.error('Failed to load my bids:', error);
      setBidList(prev => (append ? prev : []));
      setPagination(prev => ({
        ...prev,
        current: page,
        total: 0,
        pages: 0,
        hasMore: false,
        loading: false,
      }));
    }
  }, [activeStatus, pagination.loading]);

  useEffect(() => {
    const loadCounts = async () => {
      const res = await getMyBidStatusCounts();
      if (res.errcode === 0 && res.data) {
        setStatusCounts(res.data);
      }
    };

    loadCounts();
  }, []);

  useEffect(() => {
    setBidList([]);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: 0,
      pages: 0,
      hasMore: true,
    }));
    scrollRef.current?.scrollTo({ top: 0 });
    loadMyBids(1, false);
  }, [activeStatus]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollHeight - scrollTop - clientHeight < 50 && pagination.hasMore && !pagination.loading) {
      loadMyBids(pagination.current + 1, true);
    }
  }, [pagination, loadMyBids]);

  const renderStatusBar = useCallback((item: MyBidItem) => {
    if (item.bidStatus === 'BIDDING') {
      return (
        <>
          <span className="text-white text-xs font-medium">竞拍中</span>
          <CountdownTimer endTime={item.endTime} />
        </>
      );
    }

    const label = item.bidStatus === 'BID_SUCCESS' ? '竞拍成功' : '竞拍失败';

    return (
      <>
        <span className="text-white text-xs font-medium">{label}</span>
        <span className="text-white text-[10px]">已结束</span>
      </>
    );
  }, []);

  const statusBarClassName = useMemo(() => {
    switch (activeStatus) {
      case 'BID_SUCCESS':
        return 'bg-emerald-500';
      case 'BID_FAILED':
        return 'bg-slate-400';
      default:
        return 'bg-industry-red';
    }
  }, [activeStatus]);

  return (
    <div className="bg-slate-50 h-full flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">我的竞拍</h1>
      </div>

      <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-100">
        <div className="flex gap-2">
          {TAB_ITEMS.map(tab => {
            const isActive = tab.status === activeStatus;
            const countLabel = tab.status === 'BIDDING'
              ? statusCounts?.biddingCount
              : tab.status === 'BID_SUCCESS'
                ? statusCounts?.successCount
                : statusCounts?.failedCount;
            return (
              <button
                key={tab.status}
                onClick={() => {
                  if (tab.status !== activeStatus) {
                    setActiveStatus(tab.status);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-custom transition-colors ${
                  isActive ? 'bg-industry-red text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.label}{typeof countLabel === 'number' ? `(${countLabel})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="px-4 py-4 pb-20 flex flex-col gap-4">
          {bidList.map(item => (
            <AuctionCard
              key={item.id}
              onClick={() => onNavigate('auction-detail', { ...item, id: item.auctionId })}
              topBar={renderStatusBar(item)}
              topBarClassName={statusBarClassName}
              farmIcon={item.farmIcon}
              farmName={item.farmName}
              imageUrl={item.imageUrl}
              breed={item.breed}
              quantity={item.quantity}
              weightRange={item.weightRange}
              tags={item.tags}
              startingCount={item.startingCount}
              startingPrice={item.startingPrice}
              bidStartTime={item.bidStartTime}
            />
          ))}

          {pagination.loading && (
            <div className="py-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!pagination.hasMore && bidList.length > 0 && (
            <div className="py-6 flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">已到底部</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}

          {bidList.length === 0 && !pagination.loading && (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">暂无竞拍记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBidsView;
