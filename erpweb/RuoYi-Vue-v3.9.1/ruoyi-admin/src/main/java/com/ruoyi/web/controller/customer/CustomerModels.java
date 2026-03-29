package com.ruoyi.web.controller.customer;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 微信客户接口 DTO/VO
 */
public class CustomerModels
{
    public static class ListRequestParams
    {
        public Integer current;
        public Integer size;
        public Boolean searchCount;
        public String search;
    }

    public static class ListResponseData<T>
    {
        public Long current;
        public Long size;
        public Long total;
        public Long pages;
        public List<T> records;
    }

    public static class FarmListRequest
    {
        public String regionCode;
    }

    public static class RegionListRequest
    {
        public String parentCode;
    }

    public static class AuctionListParams extends ListRequestParams
    {
        public String bidStatus;
        public String farmId;
        public String regionCode;
        public String weightRange;
        public List<String> tags;
        public String date;
        public String distance;
    }

    public static class MyBidListParams extends ListRequestParams
    {
        public String status;
    }

    public static class AuctionIdRequest
    {
        public String auctionId;
    }

    public static class AuctionMaintenanceSaveRequest
    {
        public String auctionId;
        public String addressId;
        public String appointmentTime;
        public String remark;
    }

    public static class BidRecordsRequest extends ListRequestParams
    {
        public String auctionId;
        public Boolean isMine;
    }

    public static class SubmitBidRequest
    {
        public String auctionId;
        public BigDecimal bidPrice;
        public Integer bidCount;
    }

    public static class CancelBidRequest
    {
        public String auctionId;
        public String bidRecordId;
    }

    public static class SaveUserProfileRequest
    {
        public String name;
        public String avatar;
    }

    public static class SubmitCompanyVerificationRequest
    {
        public List<String> licenseUrls;
        public List<String> materialUrls;
    }

    public static class AddressIdRequest
    {
        public String id;
    }

    public static class AddressCreateRequest
    {
        public String contactName;
        public String contactPhone;
        public String regionCode;
        public String regionName;
        public String detailAddress;
        public String longitude;
        public String latitude;
        public Boolean isDefault;
    }

    public static class OrderDetailRequest
    {
        public String orderId;
    }

    public static class OrderListRequest extends ListRequestParams
    {
        public String status;
    }

    public static class OrderActionRequest
    {
        public String orderId;
    }

    public static class FarmItem
    {
        public String id;
        public String name;
        public String regionCode;
    }

    public static class ProductTagItem
    {
        public String id;
        public String name;
    }

    public static class RegionItem
    {
        public String code;
        public String name;
        public Integer level;
        public List<RegionItem> children;
    }

    public static class AuctionItem
    {
        public String id;
        public String farmId;
        public String farmName;
        public String farmIcon;
        public String breed;
        public Integer quantity;
        public String weightRange;
        public List<String> tags;
        public BigDecimal startingPrice;
        public Integer startingCount;
        public Date endTime;
        public String imageUrl;
        public String bidStatus;
        public String bidStartTime;
        public String customerBidStatus;
    }

    public static class MyBidItem
    {
        public String id;
        public String auctionId;
        public String farmId;
        public String farmName;
        public String farmIcon;
        public String breed;
        public Integer quantity;
        public String weightRange;
        public List<String> tags;
        public BigDecimal startingPrice;
        public Integer startingCount;
        public Date endTime;
        public String imageUrl;
        public String bidStatus;
        public String bidStartTime;
    }

    public static class MyBidStatusCounts
    {
        public Integer biddingCount;
        public Integer successCount;
        public Integer failedCount;
    }

    public static class AuctionDetailInfo
    {
        public String id;
        public List<String> mediaUrls;
        public Long endCountdownSeconds;
        public List<String> productTags;
        public String pigTypeName;
        public List<String> weightRanges;
        public String farmName;
        public String price;
        public String remark;
        public Integer startingCount;
        public BigDecimal bidStep;
        public BigDecimal addPrice;
        public Integer quantity;
        public String quarantineRegion;
        public String invoiceScope;
        public String deliverySupport;
        public String feedQuality;
        public String epidemicStatus;
        public String biddingNotice;
        public String bidStatus;
        public String bidStartTime;
        public String customerBidStatus;
    }

