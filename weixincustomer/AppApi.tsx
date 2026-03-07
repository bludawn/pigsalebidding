/**
 * API 接口层
 * 所有后端接口统一在此文件管理
 */

import {
  AuctionDetailInfo,
  AuctionItem,
  BidRecordItem,
  FarmItem,
  ProductTagItem,
  RegionItem,
} from './types';

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
let extraHeaders: Record<string, string> = {};

/** 设置请求头（例如地理位置） */
export function setRequestHeaders(headers: Record<string, string>) {
  extraHeaders = { ...extraHeaders, ...headers };
}

async function request<T>(url: string, payload: object = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
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

/** 获取场点列表 */
export function getFarmList(params?: { regionCode?: string }): Promise<ApiResponse<FarmItem[]>> {
  return request<FarmItem[]>('/v1/weixincustomer/getFarmList', params || {});
}

/** 获取产品标签列表 */
export function getProductTags(): Promise<ApiResponse<ProductTagItem[]>> {
  return request<ProductTagItem[]>('/v1/weixincustomer/getProductTags');
}

/** 获取区域列表 */
export function getRegionList(params?: { parentCode?: string }): Promise<ApiResponse<RegionItem[]>> {
  return request<RegionItem[]>('/v1/weixincustomer/getRegionList', params || {});
}

// ============ 竞价相关接口 ============

/** 竞价列表接口原始数据 */
interface AuctionRecordDto extends Omit<AuctionItem, 'endTime'> {
  endTime: string;
}

const mapAuctionRecord = (record: AuctionRecordDto): AuctionItem => {
  const parsedEndTime = new Date(record.endTime);

  return {
    ...record,
    endTime: Number.isNaN(parsedEndTime.getTime()) ? new Date() : parsedEndTime,
  };
};

/** 竞价列表请求参数 */
export interface AuctionListParams extends ListRequestParams {
  farmId?: string;       // 场点ID
  regionCode?: string;   // 区域编码
  weightRange?: string;  // 体重段
  tags?: string[];       // 产品标签（多选）
  distance?: number;     // 距离
}

/** 获取竞价列表 */
export async function getAuctionList(params: AuctionListParams): Promise<ApiResponse<ListResponseData<AuctionItem>>> {
  const result = await request<ListResponseData<AuctionRecordDto>>('/v1/weixincustomer/getAuctionList', params);

  if (result.errcode !== 0 || !result.data) {
    return result as unknown as ApiResponse<ListResponseData<AuctionItem>>;
  }

  return {
    ...result,
    data: {
      ...result.data,
      records: (result.data.records || []).map(mapAuctionRecord),
    },
  };
}

/** 获取竞价详情 */
export function getAuctionDetail(params: { auctionId: string }): Promise<ApiResponse<AuctionDetailInfo>> {
  return request<AuctionDetailInfo>('/v1/weixincustomer/getAuctionDetail', params);
}

/** 获取出价明细 */
export function getBidRecords(params: ListRequestParams & { auctionId: string }): Promise<ApiResponse<ListResponseData<BidRecordItem>>> {
  return request<ListResponseData<BidRecordItem>>('/v1/weixincustomer/getBidRecords', params);
}

/** 提交竞价 */
export function submitBid(params: {
  auctionId: string;
  bidPrice: number;
  bidCount: number;
}): Promise<ApiResponse<{ success: boolean; bidId: string }>> {
  return request<{ success: boolean; bidId: string }>('/v1/weixincustomer/submitBid', params);
}

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
