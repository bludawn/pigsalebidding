import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AssetSummary, BusinessStats, ContactInfo, OrderCounts, UserProfile } from '../types';
import {
  getAssetSummary,
  getBusinessStats,
  getContactInfo,
  getOrderCounts,
  getProfileInfo,
} from '../AppApi';

interface ProfileViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orderCounts, setOrderCounts] = useState<OrderCounts | null>(null);
  const [assetSummary, setAssetSummary] = useState<AssetSummary | null>(null);
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [profileRes, orderRes, assetRes, statsRes] = await Promise.all([
          getProfileInfo(),
          getOrderCounts(),
          getAssetSummary(),
          getBusinessStats(),
        ]);

        if (profileRes.errcode === 0 && profileRes.data) {
          setProfile(profileRes.data);
        }

        if (orderRes.errcode === 0 && orderRes.data) {
          setOrderCounts(orderRes.data);
        }

        if (assetRes.errcode === 0 && assetRes.data) {
          setAssetSummary(assetRes.data);
        }

        if (statsRes.errcode === 0 && statsRes.data) {
          setBusinessStats(statsRes.data);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  const openContactDialog = async () => {
    setIsContactOpen(true);
    if (contactInfo) return;

    setIsContactLoading(true);
    try {
      const res = await getContactInfo();
      if (res.errcode === 0 && res.data) {
        setContactInfo(res.data);
      }
    } catch (error) {
      console.error('Failed to load contact info:', error);
    } finally {
      setIsContactLoading(false);
    }
  };

  const copyText = async (value: string, label: string) => {
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert(`${label}已复制`);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '--';
    return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderContactDialog = () => {
    if (!isContactOpen || typeof document === 'undefined') return null;

    return createPortal(
      <div className="fixed inset-0 bg-black/40 z-[100] flex items-end" onClick={() => setIsContactOpen(false)}>
        <div className="bg-white w-full rounded-t-xl p-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">联系我们</h3>
            <button onClick={() => setIsContactOpen(false)} className="text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isContactLoading ? (
            <div className="py-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-custom p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">联系电话</span>
                  <button
                    onClick={() => copyText(contactInfo?.phone || '', '电话')}
                    className="text-xs text-industry-red font-bold"
                  >
                    复制
                  </button>
                </div>
                <div className="text-slate-800 font-bold mt-1">{contactInfo?.phone || '--'}</div>
              </div>

              <div className="bg-slate-50 rounded-custom p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">联系地址</span>
                  <button
                    onClick={() => copyText(contactInfo?.address || '', '地址')}
                    className="text-xs text-industry-red font-bold"
                  >
                    复制
                  </button>
                </div>
                <div className="text-slate-800 font-bold mt-1">{contactInfo?.address || '--'}</div>
              </div>

              <div className="bg-slate-50 rounded-custom p-4 flex flex-col items-center">
                {contactInfo?.wechatQrCodeUrl ? (
                  <img src={contactInfo.wechatQrCodeUrl} alt="二维码" className="w-36 h-36 object-contain rounded-lg" />
                ) : (
                  <div className="w-36 h-36 bg-white rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                    暂无二维码
                  </div>
                )}
                <div className="text-[11px] text-slate-400 mt-2">长按识别二维码</div>
              </div>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-4 z-10">
          <button onClick={() => onNavigate('settings')} className="text-slate-800 p-1 active:bg-slate-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={profile?.avatar || 'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?w=150&h=150&fit=crop'} alt="" className="w-18 h-18 rounded-full border-4 border-industry-red/5 object-cover shadow-sm" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-slate-50">
              <svg className="w-3.5 h-3.5 text-industry-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1.5 1.5 0 00-1.414-1.414L9 10.586 7.707 9.293a1.5 1.5 0 00-1.414 1.414l2 2a1.5 1.5 0 002.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-800">{profile?.name || '未设置'}</h2>
              {profile?.depositTag && (
                <span className="bg-industry-red/10 text-industry-red text-[10px] px-2 py-0.5 rounded-custom font-black border border-industry-red/20 uppercase tracking-tighter">
                  {profile.depositTag}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-2">{profile?.companyName || '暂无企业信息'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white m-4 rounded-custom p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[15px] font-black text-slate-800">我的订单</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <OrderItem label="待付款" count={orderCounts?.paymentCount} onClick={() => onNavigate('order-list', { status: 'ORDER_PAYMENT' })} />
          <OrderItem label="待发货" count={orderCounts?.shipmentCount} onClick={() => onNavigate('order-list', { status: 'ORDER_SHIPMENT' })} />
          <OrderItem label="待收货" count={orderCounts?.receiptCount} onClick={() => onNavigate('order-list', { status: 'ORDER_RECEIPT' })} />
          <OrderItem label="已完成" count={orderCounts?.completedCount} onClick={() => onNavigate('order-list', { status: 'ORDER_COMPLETED' })} />
          <OrderItem label="已取消" count={orderCounts?.cancelledCount} onClick={() => onNavigate('order-list', { status: 'ORDER_CANCELLED' })} />
          <OrderItem label="全部订单" count={orderCounts?.allCount} onClick={() => onNavigate('order-list', { status: 'ALL' })} />
          <OrderItem label="我的竞拍" count={orderCounts?.myBidCount} onClick={() => onNavigate('my-bids')} />
        </div>
      </div>

      <div className="bg-white mx-4 mt-2 rounded-custom p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[14px] font-black text-slate-800">总资产</h3>
          <span className="text-industry-red text-[17px] font-black tracking-tighter">¥ {formatCurrency(assetSummary?.totalBalance || 0)}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <AssetItem label="保证金" value={formatCurrency(assetSummary?.depositAmount)} />
          <AssetItem label="货款" value={formatCurrency(assetSummary?.goodsAmount)} />
          <AssetItem label="全部余额" value={formatCurrency(assetSummary?.totalBalance)} />
        </div>
      </div>

      <div className="bg-white mx-4 mt-4 rounded-custom p-5 shadow-sm border border-slate-100">
        <h3 className="text-[14px] font-black text-slate-800 mb-5">数据统计</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatItem label="交易总金额" value={`¥ ${formatCurrency(businessStats?.totalTradeAmount)}`} />
          <StatItem label="购买总头数" value={`${businessStats?.totalPurchaseCount ?? '--'} 头`} />
        </div>
      </div>

      <div className="bg-white mx-4 mt-4 rounded-custom p-5 shadow-sm border border-slate-100 grid grid-cols-4 gap-y-8">
        <FuncBtn label="预付定金" icon="💳" onClick={() => alert('预付定金功能开发中')} />
        <FuncBtn label="发票管理" icon="🧾" onClick={() => alert('发票管理功能开发中')} />
        <FuncBtn label="收货地址" icon="📍" onClick={() => onNavigate('address-management')} />
        <FuncBtn label="合同协议" icon="🤝" onClick={() => alert('合同协议功能开发中')} />
        <FuncBtn label="联系我们" icon="📞" onClick={openContactDialog} />
      </div>

      {renderContactDialog()}
    </div>
  );
};

const OrderItem: React.FC<{ label: string; count?: number; onClick?: () => void }> = ({ label, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 relative active:scale-95 transition-transform group"
  >
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-active:text-industry-red">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <span className="text-[10px] text-slate-500 font-bold">{label}</span>
    {count !== undefined && count > 0 && (
      <span className="absolute -top-1 -right-1 bg-industry-red text-white text-[9px] min-w-[15px] h-3.5 rounded-full flex items-center justify-center border border-white font-black shadow-sm px-1">
        {count}
      </span>
    )}
  </button>
);

const AssetItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-custom border border-slate-100">
    <span className="text-[10px] text-slate-400 font-bold">{label}</span>
    <span className="text-[13px] font-black text-slate-800 tracking-tight">¥{value}</span>
  </div>
);

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-custom border border-slate-100">
    <span className="text-[10px] text-slate-400 font-bold">{label}</span>
    <span className="text-[13px] font-black text-slate-800 tracking-tight">{value}</span>
  </div>
);

const FuncBtn: React.FC<{ label: string; icon: string; onClick?: () => void }> = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 active:scale-90 transition-transform group">
    <div className="w-11 h-11 bg-slate-50 group-active:bg-industry-red/5 rounded-custom flex items-center justify-center text-xl shadow-sm border border-slate-100/30 group-hover:border-industry-red/20 transition-all">
      {icon}
    </div>
    <span className="text-[10px] text-slate-600 font-bold">{label}</span>
  </button>
);

export default ProfileView;
