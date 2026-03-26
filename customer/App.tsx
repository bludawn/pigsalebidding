
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { TabType, FarmItem, ProductTagItem, AuctionItem, OrderListStatus } from './types';
import HomeView from './views/HomeView';
import MessageView from './views/MessageView';
import ProfileView from './views/ProfileView';
import AuctionDetail from './views/AuctionDetail';
import AuctionMaintenanceView from './views/AuctionMaintenanceView';
import FreeQuote from './views/FreeQuote';
import MessageList from './views/MessageList';
import PaymentDetail from './views/PaymentDetail';
import MatchDetail from './views/MatchDetail';
import MyBidsView from './views/MyBidsView';
import AddressManagementView from './views/AddressManagementView';
import OrderListView from './views/OrderListView';
import OrderDetailView from './views/OrderDetailView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';
import { clearAuthToken, getAuthToken, getFarmList, getProductTags } from './AppApi';

/** 全局数据上下文 */
interface AppContextType {
  farms: FarmItem[];
  productTags: ProductTagItem[];
  loading: boolean;
}

const AppContext = createContext<AppContextType>({
  farms: [],
  productTags: [],
  loading: true,
});

export const useAppContext = () => useContext(AppContext);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentRoute, setCurrentRoute] = useState<string>('tabs');
  const [isAuthed, setIsAuthed] = useState<boolean>(() => Boolean(getAuthToken()));
  const [routeParams, setRouteParams] = useState<any>(null);
  const [auctionDetailParams, setAuctionDetailParams] = useState<AuctionItem | null>(null);
  const [auctionDetailBackRoute, setAuctionDetailBackRoute] = useState<string>('tabs');
  const [auctionDetailRefreshKey, setAuctionDetailRefreshKey] = useState(0);
  const [auctionMaintenanceParams, setAuctionMaintenanceParams] = useState<{ auctionId: string } | null>(null);
  const [auctionMaintenanceKey, setAuctionMaintenanceKey] = useState(0);
  const [addressBackRoute, setAddressBackRoute] = useState<string>('tabs');
  const [orderListParams, setOrderListParams] = useState<{ status: OrderListStatus } | null>(null);
  const [orderDetailParams, setOrderDetailParams] = useState<{ orderId: string } | null>(null);
  const [orderDetailBackRoute, setOrderDetailBackRoute] = useState<string>('order-list');
  const scrollPositionsRef = useRef<Record<string, number>>({});
  
  // 全局数据
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [productTags, setProductTags] = useState<ProductTagItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 登录后获取基础数据
  useEffect(() => {
    if (!isAuthed) {
      setFarms([]);
      setProductTags([]);
      setLoading(false);
      return;
    }

    const fetchBaseData = async () => {
      setLoading(true);
      try {
        const [farmRes, tagRes] = await Promise.all([
          getFarmList(),
          getProductTags(),
        ]);
        
        if (farmRes.errcode === 0 && farmRes.data) {
          setFarms(farmRes.data);
        }
        
        if (tagRes.errcode === 0 && tagRes.data) {
          setProductTags(tagRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch base data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBaseData();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) {
      setCurrentRoute('login');
      return;
    }
    if (currentRoute === 'login') {
      setCurrentRoute('tabs');
    }
  }, [isAuthed, currentRoute]);

  const navigate = (route: string, params: any = null) => {
    if (currentRoute === 'tabs') {
      scrollPositionsRef.current[`tabs-${activeTab}`] = window.scrollY;
    }

    if (route === 'auction-detail' && params) {
      setAuctionDetailParams(params as AuctionItem);
      setAuctionDetailBackRoute(currentRoute);
      setAuctionDetailRefreshKey(prev => prev + 1);
    }

    if (route === 'order-list' && params) {
      setOrderListParams(params as { status: OrderListStatus });
    }

    if (route === 'order-detail' && params) {
      setOrderDetailParams(params as { orderId: string });
      setOrderDetailBackRoute(currentRoute);
    }

    if (route === 'auction-maintenance' && params) {
      setAuctionMaintenanceParams(params as { auctionId: string });
      setAuctionMaintenanceKey(prev => prev + 1);
    }

    if (route === 'address-management') {
      setAddressBackRoute(currentRoute);
    }

    setCurrentRoute(route);
    setRouteParams(params);
  };

  const handleLogout = React.useCallback(() => {
    clearAuthToken();
    setIsAuthed(false);
    setActiveTab('home');
    setCurrentRoute('login');
    setRouteParams(null);
    setAuctionDetailParams(null);
    setAuctionMaintenanceParams(null);
    setOrderListParams(null);
    setOrderDetailParams(null);
  }, []);

  useEffect(() => {
    if (currentRoute === 'tabs') {
      const savedScrollTop = scrollPositionsRef.current[`tabs-${activeTab}`];
      if (typeof savedScrollTop === 'number') {
        window.scrollTo(0, savedScrollTop);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentRoute, activeTab]);

  useEffect(() => {
    const handleAuthExpired = () => {
      handleLogout();
    };
    window.addEventListener('customer-auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('customer-auth-expired', handleAuthExpired);
    };
  }, [handleLogout]);

  const renderTabContent = () => {
    if (!isAuthed) return null;

    return (
      <div className={`flex-1 ${currentRoute === 'tabs' ? '' : 'hidden'}`}>
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <HomeView onNavigate={navigate} />
        </div>
        <div className={activeTab === 'message' ? 'block' : 'hidden'}>
          <MessageView onNavigate={navigate} />
        </div>
        <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
          <ProfileView onNavigate={navigate} />
        </div>
      </div>
    );
  };

  const renderSubPage = () => {
    if (!isAuthed) {
      return (
        <div className="absolute inset-0 bg-white">
          <LoginView
            onLoginSuccess={() => {
              setIsAuthed(true);
              setActiveTab('home');
              setCurrentRoute('tabs');
            }}
          />
        </div>
      );
    }

    return (
      <div className={`absolute inset-0 bg-white ${currentRoute === 'tabs' ? 'hidden' : ''}`}>
        {auctionDetailParams && (
          <div className={currentRoute === 'auction-detail' ? 'block h-full' : 'hidden h-full'}>
            <AuctionDetail
              params={auctionDetailParams}
              onBack={() => setCurrentRoute(auctionDetailBackRoute)}
              onNavigate={navigate}
              refreshKey={auctionDetailRefreshKey}
              isActive={currentRoute === 'auction-detail'}
            />
          </div>
        )}
        {currentRoute === 'free-quote' && <FreeQuote onBack={() => setCurrentRoute('tabs')} />}
        {currentRoute === 'msg-list' && (
          <MessageList params={routeParams} onBack={() => setCurrentRoute('tabs')} onNavigate={navigate} />
        )}
        {currentRoute === 'payment-detail' && <PaymentDetail onBack={() => setCurrentRoute('msg-list')} />}
        {currentRoute === 'match-detail' && <MatchDetail onBack={() => setCurrentRoute('msg-list')} />}
        {currentRoute === 'my-bids' && (
          <div className="block h-full">
            <MyBidsView onBack={() => setCurrentRoute('tabs')} onNavigate={navigate} />
          </div>
        )}
        {orderListParams && currentRoute === 'order-list' && (
          <div className="block h-full">
            <OrderListView params={orderListParams} onBack={() => setCurrentRoute('tabs')} onNavigate={navigate} />
          </div>
        )}
        {orderDetailParams && currentRoute === 'order-detail' && (
          <OrderDetailView params={orderDetailParams} onBack={() => setCurrentRoute(orderDetailBackRoute)} />
        )}
        {auctionMaintenanceParams && (
          <div className={currentRoute === 'auction-maintenance' ? 'block h-full' : 'hidden h-full'}>
            <AuctionMaintenanceView
              key={auctionMaintenanceKey}
              auctionId={auctionMaintenanceParams.auctionId}
              onBack={() => {
                setAuctionDetailRefreshKey(prev => prev + 1);
                setCurrentRoute('auction-detail');
              }}
              onSaved={() => {
                setAuctionDetailRefreshKey(prev => prev + 1);
                setCurrentRoute('auction-detail');
              }}
              onNavigate={navigate}
            />
          </div>
        )}
        {currentRoute === 'address-management' && (
          <AddressManagementView
            onBack={() => setCurrentRoute(addressBackRoute)}
            selectMode={routeParams?.mode === 'select'}
            onSelect={routeParams?.onSelect}
          />
        )}
        {currentRoute === 'settings' && (
          <SettingsView
            onBack={() => setCurrentRoute('tabs')}
            onLogout={handleLogout}
          />
        )}
      </div>
    );
  };

  return (
    <AppContext.Provider value={{ farms, productTags, loading }}>
      <div className="flex flex-col min-h-screen bg-industry-bg text-industry-text max-w-md mx-auto relative shadow-xl">
        {renderTabContent()}
        {renderSubPage()}

        <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 max-w-md mx-auto z-50 ${currentRoute === 'tabs' ? '' : 'hidden'}`}>
          <TabItem 
            active={activeTab === 'home'} 
            label="首页" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            onClick={() => setActiveTab('home')} 
          />
          <TabItem 
            active={activeTab === 'message'} 
            label="消息" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
            onClick={() => setActiveTab('message')} 
          />
          <TabItem 
            active={activeTab === 'profile'} 
            label="我的" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            onClick={() => setActiveTab('profile')} 
          />
        </nav>
      </div>
    </AppContext.Provider>
  );
};

interface TabItemProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 ${active ? 'text-industry-red font-bold' : 'text-slate-400'}`}>
    {icon}
    <span className="text-[10px]">{label}</span>
  </button>
);

export default App;
