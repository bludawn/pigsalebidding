
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
  bidStatus: BidStatus;
  bidStartTime: string;
  customerBidStatus?: MyBidStatus;
}

/** 竞价状态 */
export type BidStatus = 'WAITING' | 'BIDDING' | 'ENDED';

/** 订单状态枚举（用于数量统计） */
export type OrderStatus = 'ORDER_PAYMENT' | 'ORDER_SHIPMENT' | 'ORDER_RECEIPT' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED';

/** 订单列表状态 */
export type OrderListStatus = OrderStatus | 'ALL';

/** 我的竞拍状态  BIDDING 竞拍中，BID_SUCCESS 竞拍成功，BID_FAILED 竞拍失败，NO_BID 没有竞拍  */
export type MyBidStatus = 'BIDDING' | 'BID_SUCCESS' | 'BID_FAILED' | 'NO_BID';

/** 个人信息 */
export interface UserProfile {
  userId: string;
  name: string;
  avatar: string;
  depositTag: string;
  companyName: string;
}

/** 我的订单数量 */
export interface OrderCounts {
  paymentCount: number;
  shipmentCount: number;
  receiptCount: number;
  completedCount: number;
  cancelledCount: number;
  allCount: number;
  myBidCount: number;
}

/** 订单列表项 */
export interface OrderListItem {
  orderId: string;
  status: OrderStatus;
  farmName: string;
  pigTypeName: string;
  weightRange: string;
  quantity: number;
  price: number;
  totalAmount: number;
  createdAt: string;
}

/** 价格明细 */
export interface OrderPriceInfo {
  depositAmount: number;
  goodsAmount: number;
  freightAmount?: number;
  totalAmount: number;
}

/** 收货/提货信息 */
export interface OrderDeliveryInfo {
  contactName: string;
  contactPhone: string;
  address: string;
  deliveryTime?: string;
  longitude?: string;
  latitude?: string;
}

/** 物流信息 */
export interface OrderShipmentInfo {
  currentLongitude?: string;
  currentLatitude?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNo?: string;
  estimatedArrival?: string;
  remark?: string;
}

/** 订单时间线 */
export interface OrderTimelineNode {
  label: string;
  time?: string;
  desc?: string;
}

/** 订单详情 */
export interface OrderDetailInfo {
  orderId: string;
  status: OrderStatus;
  farmName: string;
  farmAddress?: string;
  farmLongitude?: string;
  farmLatitude?: string;
  pigTypeName: string;
  weightRange: string;
  quantity: number;
  price: number;
  priceInfo: OrderPriceInfo;
  deliveryInfo: OrderDeliveryInfo;
  deliveryInfos: OrderShipmentInfo[];
  timeline: OrderTimelineNode[];
  contractName?: string;
}

/** 总资产 */
export interface AssetSummary {
  depositAmount: number;
  goodsAmount: number;
  totalBalance: number;
}

/** 数据统计 */
export interface BusinessStats {
  totalTradeAmount: number;
  totalPurchaseCount: number;
}

/** 联系我们 */
export interface ContactInfo {
  phone: string;
  address: string;
  wechatQrCodeUrl: string;
}

/** 地址信息 */
export interface AddressItem {
  id: string;
  contactName: string;
  contactPhone: string;
  regionCode: string;
  regionName: string;
  detailAddress: string;
  longitude?: string;
  latitude?: string;
  isDefault: boolean;
  updatedAt?: string;
}

/** 我的竞拍列表项 */
export interface MyBidItem {
  id: string;
  auctionId: string;
  farmId: string;
  farmName: string;
  farmIcon: string;
  breed: string;
  quantity: number;
  weightRange: string;
  tags: string[];
  startingPrice: number;
  startingCount: number;
  endTime: Date;
  imageUrl: string;
  bidStatus: MyBidStatus;
  bidStartTime?: string;
}

/** 我的竞拍状态数量 */
export interface MyBidStatusCounts {
  biddingCount: number;
  successCount: number;
  failedCount: number;
}

/** 竞价详情数据 */
export interface AuctionDetailInfo {
  id: string;
  mediaUrls: string[];
  endCountdownSeconds: number;
  productTags: string[];
  pigTypeName: string;
  weightRanges: string[];
  farmName: string;
  price: string;
  remark: string;
  startingCount: number;
  bidStep: number;
  addPrice: number;
  quantity: number;
  quarantineRegion: string;
  invoiceScope: string;
  deliverySupport: string;
  feedQuality: string;
  epidemicStatus: string;
  biddingNotice: string;
  bidStatus: BidStatus;
  bidStartTime: string;
  customerBidStatus: MyBidStatus;
}

/** 竞价维护信息 */
export interface AuctionMaintenanceInfo {
  auctionId: string;
  addressId: string;
  contactName: string;
  contactPhone: string;
  regionName: string;
  detailAddress: string;
  appointmentTime: string;
  remark?: string;
  updatedAt?: string;
}

/** 出价明细 */
export interface BidRecordItem {
  id: string;
  customerName: string;
  price: number;
  quantity: number;
  time: string;
  isCurrentCustomer?: boolean;
  isCancelled?: boolean;
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

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export interface CompanyVerificationInfo {
  status: VerificationStatus;
  companyName?: string;
  licenseUrls: string[];
  materialUrls: string[];
}

export interface PersonalVerificationInfo {
  status: VerificationStatus;
  wechatName?: string;
  verifiedAt?: string;
}

export interface UserSettingsProfile {
  userId: string;
  phone: string;
  name: string;
  avatar: string;
  companyVerification: CompanyVerificationInfo;
  personalVerification: PersonalVerificationInfo;
}

/** 筛选条件状态 */
export interface FilterState {
  bidStatus?: BidStatus;
  farmId?: string;
  farmName?: string;
  regionCode?: string;
  regionName?: string;
  weightRange?: string;
  tags?: string[];
  date?: string;
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
