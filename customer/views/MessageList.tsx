import React, { useEffect, useMemo, useState } from 'react';
import { getNoticeList, readAllNotices, readNotice } from '../AppApi';
import { AuctionItem, NoticeItem } from '../types';

interface MessageListProps {
  params: { bizType: 'BID' | 'ORDER'; title: string };
  onBack: () => void;
  onNavigate: (route: string, params?: any) => void;
}

const MessageList: React.FC<MessageListProps> = ({ params, onBack, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<NoticeItem[]>([]);

  const unreadCount = useMemo(() => records.filter(item => (item.readStatus || 0) === 0).length, [records]);

  const load = async () => {
    setLoading(true);
    const res = await getNoticeList({
      current: 1,
      size: 100,
      searchCount: true,
      bizType: params.bizType,
    });
    if (res.errcode === 0 && res.data) {
      setRecords(res.data.records || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [params.bizType]);

  const handleReadAll = async () => {
    await readAllNotices({ bizType: params.bizType });
    setRecords(prev => prev.map(item => ({ ...item, readStatus: 1 })));
  };

  const buildAuctionParams = (notice: NoticeItem): AuctionItem => {
    const fallbackTitle = notice.title || '竞拍详情';
    return {
      id: notice.targetId || '',
      farmId: '',
      farmName: '',
      farmIcon: '',
      breed: fallbackTitle,
      quantity: 0,
      weightRange: '',
      tags: [],
      startingPrice: 0,
      startingCount: 0,
      endTime: new Date(),
      imageUrl: '',
      bidStatus: 'ENDED',
      bidStartTime: '',
      customerBidStatus: 'NO_BID',
    };
  };

  const jumpByNotice = (notice: NoticeItem) => {
    if (notice.targetRoute === 'order-detail' && notice.targetId) {
      onNavigate('order-detail', { orderId: notice.targetId });
      return;
    }
    if (notice.targetRoute === 'auction-detail' && notice.targetId) {
      onNavigate('auction-detail', buildAuctionParams(notice));
      return;
    }
    window.alert('目标内容不存在或已下线');
  };

  const handleOpen = async (notice: NoticeItem) => {
    if ((notice.readStatus || 0) === 0) {
      await readNotice({ noticeId: notice.noticeId });
      setRecords(prev => prev.map(item => item.noticeId === notice.noticeId ? { ...item, readStatus: 1 } : item));
    }
    jumpByNotice(notice);
  };

  const eventLabel = (eventType?: string) => {
    if (eventType === 'BID_SUCCESS') return '竞拍成功';
    if (eventType === 'BID_FAILED') return '竞拍失败';
    if (eventType === 'ORDER_CREATED') return '订单生成';
    if (eventType === 'ORDER_SHIPPED') return '订单发货';
    if (eventType === 'ORDER_COMPLETED') return '订单完成';
    return '通知';
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">{params.title}</h1>
        <button onClick={handleReadAll} className="absolute right-4 text-xs text-industry-red" disabled={unreadCount === 0}>
          全部已读
        </button>
      </div>

      {loading && <div className="p-6 text-center text-slate-400 text-sm">加载中...</div>}

      {!loading && records.length === 0 && (
        <div className="p-10 text-center text-slate-400 text-sm">暂无通知</div>
      )}

      {!loading && records.length > 0 && (
        <div className="p-4 space-y-3">
          {records.map(item => (
            <button
              key={item.noticeId}
              onClick={() => handleOpen(item)}
              className="w-full text-left bg-white rounded-custom border border-slate-100 p-4 shadow-sm active:bg-slate-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{eventLabel(item.eventType)}</span>
                  {(item.readStatus || 0) === 0 && <span className="w-1.5 h-1.5 rounded-full bg-industry-red" />}
                </div>
                <span className="text-[10px] text-slate-400">{item.createTime || '-'}</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-1">{item.title}</div>
              <div className="text-xs text-slate-500 leading-5">{item.content}</div>
              <div className="mt-3 text-xs text-industry-red font-bold">点击查看详情</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
