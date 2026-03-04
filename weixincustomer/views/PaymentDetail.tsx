
import React from 'react';

interface PaymentDetailProps {
  onBack: () => void;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack}>
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">账户余额</h1>
        <button className="text-xs text-industry-red font-bold">对账单</button>
      </div>

      <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-green-100">
        <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        <span className="text-[10px] text-green-700">不展示三方店铺余额及使用明细</span>
      </div>

      <div className="bg-[#10B981] p-6 text-white m-4 rounded-custom shadow-lg shadow-emerald-200">
        <span className="text-[11px] opacity-80 mb-1 block">账户总额</span>
        <div className="text-3xl font-bold tracking-tight">¥ 1,280,450.00</div>
      </div>

      <div className="bg-white m-4 rounded-custom border border-slate-100 divide-y divide-slate-50">
        <div className="p-4 flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500">余额</span>
          <span className="text-sm font-bold text-slate-800">¥ 1,280,450.00</span>
        </div>
        <div className="p-4 flex justify-between items-center bg-slate-50/50">
          <span className="text-[11px] text-slate-400 pl-4">可用余额</span>
          <span className="text-xs font-bold text-slate-800">¥ 880,450.00</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500">冻结金额</span>
          <span className="text-sm font-bold text-industry-red">¥ 400,000.00</span>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">交易记录</h2>
          <button className="text-xs text-slate-400">全部 &gt;</button>
        </div>
        <div className="space-y-3">
          <TransactionItem type="商品猪支出" time="2024-05-10 09:15" amount="-345,200.00" icon="🛒" />
          <TransactionItem type="保证金冻结" time="2024-05-09 14:20" amount="-50,000.00" icon="🔒" />
          <TransactionItem type="退款入账" time="2024-05-08 11:30" amount="+20,000.00" icon="💰" isPositive />
        </div>
      </div>
    </div>
  );
};

const TransactionItem: React.FC<{ type: string, time: string, amount: string, icon: string, isPositive?: boolean }> = ({ type, time, amount, icon, isPositive }) => (
  <div className="bg-white p-4 rounded-custom flex items-center gap-4 border border-slate-50">
    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-1 flex flex-col items-start">
      <span className="text-xs font-bold text-slate-800">{type}</span>
      <span className="text-[10px] text-slate-400 mt-1">{time}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-slate-800'}`}>{amount}</span>
      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
    </div>
  </div>
);

export default PaymentDetail;