    public static class AuctionMaintenanceInfo
    {
        public String auctionId;
        public String addressId;
        public String contactName;
        public String contactPhone;
        public String regionName;
        public String detailAddress;
        public String appointmentTime;
        public String remark;
        public String updatedAt;
    }

    public static class BidRecordItem
    {
        public String id;
        public String customerName;
        public BigDecimal price;
        public Integer quantity;
        public String time;
        public Boolean isCurrentCustomer;
        public Boolean isCancelled;
    }

    public static class UserInfo
    {
        public String userId;
        public String nickname;
        public String avatar;
        public Integer vipLevel;
        public Integer collectCount;
        public Integer footprintCount;
        public Integer points;
        public Integer coupons;
        public BigDecimal totalAssets;
    }

    public static class UserProfile
    {
        public String userId;
        public String name;
        public String avatar;
        public String depositTag;
        public String companyName;
    }

    public static class UserSettingsProfile
    {
        public String userId;
        public String phone;
        public String name;
        public String avatar;
        public CompanyVerificationInfo companyVerification;
        public PersonalVerificationInfo personalVerification;
    }

    public static class CompanyVerificationInfo
    {
        public String status;
        public String companyName;
        public List<String> licenseUrls;
        public List<String> materialUrls;
    }

    public static class PersonalVerificationInfo
    {
        public String status;
        public String wechatName;
        public String verifiedAt;
    }

    public static class OrderCounts
    {
        public Integer paymentCount;
        public Integer shipmentCount;
        public Integer receiptCount;
        public Integer completedCount;
        public Integer cancelledCount;
        public Integer allCount;
        public Integer myBidCount;
    }

    public static class OrderStats
    {
        public Integer unpaid;
        public Integer unshipped;
        public Integer unreceived;
        public Integer unevaluated;
        public Integer afterSale;
    }

    public static class OrderListItem
    {
        public String orderId;
        public String status;
        public String farmName;
        public String pigTypeName;
        public String weightRange;
        public Integer quantity;
        public BigDecimal price;
        public BigDecimal totalAmount;
        public String createdAt;
    }

    public static class OrderPriceInfo
    {
        public BigDecimal depositAmount;
        public BigDecimal goodsAmount;
        public BigDecimal freightAmount;
        public BigDecimal totalAmount;
    }

    public static class OrderDeliveryInfo
    {
        public String contactName;
        public String contactPhone;
        public String address;
        public String deliveryTime;
    }

    public static class OrderShipmentInfo
    {
        public String transportCode;
        public String currentLongitude;
        public String currentLatitude;
        public String driverName;
        public String driverPhone;
        public String vehicleNo;
        public String vehicleType;
        public Integer loadCount;
        public String deliveryStatus;
        public String estimatedArrival;
        public String remark;
    }

    public static class OrderTimelineNode
    {
        public String label;
        public String time;
        public String desc;
    }

    public static class OrderDetailInfo
    {
        public String orderId;
        public String status;
        public String farmName;
        public String farmAddress;
        public String pigTypeName;
        public String weightRange;
        public Integer quantity;
        public BigDecimal price;
        public OrderPriceInfo priceInfo;
        public OrderDeliveryInfo deliveryInfo;
        public List<OrderShipmentInfo> deliveryInfos;
        public List<OrderTimelineNode> timeline;
        public String contractName;
    }

    public static class AssetSummary
    {
        public BigDecimal depositAmount;
        public BigDecimal goodsAmount;
        public BigDecimal totalBalance;
    }

    public static class BusinessStats
    {
        public BigDecimal totalTradeAmount;
        public Integer totalPurchaseCount;
    }

    public static class ContactInfo
    {
        public String phone;
        public String address;
        public String wechatQrCodeUrl;
    }

    public static class AddressItem
    {
        public String id;
        public String contactName;
        public String contactPhone;
        public String regionCode;
        public String regionName;
        public String detailAddress;
        public String longitude;
        public String latitude;
        public Boolean isDefault;
        public String updatedAt;
    }

    public static class AccountBalance
    {
        public BigDecimal totalBalance;
        public BigDecimal availableBalance;
        public BigDecimal frozenAmount;
    }

    public static class TransactionItem
    {
        public String type;
        public String time;
        public BigDecimal amount;
        public String icon;
        public Boolean isPositive;
    }

    public static class SimpleResult
    {
        public Boolean success;
        public String bidId;
    }
}
