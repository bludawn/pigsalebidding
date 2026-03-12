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

const MOCK_MY_BID_STATUS_COUNTS: MyBidStatusCounts = {
  biddingCount: 10,
  successCount: 12,
  failedCount: 13,
};

/** 获取我的竞拍状态数量 */
export async function getMyBidStatusCounts(): Promise<ApiResponse<MyBidStatusCounts>> {
  const result = await request<MyBidStatusCounts>('/v1/weixincustomer/getMyBidStatusCounts');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_MY_BID_STATUS_COUNTS };
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

let MOCK_SETTINGS_PROFILE: UserSettingsProfile = {
  userId: 'user-10001',
  phone: '138****8000',
  name: '广豚食品采购',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
  companyVerification: {
    status: 'UNVERIFIED',
    companyName: '',
    licenseUrls: [],
    materialUrls: [],
  },
  personalVerification: {
    status: 'UNVERIFIED',
  },
};

const MOCK_ORDER_COUNTS: OrderCounts = {
  paymentCount: 2,
  shipmentCount: 2,
  receiptCount: 1,
  completedCount: 5,
  cancelledCount: 1,
  allCount: 11,
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

/** 获取设置页信息 */
export async function getUserSettings(): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/getUserSettings');
  if (result.errcode === 0 && result.data) return result;
  return { errcode: 0, errmsg: '', data: MOCK_SETTINGS_PROFILE };
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
        ...extraHeaders,
      },
      body: formData,
    });

    const result: ApiResponse<{ url: string }> = await response.json();
    if (result.errcode === 0 && result.data?.url) return result;
  } catch (error) {
    console.error('Upload Error:', error);
  }

  return {
    errcode: 0,
    errmsg: '',
    data: { url: URL.createObjectURL(params.file) },
  };
}

/** 保存个人信息 */
export async function saveUserProfile(params: { name: string; avatar: string }): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/saveUserProfile', params);
  if (result.errcode === 0 && result.data) {
    MOCK_SETTINGS_PROFILE = result.data;
    return result;
  }
  MOCK_SETTINGS_PROFILE = {
    ...MOCK_SETTINGS_PROFILE,
    name: params.name || MOCK_SETTINGS_PROFILE.name,
    avatar: params.avatar || MOCK_SETTINGS_PROFILE.avatar,
  };
  return { errcode: 0, errmsg: '', data: MOCK_SETTINGS_PROFILE };
}

/** 提交公司认证资料 */
export async function submitCompanyVerification(params: {
  licenseUrls: string[];
  materialUrls: string[];
}): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/submitCompanyVerification', params);
  if (result.errcode === 0 && result.data) {
    MOCK_SETTINGS_PROFILE = result.data;
    return result;
  }
  MOCK_SETTINGS_PROFILE = {
    ...MOCK_SETTINGS_PROFILE,
    companyVerification: {
      status: 'VERIFIED',
      companyName: 'OCR识别企业有限公司',
      licenseUrls: params.licenseUrls,
      materialUrls: params.materialUrls,
    },
  };
  return { errcode: 0, errmsg: '', data: MOCK_SETTINGS_PROFILE };
}

/** 微信实名认证 */
export async function verifyPersonalIdentity(): Promise<ApiResponse<UserSettingsProfile>> {
  const result = await request<UserSettingsProfile>('/v1/weixincustomer/verifyPersonalIdentity');
  if (result.errcode === 0 && result.data) {
    MOCK_SETTINGS_PROFILE = result.data;
    return result;
  }
  MOCK_SETTINGS_PROFILE = {
    ...MOCK_SETTINGS_PROFILE,
    personalVerification: {
      status: 'VERIFIED',
      wechatName: MOCK_SETTINGS_PROFILE.personalVerification.wechatName || '微信用户',
      verifiedAt: new Date().toISOString().slice(0, 10),
    },
  };
  return { errcode: 0, errmsg: '', data: MOCK_SETTINGS_PROFILE };
}

