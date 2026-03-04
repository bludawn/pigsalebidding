/**
 * API 接口层
 * 所有后端接口统一在此文件管理
 */

// ============ 通用类型定义 ============

/** API 响应通用格式 */
interface ApiResponse<T = any> {
  errcode: number;
  errmsg: string;
  data: T;
}

/** 列表请求入参 */
interface ListRequestParams {
  current: number;
  size: number;
  searchCount: boolean;
  search?: string;
}

/** 列表响应出参 */
interface ListResponseData<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

// ============ 请求基础配置 ============

const API_BASE_URL = '/api'; // 可根据环境配置

/**
 * 通用请求方法
 * @param url 接口地址
 * @param payload 请求参数
 */
async function request<T>(url: string, payload: object = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<T> = await response.json();
    
    if (result.errcode !== 0) {
      console.error(`API Error [${url}]:`, result.errmsg);
    }
    
    return result;
  } catch (error) {
    console.error(`Request Error [${url}]:`, error);
    return {
      errcode: -1,
      errmsg: '网络请求失败',
      data: null as T,
    };
  }
}

// ============ 基础数据接口 ============

/** 场点数据 */
export interface FarmRecord {
  id: string;
  name: string;
  regionCode?: string; // 所属区域编码
}

/** 获取场点列表 */
export function getFarmList(params?: { regionCode?: string }): Promise<ApiResponse<FarmRecord[]>> {
  return request<FarmRecord[]>('/v1/weixincustomer/getFarmList', params || {});
}

/** 产品标签数据 */
export interface ProductTagRecord {
  id: string;
  name: string;
}

/** 获取产品标签列表 */
export function getProductTags(): Promise<ApiResponse<ProductTagRecord[]>> {
  return request<ProductTagRecord[]>('/v1/weixincustomer/getProductTags');
}

/** 区域数据（树形） */
export interface RegionRecord {
  code: string;
  name: string;
  level: number; // 1:省 2:市 3:区/县 4:镇
  children?: RegionRecord[];
}

/** 获取区域列表 */
export function getRegionList(params?: { parentCode?: string }): Promise<ApiResponse<RegionRecord[]>> {
  return request<RegionRecord[]>('/v1/weixincustomer/getRegionList', params || {});
}

// ============ 竞价相关接口 ============

/** 竞价项数据 */
export interface AuctionRecord {
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
  endTime: string;
  imageUrl: string;
}

/** 竞价列表请求参数 */
export interface AuctionListParams extends ListRequestParams {
  farmId?: string;       // 场点ID
  regionCode?: string;   // 区域编码
  weightRange?: string;  // 体重段
  tags?: string[];       // 产品标签（多选）
  distance?: number;     // 距离
}

/** 获取竞价列表 */
export function getAuctionList(params: AuctionListParams): Promise<ApiResponse<ListResponseData<AuctionRecord>>> {
  return request<ListResponseData<AuctionRecord>>('/v1/weixincustomer/getAuctionList', params);
}

/** 获取竞价详情 */
export function getAuctionDetail(params: { auctionId: string }): Promise<ApiResponse<AuctionRecord>> {
  return request<AuctionRecord>('/v1/weixincustomer/getAuctionDetail', params);
}

/** 提交竞价 */
export function submitBid(params: {
  auctionId: string;
  bidPrice: number;
  bidCount: number;
}): Promise<ApiResponse<{ success: boolean; bidId: string }>> {
  return request('/v1/weixincustomer/submitBid', params);
}

// ============ 自由报价相关接口 ============

/** 提交自由报价 */
export function submitFreeQuote(params: {
  quotePrice: number;
  quoteCount: number;
  address: string;
  loadTime: string;
  remarks?: string;
}): Promise<ApiResponse<{ success: boolean; quoteId: string }>> {
  return request('/v1/weixincustomer/submitFreeQuote', params);
}

// ============ 资讯相关接口 ============

