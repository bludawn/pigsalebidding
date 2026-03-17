import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderListItem, OrderListStatus, PaginationState } from '../types';
import { getOrderList } from '../AppApi';

interface OrderListViewProps {
  params: { status: OrderListStatus };
  onBack: () => void;
  onNavigate: (route: string, params?: any) => void;
}

const PAGE_SIZE = 20;

const statusMetaMap: Record<OrderListStatus, { label: string; badgeClass: string; desc: string }> = {
  ORDER_PAYMENT: { label: '待付款', badgeClass: 'bg-industry-red/10 text-industry-red', desc: '请尽快完成支付' },
  ORDER_SHIPMENT: { label: '待发货', badgeClass: 'bg-amber-100 text-amber-700', desc: '场点正在安排发货' },
  ORDER_RECEIPT: { label: '待收货', badgeClass: 'bg-blue-100 text-blue-700', desc: '运输途中，请注意查收' },
  ORDER_COMPLETED: { label: '已完成', badgeClass: 'bg-emerald-100 text-emerald-700', desc: '订单已完成' },
  ORDER_CANCELLED: { label: '已取消', badgeClass: 'bg-slate-200 text-slate-600', desc: '订单已取消' },
  ALL: { label: '全部订单', badgeClass: 'bg-slate-100 text-slate-600', desc: '查看全部订单' },
};

const OrderListView: React.FC<OrderListViewProps> = ({ params, onBack, onNavigate }) => {
  const [orderList, setOrderList] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    size: PAGE_SIZE,
    total: 0,
    pages: 0,
    hasMore: true,
    loading: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadOrders = useCallback(async (page: number, append: boolean) => {
    if (pagination.loading) return;
    setPagination(prev => ({ ...prev, loading: true }));

    try {
      const res = await getOrderList({
        current: page,
        size: PAGE_SIZE,
        searchCount: true,
        status: params.status,
      });

      if (res.errcode === 0 && res.data) {
        const { records, total, pages } = res.data;
        setOrderList(prev => (append ? [...prev, ...records] : records));
        setPagination(prev => ({
          ...prev,
          current: page,
          total,
          pages,
          hasMore: page < (pages || 1),
          loading: false,
        }));
        return;
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }

    setPagination(prev => ({ ...prev, loading: false }));
  }, [pagination.loading, params.status]);

  useEffect(() => {
    setOrderList([]);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: 0,
      pages: 0,
      hasMore: true,
    }));
    scrollRef.current?.scrollTo({ top: 0 });
    loadOrders(1, false);
  }, [params.status]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50 && pagination.hasMore && !pagination.loading) {
      loadOrders(pagination.current + 1, true);
    }
  }, [pagination, loadOrders]);

  const headerMeta = useMemo(() => statusMetaMap[params.status], [params.status]);

  return (
    <div className="bg-slate-50 h-full flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-sm font-bold">{headerMeta.label}</h1>
          <p className="text-[10px] text-slate-400 mt-0.5">{headerMeta.desc}</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="px-4 py-4 pb-20 flex flex-col gap-4">
          {orderList.map(item => {
            const meta = statusMetaMap[item.status];
            return (
              <button
                key={item.orderId}
                onClick={() => onNavigate('order-detail', { orderId: item.orderId })}
                className="bg-white rounded-custom border border-slate-100 shadow-sm p-4 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${meta.badgeClass}`}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm font-bold text-slate-800">
                    场点：{item.farmName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.pigTypeName} · {item.weightRange}
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>数量：<span className="font-bold text-slate-800">{item.quantity}头</span></span>
                    <span>单价：<span className="font-bold text-slate-800">¥{item.price.toFixed(2)}</span>/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">订单号：{item.orderId}</span>
                    <span className="text-sm font-black text-industry-red">¥{item.totalAmount.toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </button>
            );
          })}

          {pagination.loading && (
            <div className="py-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!pagination.hasMore && orderList.length > 0 && (
            <div className="py-6 flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">已到底部</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}

          {orderList.length === 0 && !pagination.loading && (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">暂无{headerMeta.label}订单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListView;
