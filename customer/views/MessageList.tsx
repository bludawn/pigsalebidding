
import React from 'react';

interface MessageListProps {
  params: { type: string; title: string };
  onBack: () => void;
  onNavigate: (route: string, params?: any) => void;
}

const MessageList: React.FC<MessageListProps> = ({ params, onBack, onNavigate }) => {
  const renderList = () => {
    switch(params.type) {
      case 'product':
        return (
          <div className="p-4 space-y-4">
            <MessageCard 
              type="竞价失败"
              time="昨天 15:44"
              content={{
                场次: '温氏现代养殖场 02',
                体重: '105-125kg',
                品种: '三元 A',
                竞价数量: '200头',
                单价: '¥16.50/kg',
                提示: '很遗憾，您的报价未能中标。建议关注同场次其他货源。'
              }}
            />
            <MessageCard 
              type="商品猪评价提醒"
              time="2024-05-12"
              content={{
                订单状态: '已签收',
                评价奖励: '评价立得10积分',
                奖励说明: '积分可用于竞价保证金抵扣'
              }}
              hasAction
              onAction={() => alert('跳转成功！已到订单详情')}
            />
          </div>
        );
      case 'payment':
        return (
          <div className="p-4 space-y-4">
            <MessageCard 
              type="账户余额动账通知"
              time="3天前 09:20"
              hasRedDot
              content={{
                动账时间: '2024-05-10 09:15',
                交易类型: '商品猪支出',
                交易金额: '-¥345,200.00',
                提示: '点击查看交易详情'
              }}
              hasAction
              onAction={() => onNavigate('payment-detail')}
            />
          </div>
        );
      case 'mall':
        return (
          <div className="p-4 space-y-4">
             <MessageCard 
              type="报单状态变更通知"
              time="2024-05-08"
              hasRedDot
              content={{
                报单类型: '商品猪',
                报单编号: 'BD202405080012',
                状态变更: '匹配成功',
                提示: '点击查看匹配详情'
              }}
              hasAction
              onAction={() => onNavigate('match-detail')}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">{params.title}</h1>
      </div>
      {renderList()}
    </div>
  );
};

const MessageCard: React.FC<{ type: string, time: string, content: any, hasAction?: boolean, onAction?: () => void, hasRedDot?: boolean }> = ({ type, time, content, hasAction, onAction, hasRedDot }) => (
  <div className="bg-white rounded-custom border border-slate-100 overflow-hidden shadow-sm">
    <div className="px-4 py-3 flex justify-between items-center border-b border-slate-50">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-slate-800">{type}</span>
        {hasRedDot && <div className="w-1.5 h-1.5 bg-industry-red rounded-full"></div>}
      </div>
      <span className="text-[10px] text-slate-400">{time}</span>
    </div>
    <div className="p-4 space-y-2">
      {Object.entries(content).map(([key, value]: [string, any]) => (
        <div key={key} className="flex justify-between items-start">
          <span className="text-[11px] text-slate-400 min-w-[60px]">{key}</span>
          <span className={`text-[11px] font-medium text-right flex-1 ${key.includes('金额') ? 'text-industry-red font-bold' : 'text-slate-700'}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
    {hasAction && (
      <button 
        onClick={onAction}
        className="w-full py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-industry-red font-bold active:bg-slate-100 transition-colors"
      >
        查看详情
      </button>
    )}
  </div>
);

export default MessageList;