/** 资讯项数据 */
export interface NewsRecord {
  id: string;
  title: string;
  type: string;
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

/** 获取资讯列表 */
export function getNewsList(params: ListRequestParams & {
  type?: string; // 类型筛选
}): Promise<ApiResponse<ListResponseData<NewsRecord>>> {
  return request<ListResponseData<NewsRecord>>('/v1/weixincustomer/getNewsList', params);
}

/** 获取资讯详情 */
export function getNewsDetail(params: { newsId: string }): Promise<ApiResponse<NewsRecord>> {
  return request<NewsRecord>('/v1/weixincustomer/getNewsDetail', params);
}

// ============ 消息相关接口 ============

/** 消息项数据 */
export interface MessageRecord {
  id: string;
  type: 'product' | 'payment' | 'mall';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  details?: any;
}

/** 获取消息列表 */
export function getMessageList(params: ListRequestParams & {
  type: 'product' | 'payment' | 'mall';
}): Promise<ApiResponse<ListResponseData<MessageRecord>>> {
  return request<ListResponseData<MessageRecord>>('/v1/weixincustomer/getMessageList', params);
}

/** 标记消息已读 */
export function markMessageRead(params: { messageId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request('/v1/weixincustomer/markMessageRead', params);
}

/** 获取未读消息数量 */
export function getUnreadCount(): Promise<ApiResponse<{ product: number; payment: number; mall: number }>> {
  return request('/v1/weixincustomer/getUnreadCount');
}

// ============ 用户相关接口 ============

/** 用户信息 */
export interface UserInfo {
  userId: string;
  nickname: string;
  avatar: string;
  vipLevel: string;
  collectCount: number;
  footprintCount: number;
  points: number;
  coupons: number;
  totalAssets: number;
}

/** 获取用户信息 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return request<UserInfo>('/v1/weixincustomer/getUserInfo');
}

/** 获取账户余额 */
export function getAccountBalance(): Promise<ApiResponse<{
  totalBalance: number;
  availableBalance: number;
  frozenAmount: number;
}>> {
  return request('/v1/weixincustomer/getAccountBalance');
}

/** 获取交易记录 */
export function getTransactionList(params: ListRequestParams): Promise<ApiResponse<ListResponseData<{
  type: string;
  time: string;
  amount: number;
  icon: string;
  isPositive: boolean;
}>>> {
  return request('/v1/weixincustomer/getTransactionList', params);
}

// ============ 订单相关接口 ============

/** 订单统计数据 */
export interface OrderStats {
  unpaid: number;
  unshipped: number;
  unreceived: number;
  unevaluated: number;
  afterSale: number;
}

/** 获取订单统计 */
export function getOrderStats(): Promise<ApiResponse<OrderStats>> {
  return request<OrderStats>('/v1/weixincustomer/getOrderStats');
}

/** 获取订单列表 */
export function getOrderList(params: ListRequestParams & {
  status?: string;
}): Promise<ApiResponse<ListResponseData<any>>> {
  return request('/v1/weixincustomer/getOrderList', params);
}

// ============ 匹配相关接口 ============

/** 匹配详情 */
export interface MatchDetail {
  matchId: string;
  farmName: string;
  breed: string;
  weightRange: string;
  quantity: number;
  price: number;
  quality: string;
  status: string;
  orderTime: string;
  loadTime: string;
  carType: string;
  address: string;
  totalAmount: number;
}

/** 获取匹配详情 */
export function getMatchDetail(params: { matchId: string }): Promise<ApiResponse<MatchDetail>> {
  return request<MatchDetail>('/v1/weixincustomer/getMatchDetail', params);
}

/** 获取匹配列表 */
export function getMatchList(params: ListRequestParams & {
  status?: string;
}): Promise<ApiResponse<ListResponseData<MatchDetail>>> {
  return request('/v1/weixincustomer/getMatchList', params);
}

// ============ 收藏相关接口 ============

/** 添加收藏 */
export function addFavorite(params: { targetId: string; type: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request('/v1/weixincustomer/addFavorite', params);
}

/** 取消收藏 */
export function removeFavorite(params: { targetId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request('/v1/weixincustomer/removeFavorite', params);
}

/** 获取收藏列表 */
export function getFavoriteList(params: ListRequestParams): Promise<ApiResponse<ListResponseData<any>>> {
  return request('/v1/weixincustomer/getFavoriteList', params);
}
