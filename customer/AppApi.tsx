/**
 * API 接口层
 * 所有后端接口统一在此文件管理
 */

import {
  AddressItem,
  AssetSummary,
  AuctionDetailInfo,
  AuctionItem,
  AuctionMaintenanceInfo,
  BidRecordItem,
  BidStatus,
  BusinessStats,
  ContactInfo,
  FarmItem,
  MyBidItem,
  MyBidStatus,
  MyBidStatusCounts,
  OrderCounts,
  OrderDetailInfo,
  OrderListItem,
  OrderListStatus,
  ProductTagItem,
  RegionItem,
  UserProfile,
  UserSettingsProfile,
} from './types';

// ============ 通用类型定义 ============

/** API 响应通用格式 */
interface ApiResponse<T = any> {
  errcode: number;
  errmsg: string;
  data: T;
}

/** RuoYi 通用返回格式 */
interface RuoyiAjaxResult<T = any> {
  code: number;
  msg: string;
  data?: T;
  token?: string;
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
const AUTH_TOKEN_KEY = 'Admin-Token';
const CUSTOMER_HEADER_KEY = 'customer';

const withFileHost = (url?: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) {
    return `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}${url}`;
  }
  const base = API_BASE_URL.startsWith('http')
    ? API_BASE_URL.replace(/\/api\/?$/, '')
    : (typeof window !== 'undefined' ? window.location.origin : '');
  if (!base) return url;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * 通用请求方法
 * @param url 接口地址
 * @param payload 请求参数
 */
let extraHeaders: Record<string, string> = {};

const setCookie = (key: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (key: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
};

const removeCookie = (key: string) => {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const setAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => getCookie(AUTH_TOKEN_KEY);

export const clearAuthToken = () => removeCookie(AUTH_TOKEN_KEY);

const buildRequestHeaders = (options?: { withToken?: boolean; extra?: Record<string, string> }) => {
  const headers: Record<string, string> = {
    [CUSTOMER_HEADER_KEY]: '1',
    ...extraHeaders,
    ...(options?.extra || {}),
  };

  if (options?.withToken !== false) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

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
        ...buildRequestHeaders({ withToken: url !== '/login' }),
      },
      body: JSON.stringify(payload),
    });

    console.log('response', response)
    const result: ApiResponse<T> = await response.json();
    console.log('result', result)

    const ruoyiResult = result as unknown as RuoyiAjaxResult;
    if (response.status === 401 || ruoyiResult.code === 401 || result.errcode === 401) {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent('customer-auth-expired'));
      return {
        errcode: 401,
        errmsg: ruoyiResult.msg || result.errmsg || '认证失败',
        data: null as T,
      };
    }

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
  bidStatus?: BidStatus; // 竞价状态
  farmId?: string;       // 场点ID
  regionCode?: string;   // 区域编码
  weightRange?: string;  // 体重段
  tags?: string[];       // 产品标签（多选）
  date?: string;         // 日期 (YYYY-MM-DD)
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

/** 获取我的竞拍状态数量 */
export async function getMyBidStatusCounts(): Promise<ApiResponse<MyBidStatusCounts>> {
  return request<MyBidStatusCounts>('/v1/weixincustomer/getMyBidStatusCounts');
}

/** 获取竞价详情 */
export function getAuctionDetail(params: { auctionId: string }): Promise<ApiResponse<AuctionDetailInfo>> {
  return request<AuctionDetailInfo>('/v1/weixincustomer/getAuctionDetail', params);
}

/** 获取竞价维护信息 */
export async function getAuctionMaintenance(params: { auctionId: string }): Promise<ApiResponse<AuctionMaintenanceInfo | null>> {
  return request<AuctionMaintenanceInfo | null>('/v1/weixincustomer/getAuctionMaintenance', params);
}

/** 保存竞价维护信息 */
export async function saveAuctionMaintenance(params: {
  auctionId: string;
  addressId: string;
  appointmentTime: string;
  remark?: string;
}): Promise<ApiResponse<AuctionMaintenanceInfo>> {
  return request<AuctionMaintenanceInfo>('/v1/weixincustomer/saveAuctionMaintenance', params);
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

/** 取消出价明细 */
export function cancelBidRecord(params: { auctionId: string; bidRecordId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/cancelBidRecord', params);
}

/** 手机号密码登录（RuoYi） */
export async function loginByPhonePassword(params: {
  phone: string;
  password: string;
}): Promise<ApiResponse<{ token: string }>> {
  try {
    console.log('Login Params:', params)
    const response = await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildRequestHeaders({ withToken: false }),
      },
      body: JSON.stringify({
        username: params.phone,
        password: params.password,
      }),
    });

    const result: RuoyiAjaxResult = await response.json();
    if (result.code === 200 && result.token) {
      return { errcode: 0, errmsg: '', data: { token: result.token } };
    }

    return { errcode: result.code || -1, errmsg: result.msg || '登录失败', data: null as any };
  } catch (error) {
    console.error('Login Error:', error);
    return { errcode: -1, errmsg: '网络请求失败', data: null as any };
  }
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
export async function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  const result = await request<UserInfo>('/v1/weixincustomer/getUserInfo');
  if (result.errcode !== 0 || !result.data) {
    return result;
  }
  return {
    ...result,
    data: { ...result.data, avatar: withFileHost(result.data.avatar) },
  };
}

