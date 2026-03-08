/**
 * API 接口层
 * 所有后端接口统一在此文件管理
 */

import {
  AddressItem,
  AssetSummary,
  AuctionDetailInfo,
  AuctionItem,
  BidRecordItem,
  BusinessStats,
  ContactInfo,
  FarmItem,
  MyBidItem,
  MyBidStatus,
  OrderCounts,
  ProductTagItem,
  RegionItem,
  UserProfile,
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

/** 我的竞拍列表原始数据 */
interface MyBidRecordDto extends Omit<MyBidItem, 'endTime'> {
  endTime: string;
}

const mapMyBidRecord = (record: MyBidRecordDto): MyBidItem => {
  const parsedEndTime = new Date(record.endTime);

  return {
    ...record,
    endTime: Number.isNaN(parsedEndTime.getTime()) ? new Date() : parsedEndTime,
  };
};

/** 我的竞拍列表请求参数 */
export interface MyBidListParams extends ListRequestParams {
  status: MyBidStatus;
}

/** 获取我的竞拍列表 */
export async function getMyBidList(params: MyBidListParams): Promise<ApiResponse<ListResponseData<MyBidItem>>> {
  const result = await request<ListResponseData<MyBidRecordDto>>('/v1/weixincustomer/getMyBidList', params);

  if (result.errcode !== 0 || !result.data) {
    return result as unknown as ApiResponse<ListResponseData<MyBidItem>>;
  }

  return {
    ...result,
    data: {
      ...result.data,
      records: (result.data.records || []).map(mapMyBidRecord),
    },
  };
}

/** 获取竞价详情 */
export function getAuctionDetail(params: { auctionId: string }): Promise<ApiResponse<AuctionDetailInfo>> {
  return request<AuctionDetailInfo>('/v1/weixincustomer/getAuctionDetail', params);
}

/** 获取出价明细 */
export function getBidRecords(
  params: ListRequestParams & { auctionId: string; isMine?: boolean }
): Promise<ApiResponse<ListResponseData<BidRecordItem>>> {
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

// ============ 个人中心相关接口 ==========

const MOCK_PROFILE_INFO: UserProfile = {
  userId: 'user-10001',
  name: '广豚食品采购',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
  depositTag: '保证金已缴',
  companyName: '广东广豚食品有限公司广东广豚食品有限公司',
};

const MOCK_ORDER_COUNTS: OrderCounts = {
  paymentCount: 1,
  shipmentCount: 2,
  receiptCount: 1,
  completedCount: 8,
  allCount: 12,
  myBidCount: 3,
};

const MOCK_ASSET_SUMMARY: AssetSummary = {
  depositAmount: 50000,
  goodsAmount: 126000,
  totalBalance: 176000,
};

const MOCK_BUSINESS_STATS: BusinessStats = {
  totalTradeAmount: 3568000,
  totalPurchaseCount: 1280,
};

const MOCK_CONTACT_INFO: ContactInfo = {
  phone: '400-123-4567',
  address: '广东省深圳市南山区科技园科苑路 88 号',
  wechatQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=weixin-contact',
};

const MOCK_ADDRESS_LIST: AddressItem[] = [
  {
    id: 'addr-001',
    contactName: '张经理张经理张经理张经理',
    contactPhone: '+86-138-0013-8000',
    regionCode: '440305',
    regionName: '广东省 深圳市 南山区',
    detailAddress: '科技南八路 88 号科技南八科技南八路 88 号路 88 号科技南八路 88 号科技南八路 88 号科技南八路 88 号',
    isDefault: true,
    updatedAt: '2026-03-08 10:20',
  },
  {
    id: 'addr-002',
    contactName: '李主管',
    contactPhone: '+86-0755-8888-6666',
    regionCode: '440304',
    regionName: '广东省 深圳市 福田区',
    detailAddress: '彩田路 1001 号',
    isDefault: false,
    updatedAt: '2026-03-06 09:10',
  },
];

const buildListResponse = <T,>(params: ListRequestParams, records: T[]): ListResponseData<T> => ({
  current: params.current,
  size: params.size,
  total: records.length,
  pages: 1,
  records,
});

/** 获取个人中心信息 */
export async function getProfileInfo(): Promise<ApiResponse<UserProfile>> {
  const result = await request<UserProfile>('/v1/weixincustomer/getProfileInfo');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_PROFILE_INFO };
}

/** 获取我的订单数量统计 */
export async function getOrderCounts(): Promise<ApiResponse<OrderCounts>> {
  const result = await request<OrderCounts>('/v1/weixincustomer/getOrderCounts');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_ORDER_COUNTS };
}

/** 获取总资产 */
export async function getAssetSummary(): Promise<ApiResponse<AssetSummary>> {
  const result = await request<AssetSummary>('/v1/weixincustomer/getAssetSummary');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_ASSET_SUMMARY };
}

/** 获取数据统计 */
export async function getBusinessStats(): Promise<ApiResponse<BusinessStats>> {
  const result = await request<BusinessStats>('/v1/weixincustomer/getBusinessStats');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_BUSINESS_STATS };
}

/** 获取联系我们信息 */
export async function getContactInfo(): Promise<ApiResponse<ContactInfo>> {
  const result = await request<ContactInfo>('/v1/weixincustomer/getContactInfo');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_CONTACT_INFO };
}

/** 获取地址列表 */
export async function getAddressList(params: ListRequestParams): Promise<ApiResponse<ListResponseData<AddressItem>>> {
  const result = await request<ListResponseData<AddressItem>>('/v1/weixincustomer/getAddressList', params);
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: buildListResponse(params, MOCK_ADDRESS_LIST) };
}

/** 新增地址 */
export function createAddress(params: Omit<AddressItem, 'id' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> {
  return request<{ id: string }>('/v1/weixincustomer/createAddress', params);
}

/** 更新地址 */
export function updateAddress(params: AddressItem): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/updateAddress', params);
}

/** 删除地址 */
export function deleteAddress(params: { id: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/deleteAddress', params);
}

/** 设置默认地址 */
export function setDefaultAddress(params: { id: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/setDefaultAddress', params);
}

/** 获取默认地址 */
export async function getDefaultAddress(): Promise<ApiResponse<AddressItem>> {
  const result = await request<AddressItem>('/v1/weixincustomer/getDefaultAddress');
  if (result.errcode === 0 && result.data) return result;
  const fallback = MOCK_ADDRESS_LIST.find(item => item.isDefault) || MOCK_ADDRESS_LIST[0];
  return { errcode: 0, errmsg: '', data: fallback };
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
