
export type TabType = 'home' | 'market' | 'message' | 'profile';

/** 竞价项数据 */
export interface AuctionItem {
  id: string;
  farmId: string;
  farmName: string;
  farmIcon: string;
  breed: string;
  quantity: number;
  weightRange: string;
  tags: string[]; // 产品标签数组，如 ["挪系A", "白猪"]
  startingPrice: number;
  startingCount: number;
  endTime: Date;
  imageUrl: string;
}

/** 场点数据 */
export interface FarmItem {
  id: string;
  name: string;
  regionCode?: string;
}

/** 产品标签数据 */
export interface ProductTagItem {
  id: string;
  name: string;
}

/** 区域数据（树形） */
export interface RegionItem {
  code: string;
  name: string;
  level: number; // 1:省 2:市 3:区/县 4:镇
  children?: RegionItem[];
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

/** 筛选条件状态 */
export interface FilterState {
  farmId?: string;
  farmName?: string;
  regionCode?: string;
  regionName?: string;
  weightRange?: string;
  tags?: string[];
  distance: number;
}

/** 分页状态 */
export interface PaginationState {
  current: number;
  size: number;
  total: number;
  pages: number;
  hasMore: boolean;
  loading: boolean;
}