// ============ 个人中心相关接口 ==========


/** 获取个人中心信息 */
export async function getProfileInfo(): Promise<ApiResponse<UserProfile>> {
  const result = await request<UserProfile>('/v1/weixincustomer/getProfileInfo');
  if (result.errcode !== 0 || !result.data) {
    return result;
  }
  return {
    ...result,
    data: { ...result.data, avatar: withFileHost(result.data.avatar) },
  };
}

/** 获取设置页信息 */
export async function getUserSettings(): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/getUserSettings');
  if (result.errcode !== 0 || !result.data) {
    return result;
  }
  return {
    ...result,
    data: { ...result.data, avatar: withFileHost(result.data.avatar) },
  };
}

/** 上传图片 */
export async function uploadImage(params: {
  file: File;
  scene: 'avatar' | 'license' | 'material';
}): Promise<ApiResponse<{ url: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('scene', params.scene);

    const response = await fetch(`${API_BASE_URL}/v1/weixincustomer/uploadImage`, {
      method: 'POST',
      headers: {
        ...buildRequestHeaders(),
      },
      body: formData,
    });

    const result: ApiResponse<{ url: string }> = await response.json();
    if (result.errcode !== 0 || !result.data) {
      return result;
    }
    return {
      ...result,
      data: { ...result.data, url: withFileHost(result.data.url) },
    };
  } catch (error) {
    console.error('Upload Error:', error);
    return {
      errcode: -1,
      errmsg: '网络请求失败',
      data: null as any,
    };
  }
}

/** 保存个人信息 */
export async function saveUserProfile(params: { name: string; avatar: string }): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/saveUserProfile', params);
  if (result.errcode !== 0 || !result.data) {
    return result;
  }
  return {
    ...result,
    data: { ...result.data, avatar: withFileHost(result.data.avatar) },
  };
}

/** 提交公司认证资料 */
export async function submitCompanyVerification(params: {
  licenseUrls: string[];
  materialUrls: string[];
}): Promise<ApiResponse<UserSettingsProfile>> {
  return request<UserSettingsProfile>('/v1/weixincustomer/submitCompanyVerification', params);
}

/** 微信实名认证 */
export async function verifyPersonalIdentity(): Promise<ApiResponse<UserSettingsProfile>> {
  return request<UserSettingsProfile>('/v1/weixincustomer/verifyPersonalIdentity');
}

/** 登出 */
export async function logout(): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/logout');
}

/** 获取我的订单数量统计 */
export async function getOrderCounts(): Promise<ApiResponse<OrderCounts>> {
  return request<OrderCounts>('/v1/weixincustomer/getOrderCounts');
}

/** 获取总资产 */
export async function getAssetSummary(): Promise<ApiResponse<AssetSummary>> {
  return request<AssetSummary>('/v1/weixincustomer/getAssetSummary');
}

/** 获取数据统计 */
export async function getBusinessStats(): Promise<ApiResponse<BusinessStats>> {
  return request<BusinessStats>('/v1/weixincustomer/getBusinessStats');
}

/** 获取联系我们信息 */
export async function getContactInfo(): Promise<ApiResponse<ContactInfo>> {
  return request<ContactInfo>('/v1/weixincustomer/getContactInfo');
}

/** 获取地址列表 */
export async function getAddressList(params: ListRequestParams): Promise<ApiResponse<ListResponseData<AddressItem>>> {
  return request<ListResponseData<AddressItem>>('/v1/weixincustomer/getAddressList', params);
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
  return request<AddressItem>('/v1/weixincustomer/getDefaultAddress');
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
export async function getOrderList(params: ListRequestParams & {
  status?: OrderListStatus;
}): Promise<ApiResponse<ListResponseData<OrderListItem>>> {
  return request<ListResponseData<OrderListItem>>('/v1/weixincustomer/getOrderList', params);
}

/** 获取订单详情 */
export async function getOrderDetail(params: { orderId: string }): Promise<ApiResponse<OrderDetailInfo>> {
  return request<OrderDetailInfo>('/v1/weixincustomer/getOrderDetail', params);
}

/** 取消订单 */
export function cancelOrder(params: { orderId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/cancelOrder', params);
}

/** 支付订单 */
export function payOrder(params: { orderId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/payOrder', params);
}

/** 确认收货 */
export function confirmReceipt(params: { orderId: string }): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('/v1/weixincustomer/confirmReceipt', params);
}
