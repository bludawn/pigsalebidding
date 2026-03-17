
import React from 'react';

interface MessageViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-base font-bold">消息中心</h1>
      </div>

      <div className="flex flex-col">
        <MessageCategoryItem 
          title="商品猪消息中心" 
          description="报单关联的场次、体重范围信息已更新" 
          time="10:30" 
          unreadCount={3}
          icon="🐷"
          onClick={() => onNavigate('msg-list', { type: 'product', title: '商品猪消息中心' })}
        />
        <MessageCategoryItem 
          title="支付消息" 
          description="账户操作时间、支出类型、金额变动明细" 
          time="昨天" 
          unreadCount={1}
          icon="💰"
          onClick={() => onNavigate('msg-list', { type: 'payment', title: '支付消息' })}
        />
        <MessageCategoryItem 
          title="商城消息" 
          description="报单编号、匹配状态更新通知" 
          time="3天前" 
          unreadCount={0}
          icon="🛒"
          onClick={() => onNavigate('msg-list', { type: 'mall', title: '商城消息' })}
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
          {unreadCount}
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
