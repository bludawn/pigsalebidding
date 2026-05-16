import React, { useEffect, useState } from 'react';
import { getNoticeUnreadCount } from '../AppApi';

interface MessageViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({ bidUnread: 0, orderUnread: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const res = await getNoticeUnreadCount();
      if (!cancelled && res.errcode === 0 && res.data) {
        setCounts({
          bidUnread: res.data.bidUnread || 0,
          orderUnread: res.data.orderUnread || 0,
        });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-base font-bold">消息中心</h1>
      </div>

      <div className="flex flex-col">
        <MessageCategoryItem
          title="竞拍通知"
          description="竞拍成功、竞拍失败等通知"
          time="最新"
          unreadCount={counts.bidUnread}
          icon="🏷️"
          onClick={() => onNavigate('msg-list', { bizType: 'BID', title: '竞拍通知' })}
        />
        <MessageCategoryItem
          title="订单通知"
          description="订单生成、发货、完成等通知"
          time="最新"
          unreadCount={counts.orderUnread}
          icon="📦"
          onClick={() => onNavigate('msg-list', { bizType: 'ORDER', title: '订单通知' })}
        />
      </div>
    </div>
  );
};

interface ItemProps {
  title: string;
  description: string;
  time: string;
  unreadCount: number;
  icon: string;
  onClick: () => void;
}

const MessageCategoryItem: React.FC<ItemProps> = ({ title, description, time, unreadCount, icon, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 px-4 py-4 bg-white border-b border-slate-50 active:bg-slate-50 transition-colors">
    <div className="w-12 h-12 bg-slate-100 rounded-custom flex items-center justify-center text-2xl relative">
      {icon}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-industry-red text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
    <div className="flex-1 flex flex-col items-start overflow-hidden">
      <div className="w-full flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-slate-800">{title}</span>
        <span className="text-[10px] text-slate-400">{time}</span>
      </div>
      <p className="text-[11px] text-slate-400 truncate w-full text-left">{description}</p>
    </div>
  </button>
);

export default MessageView;