/** 登出 */
export async function logout(): Promise<ApiResponse<{ success: boolean }>> {
  const result = await request<{ success: boolean }>('/v1/weixincustomer/logout');
  if (result.errcode === 0) return result;
  return { errcode: 0, errmsg: '', data: { success: true } };
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

const MOCK_ORDER_LIST: OrderListItem[] = [
  {
    orderId: 'order-20260308001',
    status: 'ORDER_PAYMENT',
    farmName: '牧原股份·山东五号场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 120,
    price: 15.8,
    totalAmount: 189600,
    createdAt: '2026-03-08 10:12',
  },
  {
    orderId: 'order-20260308002',
    status: 'ORDER_SHIPMENT',
    farmName: '温氏集团·广东清远基地',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 160,
    price: 16.2,
    totalAmount: 259200,
    createdAt: '2026-03-08 09:40',
  },
  {
    orderId: 'order-20260308003',
    status: 'ORDER_RECEIPT',
    farmName: '正邦科技·江西基地',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 100,
    price: 15.2,
    totalAmount: 152000,
    createdAt: '2026-03-07 16:30',
  },
  {
    orderId: 'order-20260308004',
    status: 'ORDER_COMPLETED',
    farmName: '新希望·四川中心场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 140,
    price: 15.5,
    totalAmount: 217000,
    createdAt: '2026-03-06 09:20',
  },
  {
    orderId: 'order-20260308005',
    status: 'ORDER_PAYMENT',
    farmName: '天邦股份·江苏基地',
    pigTypeName: '中猪',
    weightRange: '90-110kg',
    quantity: 80,
    price: 15.1,
    totalAmount: 120800,
    createdAt: '2026-03-09 11:05',
  },
  {
    orderId: 'order-20260308006',
    status: 'ORDER_SHIPMENT',
    farmName: '双汇发展·河南周口场',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 200,
    price: 16.0,
    totalAmount: 320000,
    createdAt: '2026-03-05 15:20',
  },
  {
    orderId: 'order-20260308007',
    status: 'ORDER_RECEIPT',
    farmName: '正大集团·广西南宁场',
    pigTypeName: '大猪',
    weightRange: '120-135kg',
    quantity: 90,
    price: 16.4,
    totalAmount: 147600,
    createdAt: '2026-03-04 08:50',
  },
  {
    orderId: 'order-20260308008',
    status: 'ORDER_COMPLETED',
    farmName: '华统股份·浙江金华场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 150,
    price: 15.7,
    totalAmount: 235500,
    createdAt: '2026-03-03 13:10',
  },
  {
    orderId: 'order-20260308009',
    status: 'ORDER_COMPLETED',
    farmName: '唐人神·湖南长沙场',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 110,
    price: 15.3,
    totalAmount: 168300,
    createdAt: '2026-03-02 10:35',
  },
  {
    orderId: 'order-20260308010',
    status: 'ORDER_PAYMENT',
    farmName: '大北农·河北衡水场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 130,
    price: 15.9,
    totalAmount: 206700,
    createdAt: '2026-03-01 09:05',
  },
  {
    orderId: 'order-20260308011',
    status: 'ORDER_CANCELLED',
    farmName: '新五丰·湖南株洲场',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 90,
    price: 15.4,
    totalAmount: 138600,
    createdAt: '2026-02-28 17:40',
  },
  {
    orderId: 'order-20260308012',
    status: 'ORDER_PAYMENT',
    farmName: '正虹科技·湖南岳阳场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 170,
    price: 15.6,
    totalAmount: 265200,
    createdAt: '2026-02-27 15:30',
  },
  {
    orderId: 'order-20260308013',
    status: 'ORDER_SHIPMENT',
    farmName: '新五丰·广东肇庆场',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 190,
    price: 16.1,
    totalAmount: 305900,
    createdAt: '2026-02-26 09:20',
  },
  {
    orderId: 'order-20260308014',
    status: 'ORDER_RECEIPT',
    farmName: '湘佳股份·湖南常德场',
    pigTypeName: '中猪',
    weightRange: '90-105kg',
    quantity: 120,
    price: 15.0,
    totalAmount: 180000,
    createdAt: '2026-02-25 14:10',
  },
  {
    orderId: 'order-20260308015',
    status: 'ORDER_COMPLETED',
    farmName: '雏鹰农牧·河南许昌场',
    pigTypeName: '大猪',
    weightRange: '120-140kg',
    quantity: 95,
    price: 16.3,
    totalAmount: 154850,
    createdAt: '2026-02-24 11:45',
  },
  {
    orderId: 'order-20260308016',
    status: 'ORDER_CANCELLED',
    farmName: '京基智农·广东惠州场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 110,
    price: 15.2,
    totalAmount: 167200,
    createdAt: '2026-02-23 16:50',
  },
  {
    orderId: 'order-20260308017',
    status: 'ORDER_COMPLETED',
    farmName: '神农集团·云南玉溪场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 135,
    price: 15.8,
    totalAmount: 213300,
    createdAt: '2026-02-22 10:05',
  },
];

const MOCK_ORDER_DETAIL: Record<string, OrderDetailInfo> = {
  'order-20260308001': {
    orderId: 'order-20260308001',
    status: 'ORDER_PAYMENT',
    farmName: '牧原股份·山东五号场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 120,
    price: 15.8,
    priceInfo: {
      depositAmount: 20000,
      goodsAmount: 169600,
      totalAmount: 189600,
    },
    deliveryInfo: {
      contactName: '张经理',
      contactPhone: '138-0013-8000',
      address: '广东省 深圳市 南山区 科技南八路 88 号',
      deliveryTime: '2026-03-10 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-08 10:12' },
      { label: '等待付款', time: '2026-03-08 10:12', desc: '请在24小时内完成支付' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308002': {
    orderId: 'order-20260308002',
    status: 'ORDER_SHIPMENT',
    farmName: '温氏集团·广东清远基地',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 160,
    price: 16.2,
    priceInfo: {
      depositAmount: 30000,
      goodsAmount: 229200,
      totalAmount: 259200,
    },
    deliveryInfo: {
      contactName: '李主管',
      contactPhone: '0755-8888-6666',
      address: '广东省 深圳市 福田区 彩田路 1001 号',
      deliveryTime: '2026-03-11 14:00-18:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-08 09:40' },
      { label: '支付完成', time: '2026-03-08 10:05' },
      { label: '等待发货', time: '2026-03-08 10:06', desc: '场点正在安排装猪' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308003': {
    orderId: 'order-20260308003',
    status: 'ORDER_RECEIPT',
    farmName: '正邦科技·江西基地',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 100,
    price: 15.2,
    priceInfo: {
      depositAmount: 15000,
      goodsAmount: 137000,
      totalAmount: 152000,
    },
    deliveryInfo: {
      contactName: '王主管',
      contactPhone: '136-0000-9000',
      address: '广东省 深圳市 罗湖区 人民北路 123 号',
      deliveryTime: '2026-03-09 08:30-12:00',
    },
    shipmentInfo: {
      driverName: '陈师傅',
      driverPhone: '138-5555-3322',
      vehicleNo: '粤B·12345',
      estimatedArrival: '2026-03-09 10:30',
      remark: '途中高速畅通',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-07 16:30' },
      { label: '支付完成', time: '2026-03-07 17:05' },
      { label: '已发货', time: '2026-03-08 08:00' },
      { label: '等待收货', time: '2026-03-08 08:00', desc: '司机已出发' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308004': {
    orderId: 'order-20260308004',
    status: 'ORDER_COMPLETED',
    farmName: '新希望·四川中心场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 140,
    price: 15.5,
    priceInfo: {
      depositAmount: 20000,
      goodsAmount: 197000,
      totalAmount: 217000,
    },
    deliveryInfo: {
      contactName: '赵经理',
      contactPhone: '139-2222-1111',
      address: '广东省 深圳市 南山区 深南大道 66 号',
      deliveryTime: '2026-03-06 09:00-12:00',
    },
    shipmentInfo: {
      driverName: '刘师傅',
      driverPhone: '136-0000-7777',
      vehicleNo: '粤B·67890',
      estimatedArrival: '2026-03-06 11:30',
      remark: '已完成卸货',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-06 09:20' },
      { label: '支付完成', time: '2026-03-06 09:45' },
      { label: '已发货', time: '2026-03-06 10:00' },
      { label: '确认收货', time: '2026-03-06 12:30' },
      { label: '订单完成', time: '2026-03-06 12:45' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308005': {
    orderId: 'order-20260308005',
    status: 'ORDER_PAYMENT',
    farmName: '天邦股份·江苏基地',
    pigTypeName: '中猪',
    weightRange: '90-110kg',
    quantity: 80,
    price: 15.1,
    priceInfo: {
      depositAmount: 12000,
      goodsAmount: 108800,
      totalAmount: 120800,
    },
    deliveryInfo: {
      contactName: '周经理',
      contactPhone: '138-7777-2211',
      address: '江苏省 南京市 江宁区 双龙大道 99 号',
      deliveryTime: '2026-03-11 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-09 11:05' },
      { label: '等待付款', time: '2026-03-09 11:05', desc: '请在24小时内完成支付' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308006': {
    orderId: 'order-20260308006',
    status: 'ORDER_SHIPMENT',
    farmName: '双汇发展·河南周口场',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 200,
    price: 16.0,
    priceInfo: {
      depositAmount: 40000,
      goodsAmount: 280000,
      totalAmount: 320000,
    },
    deliveryInfo: {
      contactName: '韩主管',
      contactPhone: '0371-6666-8800',
      address: '河南省 周口市 川汇区 建设大道 168 号',
      deliveryTime: '2026-03-07 14:00-18:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-05 15:20' },
      { label: '支付完成', time: '2026-03-05 16:10' },
      { label: '等待发货', time: '2026-03-05 16:30', desc: '场点正在安排装猪' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308007': {
    orderId: 'order-20260308007',
    status: 'ORDER_RECEIPT',
    farmName: '正大集团·广西南宁场',
    pigTypeName: '大猪',
    weightRange: '120-135kg',
    quantity: 90,
    price: 16.4,
    priceInfo: {
      depositAmount: 15000,
      goodsAmount: 132600,
      totalAmount: 147600,
    },
    deliveryInfo: {
      contactName: '梁主管',
      contactPhone: '0771-3322-8899',
      address: '广西省 南宁市 青秀区 民族大道 120 号',
      deliveryTime: '2026-03-06 08:30-12:00',
    },
    shipmentInfo: {
      driverName: '郑师傅',
      driverPhone: '136-2222-3344',
      vehicleNo: '桂A·55678',
      estimatedArrival: '2026-03-06 10:20',
      remark: '预计准时到达',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-04 08:50' },
      { label: '支付完成', time: '2026-03-04 09:20' },
      { label: '已发货', time: '2026-03-05 07:30' },
      { label: '等待收货', time: '2026-03-05 07:30', desc: '司机已出发' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308008': {
    orderId: 'order-20260308008',
    status: 'ORDER_COMPLETED',
    farmName: '华统股份·浙江金华场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 150,
    price: 15.7,
    priceInfo: {
      depositAmount: 25000,
      goodsAmount: 210500,
      totalAmount: 235500,
    },
    deliveryInfo: {
      contactName: '蒋经理',
      contactPhone: '0579-8888-6688',
      address: '浙江省 金华市 婺城区 宾虹路 88 号',
      deliveryTime: '2026-03-04 09:00-12:00',
    },
    shipmentInfo: {
      driverName: '邓师傅',
      driverPhone: '137-0000-5678',
      vehicleNo: '浙G·88990',
      estimatedArrival: '2026-03-04 11:10',
      remark: '已完成卸货',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-03 13:10' },
      { label: '支付完成', time: '2026-03-03 13:40' },
      { label: '已发货', time: '2026-03-03 16:00' },
      { label: '确认收货', time: '2026-03-04 11:40' },
      { label: '订单完成', time: '2026-03-04 11:50' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308009': {
    orderId: 'order-20260308009',
    status: 'ORDER_COMPLETED',
    farmName: '唐人神·湖南长沙场',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 110,
    price: 15.3,
    priceInfo: {
      depositAmount: 15000,
      goodsAmount: 153300,
      totalAmount: 168300,
    },
    deliveryInfo: {
      contactName: '何经理',
      contactPhone: '0731-3333-2299',
      address: '湖南省 长沙市 岳麓区 金星路 188 号',
      deliveryTime: '2026-03-03 14:00-18:00',
    },
    shipmentInfo: {
      driverName: '范师傅',
      driverPhone: '139-5555-8181',
      vehicleNo: '湘A·33221',
      estimatedArrival: '2026-03-03 16:10',
      remark: '已完成卸货',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-02 10:35' },
      { label: '支付完成', time: '2026-03-02 11:05' },
      { label: '已发货', time: '2026-03-02 15:00' },
      { label: '确认收货', time: '2026-03-02 18:10' },
      { label: '订单完成', time: '2026-03-02 18:20' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308010': {
    orderId: 'order-20260308010',
    status: 'ORDER_PAYMENT',
    farmName: '大北农·河北衡水场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 130,
    price: 15.9,
    priceInfo: {
      depositAmount: 20000,
      goodsAmount: 186700,
      totalAmount: 206700,
    },
    deliveryInfo: {
      contactName: '高主管',
      contactPhone: '0318-6666-1122',
      address: '河北省 衡水市 桃城区 人民东路 66 号',
      deliveryTime: '2026-03-10 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-03-01 09:05' },
      { label: '等待付款', time: '2026-03-01 09:05', desc: '请在24小时内完成支付' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308011': {
    orderId: 'order-20260308011',
    status: 'ORDER_CANCELLED',
    farmName: '新五丰·湖南株洲场',
    pigTypeName: '中猪',
    weightRange: '95-110kg',
    quantity: 90,
    price: 15.4,
    priceInfo: {
      depositAmount: 10000,
      goodsAmount: 128600,
      totalAmount: 138600,
    },
    deliveryInfo: {
      contactName: '刘主管',
      contactPhone: '0731-5555-7788',
      address: '湖南省 株洲市 天元区 神农大道 100 号',
      deliveryTime: '2026-03-02 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-28 17:40' },
      { label: '订单取消', time: '2026-02-28 18:10', desc: '订单已取消，可重新下单' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308012': {
    orderId: 'order-20260308012',
    status: 'ORDER_PAYMENT',
    farmName: '正虹科技·湖南岳阳场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 170,
    price: 15.6,
    priceInfo: {
      depositAmount: 25000,
      goodsAmount: 240200,
      totalAmount: 265200,
    },
    deliveryInfo: {
      contactName: '谢主管',
      contactPhone: '0730-8899-5566',
      address: '湖南省 岳阳市 岳阳楼区 巴陵东路 108 号',
      deliveryTime: '2026-03-01 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-27 15:30' },
      { label: '等待付款', time: '2026-02-27 15:30', desc: '请在24小时内完成支付' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308013': {
    orderId: 'order-20260308013',
    status: 'ORDER_SHIPMENT',
    farmName: '新五丰·广东肇庆场',
    pigTypeName: '育肥猪',
    weightRange: '110-125kg',
    quantity: 190,
    price: 16.1,
    priceInfo: {
      depositAmount: 35000,
      goodsAmount: 270900,
      totalAmount: 305900,
    },
    deliveryInfo: {
      contactName: '罗主管',
      contactPhone: '0758-6666-2211',
      address: '广东省 肇庆市 端州区 星湖大道 88 号',
      deliveryTime: '2026-02-28 14:00-18:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-26 09:20' },
      { label: '支付完成', time: '2026-02-26 10:05' },
      { label: '等待发货', time: '2026-02-26 10:20', desc: '场点正在安排装猪' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308014': {
    orderId: 'order-20260308014',
    status: 'ORDER_RECEIPT',
    farmName: '湘佳股份·湖南常德场',
    pigTypeName: '中猪',
    weightRange: '90-105kg',
    quantity: 120,
    price: 15.0,
    priceInfo: {
      depositAmount: 18000,
      goodsAmount: 162000,
      totalAmount: 180000,
    },
    deliveryInfo: {
      contactName: '田主管',
      contactPhone: '0736-3322-1199',
      address: '湖南省 常德市 武陵区 洞庭大道 66 号',
      deliveryTime: '2026-02-27 08:30-12:00',
    },
    shipmentInfo: {
      driverName: '许师傅',
      driverPhone: '138-2222-3344',
      vehicleNo: '湘J·33210',
      estimatedArrival: '2026-02-27 10:20',
      remark: '预计准时到达',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-25 14:10' },
      { label: '支付完成', time: '2026-02-25 15:00' },
      { label: '已发货', time: '2026-02-26 07:30' },
      { label: '等待收货', time: '2026-02-26 07:30', desc: '司机已出发' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308015': {
    orderId: 'order-20260308015',
    status: 'ORDER_COMPLETED',
    farmName: '雏鹰农牧·河南许昌场',
    pigTypeName: '大猪',
    weightRange: '120-140kg',
    quantity: 95,
    price: 16.3,
    priceInfo: {
      depositAmount: 18000,
      goodsAmount: 136850,
      totalAmount: 154850,
    },
    deliveryInfo: {
      contactName: '郭主管',
      contactPhone: '0374-8899-1166',
      address: '河南省 许昌市 魏都区 建安大道 120 号',
      deliveryTime: '2026-02-26 09:00-12:00',
    },
    shipmentInfo: {
      driverName: '彭师傅',
      driverPhone: '136-3333-8811',
      vehicleNo: '豫K·66770',
      estimatedArrival: '2026-02-26 11:40',
      remark: '已完成卸货',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-24 11:45' },
      { label: '支付完成', time: '2026-02-24 12:20' },
      { label: '已发货', time: '2026-02-24 18:30' },
      { label: '确认收货', time: '2026-02-25 10:20' },
      { label: '订单完成', time: '2026-02-25 10:35' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308016': {
    orderId: 'order-20260308016',
    status: 'ORDER_CANCELLED',
    farmName: '京基智农·广东惠州场',
    pigTypeName: '育肥猪',
    weightRange: '105-125kg',
    quantity: 110,
    price: 15.2,
    priceInfo: {
      depositAmount: 12000,
      goodsAmount: 155200,
      totalAmount: 167200,
    },
    deliveryInfo: {
      contactName: '孔主管',
      contactPhone: '0752-8888-5511',
      address: '广东省 惠州市 惠城区 东江大道 66 号',
      deliveryTime: '2026-02-25 09:00-12:00',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-23 16:50' },
      { label: '订单取消', time: '2026-02-23 17:10', desc: '订单已取消，可重新下单' },
    ],
    contractName: '2026春季竞拍合同',
  },
  'order-20260308017': {
    orderId: 'order-20260308017',
    status: 'ORDER_COMPLETED',
    farmName: '神农集团·云南玉溪场',
    pigTypeName: '育肥猪',
    weightRange: '105-120kg',
    quantity: 135,
    price: 15.8,
    priceInfo: {
      depositAmount: 22000,
      goodsAmount: 191300,
      totalAmount: 213300,
    },
    deliveryInfo: {
      contactName: '康主管',
      contactPhone: '0877-6677-8899',
      address: '云南省 玉溪市 红塔区 珊瑚路 99 号',
      deliveryTime: '2026-02-24 09:00-12:00',
    },
    shipmentInfo: {
      driverName: '袁师傅',
      driverPhone: '137-7777-3322',
      vehicleNo: '云F·22018',
      estimatedArrival: '2026-02-24 11:05',
      remark: '已完成卸货',
    },
    timeline: [
      { label: '订单创建', time: '2026-02-22 10:05' },
      { label: '支付完成', time: '2026-02-22 10:30' },
      { label: '已发货', time: '2026-02-22 15:30' },
      { label: '确认收货', time: '2026-02-23 10:40' },
      { label: '订单完成', time: '2026-02-23 10:55' },
    ],
    contractName: '2026春季竞拍合同',
  },
};

/** 获取订单列表 */
export async function getOrderList(params: ListRequestParams & {
  status?: OrderListStatus;
}): Promise<ApiResponse<ListResponseData<OrderListItem>>> {
  const result = await request<ListResponseData<OrderListItem>>('/v1/weixincustomer/getOrderList', params);
  if (result.errcode === 0 && result.data) return result;

  const status = params.status && params.status !== 'ALL' ? params.status : undefined;
  const records = status ? MOCK_ORDER_LIST.filter(item => item.status === status) : MOCK_ORDER_LIST;
  return { errcode: 0, errmsg: '', data: buildListResponse(params, records) };
}

/** 获取订单详情 */
export async function getOrderDetail(params: { orderId: string }): Promise<ApiResponse<OrderDetailInfo>> {
  const result = await request<OrderDetailInfo>('/v1/weixincustomer/getOrderDetail', params);
  if (result.errcode === 0 && result.data) return result;
  const fallback = MOCK_ORDER_DETAIL[params.orderId] || Object.values(MOCK_ORDER_DETAIL)[0];
  return { errcode: 0, errmsg: '', data: fallback };
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
