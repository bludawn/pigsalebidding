
import React, { useState } from 'react';
import { NewsItem } from '../types';

interface MarketViewProps {
  onNavigate: (route: string, params?: any) => void;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: '【行情】今日生猪出栏均价下跌，市场供应充足',
    type: '行情',
    author: '生猪分析中心',
    isOfficial: true,
    isAuth: true,
    publishTime: '2小时前',
    readCount: 1540,
    likeCount: 45,
    isHot: true,
    isFeatured: false,
    mediaType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&h=225&fit=crop',
    summary: '今日全国生猪出栏均价为16.54元/kg，较昨日下跌0.12元/kg。北方产区受降温影响，出栏积极性有所提升...',
    tags: ['行情趋势', '华北地区']
  },
  {
    id: 'n2',
    title: '【政策】2024年下半年生猪稳产保供新规发布',
    type: '政策',
    author: '农业农村部',
    isOfficial: true,
    isAuth: true,
    publishTime: '昨天 10:30',
    readCount: 5200,
    likeCount: 128,
    isHot: true,
    isFeatured: true,
    mediaType: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=225&fit=crop',
    videoDuration: '03:15',
    summary: '政策解读：核心围绕中小规模养殖场户的金融支持与防疫补贴政策，明确了各项补助标准与申请流程...',
    tags: ['政策解读', '权威发布']
  },
  {
    id: 'n3',
    title: '【货源】江苏某大型猪场急出，品质优良',
    type: '货源',
    author: '张经理',
    isOfficial: false,
    isAuth: true,
    publishTime: '3天前',
    readCount: 890,
    likeCount: 12,
    isHot: false,
    isFeatured: false,
    mediaType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&h=225&fit=crop',
    summary: '现有育肥猪500头，品种为挪系，均重115kg，A票手续齐全，价格可面议，支持自派车...',
    tags: ['江苏货源', '育肥猪']
  }
];

const MarketView: React.FC<MarketViewProps> = ({ onNavigate }) => {
  const [activeType, setActiveType] = useState('全部');
  const [activeSort, setActiveSort] = useState('综合推荐');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Search & Tabs */}
      <div className="sticky top-0 bg-white z-20 shadow-sm border-b border-slate-100">
        <div className="px-4 py-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="搜索品种、产地、行情或政策" 
              className="w-full bg-slate-100 rounded-custom px-4 py-2 pl-10 text-sm focus:outline-none"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="flex items-center px-4 pb-2 gap-4 overflow-x-auto hide-scrollbar">
          {['全部', '市场行情', '货源快讯', '政策解读', '行业动态', '养殖技术'].map(t => (
            <button 
              key={t}
              onClick={() => setActiveType(t)}
              className={`whitespace-nowrap pb-2 text-xs font-medium transition-colors border-b-2 ${activeType === t ? 'text-industry-red border-industry-red' : 'text-slate-500 border-transparent'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-4">
            {['综合推荐', '最新发布', '最热阅读'].map(s => (
              <button 
                key={s}
                onClick={() => setActiveSort(s)}
                className={`text-[10px] ${activeSort === s ? 'text-industry-red font-bold' : 'text-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 text-[10px] text-slate-600 bg-white px-2 py-1 rounded-sm border border-slate-200">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            筛选
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="p-4 space-y-4">
        {MOCK_NEWS.map(news => (
          <div key={news.id} className="bg-white rounded-custom shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            {/* Base Info Bar */}
            <div className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-800">{news.author}</span>
                {news.isOfficial && <span className="bg-industry-red/5 text-industry-red text-[9px] px-1 rounded-sm border border-industry-red/20">官方发布</span>}
                {news.isAuth && <span className="bg-blue-50 text-blue-500 text-[9px] px-1 rounded-sm border border-blue-100">认证</span>}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span>{news.publishTime}</span>
                <div className="flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {news.readCount}
                </div>
                {news.isHot && <span className="text-industry-red font-bold">热点</span>}
              </div>
            </div>

            {/* Media Area */}
            <div className="relative aspect-[16/9] w-full px-3">
              <img src={news.thumbnail} alt="" className="w-full h-full object-cover rounded-custom" />
              <div className="absolute bottom-2 left-5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                {news.mediaType === 'video' ? '视频' : '图文'}
              </div>
              {news.mediaType === 'video' && (
                <>
                   <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-industry-red translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-2 right-5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                    {news.videoDuration}
                  </div>
                </>
              )}
            </div>

            {/* Content Area */}
            <div className="p-3">
              <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1.5">{news.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {news.summary}
              </p>
              <div className="flex gap-2">
                {news.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-industry-red bg-industry-red/5 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-3 py-3 border-t border-slate-50 flex justify-between items-center">
               <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">查看详情</button>
                  <button className="flex items-center gap-1 text-[11px] text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    收藏
                  </button>
               </div>
               <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-[11px] text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.704a1 1 0 01.94 1.347l-2.292 6.005A2 2 0 0115.462 19H8.438a2 2 0 01-1.962-1.608l-1.2-6A2 2 0 017.238 9h4.762l1.2-3.6a1 1 0 011.881.33L14 10z" /></svg>
                    {news.likeCount}
                  </button>
                  <button className="flex items-center gap-1 text-[11px] text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  {news.type === '货源' && (
                    <button className="text-[10px] text-white bg-industry-red px-3 py-1 rounded-full font-bold">联系商家</button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketView;
