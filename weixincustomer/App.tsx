
import React, { useState, useEffect, createContext, useContext } from 'react';
import { TabType, FarmItem, ProductTagItem } from './types';
import HomeView from './views/HomeView';
import MessageView from './views/MessageView';
import ProfileView from './views/ProfileView';
import AuctionDetail from './views/AuctionDetail';
import FreeQuote from './views/FreeQuote';
import MessageList from './views/MessageList';
import PaymentDetail from './views/PaymentDetail';
import MatchDetail from './views/MatchDetail';
import { getFarmList, getProductTags } from './AppApi';

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
  const [routeParams, setRouteParams] = useState<any>(null);
  
  // 全局数据
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [productTags, setProductTags] = useState<ProductTagItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 应用启动时获取基础数据
  useEffect(() => {
    const fetchBaseData = async () => {
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
  }, []);

  const navigate = (route: string, params: any = null) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  const renderTabContent = () => (
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

  const renderSubPage = () => {
    if (currentRoute === 'tabs') return null;

    switch (currentRoute) {
      case 'auction-detail':
        return <AuctionDetail params={routeParams} onBack={() => setCurrentRoute('tabs')} />;
      case 'free-quote':
        return <FreeQuote onBack={() => setCurrentRoute('tabs')} />;
      case 'msg-list':
        return <MessageList params={routeParams} onBack={() => setCurrentRoute('tabs')} onNavigate={navigate} />;
      case 'payment-detail':
        return <PaymentDetail onBack={() => setCurrentRoute('msg-list')} />;
      case 'match-detail':
        return <MatchDetail onBack={() => setCurrentRoute('msg-list')} />;
      default:
        return null;
    }
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
