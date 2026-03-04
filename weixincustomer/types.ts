
export type TabType = 'home' | 'market' | 'message' | 'profile';

export interface AuctionItem {
  id: string;
  farmName: string;
  farmIcon: string;
  breed: string; // 挪系A, 三元A等
  quantity: number;
  weightRange: string;
  category: string; // 白猪等
  quality: string; // A票等
  startingPrice: number;
  startingCount: number;
  endTime: Date;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  type: '行情' | '政策' | '货源' | '动态' | '技术';
  author: string;
  isOfficial: boolean;
  isAuth: boolean;
  publishTime: string;
  readCount: number;
  likeCount: number;
  isHot: boolean;
  isFeatured: boolean;
  mediaType: 'image' | 'video';
  thumbnail: string;
  videoDuration?: string;
  summary: string;
  tags: string[];
}

export interface Message {
  id: string;
  type: 'product' | 'payment' | 'mall';
  title: string;
  unreadCount: number;
  time: string;
  content: string;
  details?: any;
}
