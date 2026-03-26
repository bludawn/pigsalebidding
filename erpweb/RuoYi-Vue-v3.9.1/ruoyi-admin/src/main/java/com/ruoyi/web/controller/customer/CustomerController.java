package com.ruoyi.web.controller.customer;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.file.FileUploadUtils;
import com.ruoyi.framework.config.ServerConfig;
import com.ruoyi.system.domain.pig.Address;
import com.ruoyi.system.domain.pig.BidProduct;
import com.ruoyi.system.domain.pig.DeliveryInfo;
import com.ruoyi.system.domain.pig.Enterprise;
import com.ruoyi.system.domain.pig.PigOrder;
import com.ruoyi.system.domain.pig.PigResource;
import com.ruoyi.system.domain.pig.PigTag;
import com.ruoyi.system.domain.pig.PigType;
import com.ruoyi.system.domain.pig.Site;
import com.ruoyi.system.domain.pig.UserBid;
import com.ruoyi.system.domain.pig.UserBidInfo;
import com.ruoyi.system.domain.pig.UserExt;
import com.ruoyi.system.service.ISysUserService;
import com.ruoyi.system.service.pig.IAddressService;
import com.ruoyi.system.service.pig.IBidProductService;
import com.ruoyi.system.service.pig.IDeliveryInfoService;
import com.ruoyi.system.service.pig.IEnterpriseService;
import com.ruoyi.system.service.pig.IPigOrderService;
import com.ruoyi.system.service.pig.IPigResourceService;
import com.ruoyi.system.service.pig.IPigTagService;
import com.ruoyi.system.service.pig.IPigTypeService;
import com.ruoyi.system.service.pig.ISiteService;
import com.ruoyi.system.service.pig.IUserBidInfoService;
import com.ruoyi.system.service.pig.IUserBidService;
import com.ruoyi.system.service.pig.IUserExtService;
import com.ruoyi.web.controller.customer.CustomerModels.*;

/**
 * 微信客户接口统一入口
 */
@RestController
@RequestMapping("/api/v1/weixincustomer")
public class CustomerController extends BaseController
{
    @Autowired
    private ISiteService siteService;

    @Autowired
    private IPigTagService pigTagService;

    @Autowired
    private IBidProductService bidProductService;

    @Autowired
    private IPigResourceService pigResourceService;

    @Autowired
    private IPigTypeService pigTypeService;

    @Autowired
    private IUserBidService userBidService;

    @Autowired
    private IUserBidInfoService userBidInfoService;

    @Autowired
    private IAddressService addressService;

    @Autowired
    private ISysUserService sysUserService;

    @Autowired
    private IUserExtService userExtService;

    @Autowired
    private IEnterpriseService enterpriseService;

    @Autowired
    private IPigOrderService pigOrderService;

    @Autowired
    private IDeliveryInfoService deliveryInfoService;

    @Autowired
    private ServerConfig serverConfig;

    @PostMapping("/getFarmList")
//    @PostAuthorize("@ss.hasPermi('pig:weixincustomer:getFarmList')")
    public CustomerApiResult<List<FarmItem>> getFarmList(@RequestBody(required = false) FarmListRequest request)
    {
        Site query = new Site();
        if (request != null && StringUtils.isNotEmpty(request.regionCode))
        {
            query.setSiteAddressCode(request.regionCode);
        }
        List<Site> sites = siteService.selectSiteList(query);
        List<FarmItem> farms = sites.stream().map(site -> {
            FarmItem item = new FarmItem();
            item.id = String.valueOf(site.getId());
            item.name = site.getSiteName();
            item.regionCode = site.getSiteAddressCode();
            return item;
        }).collect(Collectors.toList());
        return ok(farms);
    }

    @PostMapping("/getProductTags")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getProductTags')")
    public CustomerApiResult<List<ProductTagItem>> getProductTags()
    {
        List<PigTag> tags = pigTagService.selectPigTagList(new PigTag());
        List<ProductTagItem> result = tags.stream().map(tag -> {
            ProductTagItem item = new ProductTagItem();
            item.id = String.valueOf(tag.getId());
            item.name = tag.getTagName();
            return item;
        }).collect(Collectors.toList());
        return ok(result);
    }

    @PostMapping("/getRegionList")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getRegionList')")
    public CustomerApiResult<List<RegionItem>> getRegionList(@RequestBody(required = false) RegionListRequest request)
    {
        return ok(Collections.emptyList());
    }

    @PostMapping("/getAuctionList")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAuctionList')")
    public CustomerApiResult<ListResponseData<AuctionItem>> getAuctionList(@RequestBody(required = false) AuctionListParams params)
    {
        int current = getPageCurrent(params);
        int size = getPageSize(params);
        PageHelper.startPage(current, size);
        BidProduct query = new BidProduct();
        if (params != null && StringUtils.isNotEmpty(params.bidStatus))
        {
            query.setBidStatus(params.bidStatus);
        }
        if (params != null && StringUtils.isNotEmpty(params.farmId))
        {
            query.setSiteId(toLong(params.farmId));
        }
        List<BidProduct> list = bidProductService.selectBidProductList(query);
        PageInfo<BidProduct> pageInfo = new PageInfo<BidProduct>(list);
        List<AuctionItem> records = list.stream().map(this::buildAuctionItem).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/getMyBidList")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getMyBidList')")
    public CustomerApiResult<ListResponseData<MyBidItem>> getMyBidList(@RequestBody(required = false) MyBidListParams params)
    {
        int current = getPageCurrent(params);
        int size = getPageSize(params);
        PageHelper.startPage(current, size);
        UserBid query = new UserBid();
        query.setUserId(getUserId());
        if (params != null && StringUtils.isNotEmpty(params.status))
        {
            query.setStatus(params.status);
        }
        List<UserBid> list = userBidService.selectUserBidList(query);
        PageInfo<UserBid> pageInfo = new PageInfo<UserBid>(list);
        List<MyBidItem> records = list.stream().map(this::buildMyBidItem).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/getMyBidStatusCounts")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getMyBidStatusCounts')")
    public CustomerApiResult<MyBidStatusCounts> getMyBidStatusCounts()
    {
        UserBid query = new UserBid();
        query.setUserId(getUserId());
        List<UserBid> list = userBidService.selectUserBidList(query);
        MyBidStatusCounts counts = new MyBidStatusCounts();
        counts.biddingCount = (int) list.stream().filter(bid -> "BIDDING".equalsIgnoreCase(bid.getStatus())).count();
        counts.successCount = (int) list.stream().filter(bid -> "BID_SUCCESS".equalsIgnoreCase(bid.getStatus()) || "SUCCESS".equalsIgnoreCase(bid.getStatus())).count();
        counts.failedCount = (int) list.stream().filter(bid -> "BID_FAILED".equalsIgnoreCase(bid.getStatus()) || "FAILED".equalsIgnoreCase(bid.getStatus())).count();
        return ok(counts);
    }

    @PostMapping("/getAuctionDetail")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAuctionDetail')")
    public CustomerApiResult<AuctionDetailInfo> getAuctionDetail(@RequestBody AuctionIdRequest request)
    {
        BidProduct bidProduct = bidProductService.selectBidProductById(toLong(request.auctionId));
        if (bidProduct == null)
        {
            return ok(null);
        }
        PigResource resource = pigResourceService.selectPigResourceById(bidProduct.getPigResourceId());
        PigType pigType = resource != null ? pigTypeService.selectPigTypeById(resource.getPigTypeId()) : null;
        Site site = bidProduct.getSiteId() != null ? siteService.selectSiteById(bidProduct.getSiteId()) : null;
        AuctionDetailInfo info = new AuctionDetailInfo();
        info.id = String.valueOf(bidProduct.getId());
        info.mediaUrls = mergeMediaUrls(pigType);
        info.endCountdownSeconds = calcRemainSeconds(bidProduct.getEndTime());
        info.productTags = resolveTagNames(pigType);
        info.pigTypeName = pigType != null ? pigType.getPigName() : null;
        info.weightRanges = splitToList(pigType != null ? pigType.getWeightRange() : null);
        info.farmName = site != null ? site.getSiteName() : null;
        info.price = bidProduct.getCurrentHighestPrice() != null ? bidProduct.getCurrentHighestPrice().toPlainString() : toStr(bidProduct.getStartPrice());
        info.remark = bidProduct.getRemark();
        info.startingCount = bidProduct.getStartBidCount();
        info.bidStep = bidProduct.getPriceStep();
        info.addPrice = bidProduct.getAddPrice();
        info.quantity = bidProduct.getTotalHeadCount();
        info.quarantineRegion = pigType != null ? pigType.getDiseaseFreeRegion() : null;
        info.invoiceScope = "";
        info.deliverySupport = "";
        info.feedQuality = pigType != null ? pigType.getFeedQuality() : null;
        info.epidemicStatus = pigType != null ? pigType.getEpidemicStatus() : null;
        info.biddingNotice = bidProduct.getBidNotice();
        info.bidStatus = bidProduct.getBidStatus();
        info.bidStartTime = formatDate(bidProduct.getStartTime());
        info.customerBidStatus = resolveMyBidStatus(getUserId(), bidProduct.getId());
        return ok(info);
    }

    @PostMapping("/getAuctionMaintenance")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAuctionMaintenance')")
    public CustomerApiResult<AuctionMaintenanceInfo> getAuctionMaintenance(@RequestBody AuctionIdRequest request)
    {
        UserBidInfo query = new UserBidInfo();
        query.setUserId(getUserId());
        query.setBidProductId(toLong(request.auctionId));
        List<UserBidInfo> list = userBidInfoService.selectUserBidInfoList(query);
        if (list.isEmpty())
        {
            return ok(null);
        }
        UserBidInfo info = list.get(0);
        Address address = info.getAddressId() != null ? addressService.selectAddressById(info.getAddressId()) : null;
        AuctionMaintenanceInfo result = new AuctionMaintenanceInfo();
        result.auctionId = request.auctionId;
        result.addressId = info.getAddressId() != null ? String.valueOf(info.getAddressId()) : null;
        result.contactName = address != null ? address.getContactName() : null;
        result.contactPhone = address != null ? address.getContactPhone() : null;
        result.regionName = address != null ? address.getAddressCode() : null;
        result.detailAddress = address != null ? address.getDetailAddress() : null;
        result.appointmentTime = formatDate(info.getLoadingTime());
        result.remark = info.getRemark();
        result.updatedAt = formatDate(info.getUpdateTime());
        return ok(result);
    }

    @PostMapping("/saveAuctionMaintenance")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:saveAuctionMaintenance')")
    public CustomerApiResult<AuctionMaintenanceInfo> saveAuctionMaintenance(@RequestBody AuctionMaintenanceSaveRequest request)
    {
        UserBidInfo query = new UserBidInfo();
        query.setUserId(getUserId());
        query.setBidProductId(toLong(request.auctionId));
        List<UserBidInfo> list = userBidInfoService.selectUserBidInfoList(query);
        UserBidInfo info = list.isEmpty() ? new UserBidInfo() : list.get(0);
        info.setUserId(getUserId());
        info.setBidProductId(toLong(request.auctionId));
        info.setAddressId(toLong(request.addressId));
        info.setLoadingTime(DateUtils.parseDate(request.appointmentTime));
        info.setRemark(request.remark);
        if (info.getId() == null)
        {
            info.setCreateBy(String.valueOf(getUserId()));
            userBidInfoService.insertUserBidInfo(info);
        }
        else
        {
            info.setUpdateBy(String.valueOf(getUserId()));
            userBidInfoService.updateUserBidInfo(info);
        }
        AuctionMaintenanceInfo result = new AuctionMaintenanceInfo();
        Address address = info.getAddressId() != null ? addressService.selectAddressById(info.getAddressId()) : null;
        result.auctionId = request.auctionId;
        result.addressId = request.addressId;
        result.contactName = address != null ? address.getContactName() : null;
        result.contactPhone = address != null ? address.getContactPhone() : null;
        result.regionName = address != null ? address.getAddressCode() : null;
        result.detailAddress = address != null ? address.getDetailAddress() : null;
        result.appointmentTime = request.appointmentTime;
        result.remark = request.remark;
        result.updatedAt = DateUtils.getTime();
        return ok(result);
    }

    @PostMapping("/getBidRecords")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getBidRecords')")
    public CustomerApiResult<ListResponseData<BidRecordItem>> getBidRecords(@RequestBody BidRecordsRequest request)
    {
        int current = getPageCurrent(request);
        int size = getPageSize(request);
        PageHelper.startPage(current, size);
        UserBid query = new UserBid();
        query.setBidProductId(toLong(request.auctionId));
        if (Boolean.TRUE.equals(request.isMine))
        {
            query.setUserId(getUserId());
        }
        List<UserBid> list = userBidService.selectUserBidList(query);
        PageInfo<UserBid> pageInfo = new PageInfo<UserBid>(list);
        List<BidRecordItem> records = list.stream().map(bid -> {
            BidRecordItem item = new BidRecordItem();
            item.id = String.valueOf(bid.getId());
            // TODO 通过用户 获取企业名称
            item.customerName = String.valueOf("客户" + bid.getUserId());
            item.price = bid.getPrice();
            item.quantity = bid.getQuantity();
            item.time = formatDate(bid.getBidTime());
            item.isCurrentCustomer = bid.getUserId() != null && bid.getUserId().equals(getUserId());
            item.isCancelled = StringUtils.isNotEmpty(bid.getStatus()) && bid.getStatus().toUpperCase().contains("CANCEL");
            return item;
        }).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/submitBid")
//    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:submitBid')")
    public CustomerApiResult<SimpleResult> submitBid(@RequestBody SubmitBidRequest request)
    {
        UserBid bid = new UserBid();
        bid.setUserId(getUserId());
        bid.setBidProductId(toLong(request.auctionId));
        bid.setPrice(request.bidPrice);
        bid.setQuantity(request.bidCount);
        bid.setBidTime(new Date());
        bid.setStatus("BIDDING");
        if (request.bidPrice != null && request.bidCount != null)
        {
            bid.setTotalPrice(request.bidPrice.multiply(new BigDecimal(request.bidCount)));
        }
        bid.setCreateBy(String.valueOf(getUserId()));
        userBidService.insertUserBid(bid);
        BidProduct product = bidProductService.selectBidProductById(toLong(request.auctionId));
        if (product != null && request.bidPrice != null)
        {
            if (product.getCurrentHighestPrice() == null || product.getCurrentHighestPrice().compareTo(request.bidPrice) < 0)
            {
                product.setCurrentHighestPrice(request.bidPrice);
                product.setUpdateBy(String.valueOf(getUserId()));
                bidProductService.updateBidProduct(product);
            }
        }
        SimpleResult result = new SimpleResult();
        result.success = true;
        result.bidId = bid.getId() != null ? String.valueOf(bid.getId()) : null;
        return ok(result);
    }

    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:cancelBidRecord')")
    @PostMapping("/cancelBidRecord")
    public CustomerApiResult<SimpleResult> cancelBidRecord(@RequestBody CancelBidRequest request)
    {
        UserBid bid = userBidService.selectUserBidById(toLong(request.bidRecordId));
        SimpleResult result = new SimpleResult();
        if (bid == null)
        {
            result.success = false;
            return ok(result);
        }
        bid.setStatus("CANCELED");
        bid.setUpdateBy(String.valueOf(getUserId()));
        userBidService.updateUserBid(bid);
        result.success = true;
        return ok(result);
    }

    @PostMapping("/getUserInfo")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getUserInfo')")
    public CustomerApiResult<UserInfo> getUserInfo()
    {
        SysUser user = sysUserService.selectUserById(getUserId());
        UserInfo info = new UserInfo();
        info.userId = String.valueOf(getUserId());
        info.nickname = user != null ? user.getNickName() : null;
        info.avatar = user != null ? user.getAvatar() : null;
        info.vipLevel = 0;
        info.collectCount = 0;
        info.footprintCount = 0;
        info.points = 0;
        info.coupons = 0;
        Enterprise enterprise = getEnterpriseByUser();
        info.totalAssets = enterprise != null ? safeAdd(enterprise.getDepositAmount(), enterprise.getPaymentAmount()) : BigDecimal.ZERO;
        return ok(info);
    }

    @PostMapping("/getProfileInfo")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getProfileInfo')")
    public CustomerApiResult<UserProfile> getProfileInfo()
    {
        SysUser user = sysUserService.selectUserById(getUserId());
        Enterprise enterprise = getEnterpriseByUser();
        UserProfile profile = new UserProfile();
        profile.userId = String.valueOf(getUserId());
        profile.name = user != null ? user.getNickName() : null;
        profile.avatar = user != null ? user.getAvatar() : null;
        profile.depositTag = enterprise != null && enterprise.getHasDeposit() != null && enterprise.getHasDeposit() == 1 ? "已缴纳" : "未缴纳";
        profile.companyName = enterprise != null ? enterprise.getEnterpriseName() : null;
        return ok(profile);
    }

    @PostMapping("/getUserSettings")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getUserSettings')")
    public CustomerApiResult<UserSettingsProfile> getUserSettings()
    {
        SysUser user = sysUserService.selectUserById(getUserId());
        UserExt userExt = userExtService.selectUserExtById(getUserId());
        Enterprise enterprise = getEnterpriseByUser();
        UserSettingsProfile profile = new UserSettingsProfile();
        profile.userId = String.valueOf(getUserId());
        profile.phone = user != null ? user.getPhonenumber() : null;
        profile.name = user != null ? user.getNickName() : null;
        profile.avatar = user != null ? user.getAvatar() : null;
        CompanyVerificationInfo companyInfo = new CompanyVerificationInfo();
        companyInfo.status = enterprise != null && enterprise.getIsVerified() != null && enterprise.getIsVerified() == 1 ? "VERIFIED" : "UNVERIFIED";
        companyInfo.companyName = enterprise != null ? enterprise.getEnterpriseName() : null;
        companyInfo.licenseUrls = splitToList(enterprise != null ? enterprise.getBusinessLicenseUrl() : null);
        companyInfo.materialUrls = splitToList(enterprise != null ? enterprise.getOtherMaterialUrls() : null);
        PersonalVerificationInfo personalInfo = new PersonalVerificationInfo();
        personalInfo.status = userExt != null && userExt.getIsRealName() != null && userExt.getIsRealName() == 1 ? "VERIFIED" : "UNVERIFIED";
        personalInfo.wechatName = user != null ? user.getNickName() : null;
        personalInfo.verifiedAt = userExt != null ? formatDate(userExt.getUpdateTime()) : null;
        profile.companyVerification = companyInfo;
        profile.personalVerification = personalInfo;
        return ok(profile);
    }

    @PostMapping("/uploadImage")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:uploadImage')")
    public CustomerApiResult<UploadImageResponse> uploadImage(MultipartFile file, String scene) throws Exception
    {
        String filePath = RuoYiConfig.getUploadPath();
        String fileName = FileUploadUtils.upload(filePath, file);
        String url = serverConfig.getUrl() + fileName;
        UploadImageResponse response = new UploadImageResponse();
        response.url = url;
        return ok(response);
    }

    @PostMapping("/saveUserProfile")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:saveUserProfile')")
    public CustomerApiResult<UserSettingsProfile> saveUserProfile(@RequestBody SaveUserProfileRequest request)
    {
        SysUser user = sysUserService.selectUserById(getUserId());
        if (user != null)
        {
            if (StringUtils.isNotEmpty(request.name))
            {
                user.setNickName(request.name);
            }
            if (StringUtils.isNotEmpty(request.avatar))
            {
                user.setAvatar(request.avatar);
            }
            sysUserService.updateUserProfile(user);
        }
        return getUserSettings();
    }

    @PostMapping("/submitCompanyVerification")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:submitCompanyVerification')")
    public CustomerApiResult<UserSettingsProfile> submitCompanyVerification(@RequestBody SubmitCompanyVerificationRequest request)
    {
        Enterprise enterprise = getEnterpriseByUser();
        if (enterprise != null)
        {
            enterprise.setBusinessLicenseUrl(joinList(request.licenseUrls));
            enterprise.setOtherMaterialUrls(joinList(request.materialUrls));
            enterprise.setIsVerified(0);
            enterprise.setUpdateBy(String.valueOf(getUserId()));
            enterpriseService.updateEnterprise(enterprise);
        }
        return getUserSettings();
    }

    @PostMapping("/verifyPersonalIdentity")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:verifyPersonalIdentity')")
    public CustomerApiResult<UserSettingsProfile> verifyPersonalIdentity()
    {
        UserExt userExt = userExtService.selectUserExtById(getUserId());
        if (userExt == null)
        {
            userExt = new UserExt();
            userExt.setId(getUserId());
            userExt.setIsRealName(1);
            userExtService.insertUserExt(userExt);
        }
        else
        {
            userExt.setIsRealName(1);
            userExt.setUpdateBy(String.valueOf(getUserId()));
            userExtService.updateUserExt(userExt);
        }
        return getUserSettings();
    }

    @PostMapping("/logout")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:logout')")
    public CustomerApiResult<SimpleResult> logout()
    {
        SimpleResult result = new SimpleResult();
        result.success = true;
        return ok(result);
    }

    @PostMapping("/getOrderCounts")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getOrderCounts')")
    public CustomerApiResult<OrderCounts> getOrderCounts()
    {
        List<PigOrder> orders = selectOrdersByUser();
        OrderCounts counts = new OrderCounts();
        counts.paymentCount = countOrderStatus(orders, "WAITING");
        counts.shipmentCount = countOrderStatus(orders, "PAID");
        counts.receiptCount = countOrderStatus(orders, "SHIPPED");
        counts.completedCount = countOrderStatus(orders, "COMPLETED");
        counts.cancelledCount = countOrderStatus(orders, "CANCELED");
        counts.allCount = orders.size();
        UserBid query = new UserBid();
        query.setUserId(getUserId());
        counts.myBidCount = userBidService.selectUserBidList(query).size();
        return ok(counts);
    }

    @PostMapping("/getAssetSummary")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAssetSummary')")
    public CustomerApiResult<AssetSummary> getAssetSummary()
    {
        Enterprise enterprise = getEnterpriseByUser();
        AssetSummary summary = new AssetSummary();
        summary.depositAmount = enterprise != null ? defaultZero(enterprise.getDepositAmount()) : BigDecimal.ZERO;
        summary.goodsAmount = enterprise != null ? defaultZero(enterprise.getPaymentAmount()) : BigDecimal.ZERO;
        summary.totalBalance = defaultZero(summary.depositAmount).add(defaultZero(summary.goodsAmount));
        return ok(summary);
    }

    @PostMapping("/getBusinessStats")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getBusinessStats')")
    public CustomerApiResult<BusinessStats> getBusinessStats()
    {
        BusinessStats stats = new BusinessStats();
        stats.totalTradeAmount = BigDecimal.ZERO;
        stats.totalPurchaseCount = 0;
        return ok(stats);
    }

    @PostMapping("/getContactInfo")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getContactInfo')")
    public CustomerApiResult<ContactInfo> getContactInfo()
    {
        ContactInfo info = new ContactInfo();
        info.phone = "";
        info.address = "";
        info.wechatQrCodeUrl = "";
        return ok(info);
    }

    @PostMapping("/getAddressList")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAddressList')")
    public CustomerApiResult<ListResponseData<AddressItem>> getAddressList(@RequestBody(required = false) ListRequestParams request)
    {
        int current = getPageCurrent(request);
        int size = getPageSize(request);
        PageHelper.startPage(current, size);
        Address query = new Address();
        query.setUserId(getUserId());
        List<Address> list = addressService.selectAddressList(query);
        PageInfo<Address> pageInfo = new PageInfo<Address>(list);
        List<AddressItem> records = list.stream().map(this::buildAddressItem).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/createAddress")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:createAddress')")
    public CustomerApiResult<AddressItem> createAddress(@RequestBody AddressCreateRequest request)
    {
        Address address = new Address();
        address.setUserId(getUserId());
        address.setContactName(request.contactName);
        address.setContactPhone(request.contactPhone);
        address.setAddressCode(request.regionCode);
        address.setDetailAddress(request.detailAddress);
        address.setIsDefault(Boolean.TRUE.equals(request.isDefault) ? 1 : 0);
        address.setCreateBy(String.valueOf(getUserId()));
        addressService.insertAddress(address);
        return ok(buildAddressItem(addressService.selectAddressById(address.getId())));
    }

    @PostMapping("/updateAddress")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:updateAddress')")
    public CustomerApiResult<SimpleResult> updateAddress(@RequestBody AddressItem request)
    {
        Address address = addressService.selectAddressById(toLong(request.id));
        SimpleResult result = new SimpleResult();
        if (address == null)
        {
            result.success = false;
            return ok(result);
        }
        address.setContactName(request.contactName);
        address.setContactPhone(request.contactPhone);
        address.setAddressCode(request.regionCode);
        address.setDetailAddress(request.detailAddress);
        address.setIsDefault(Boolean.TRUE.equals(request.isDefault) ? 1 : 0);
        address.setUpdateBy(String.valueOf(getUserId()));
        addressService.updateAddress(address);
        result.success = true;
        return ok(result);
    }

    @PostMapping("/deleteAddress")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:deleteAddress')")
    public CustomerApiResult<SimpleResult> deleteAddress(@RequestBody AddressIdRequest request)
    {
        SimpleResult result = new SimpleResult();
        int rows = addressService.deleteAddressById(toLong(request.id));
        result.success = rows > 0;
        return ok(result);
    }

    @PostMapping("/setDefaultAddress")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:setDefaultAddress')")
    public CustomerApiResult<SimpleResult> setDefaultAddress(@RequestBody AddressIdRequest request)
    {
        List<Address> list = addressService.selectAddressList(buildUserAddressQuery());
        for (Address address : list)
        {
            address.setIsDefault(address.getId().equals(toLong(request.id)) ? 1 : 0);
            address.setUpdateBy(String.valueOf(getUserId()));
            addressService.updateAddress(address);
        }
        SimpleResult result = new SimpleResult();
        result.success = true;
        return ok(result);
    }

    @PostMapping("/getDefaultAddress")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getDefaultAddress')")
    public CustomerApiResult<AddressItem> getDefaultAddress()
    {
        Address query = new Address();
        query.setUserId(getUserId());
        query.setIsDefault(1);
        List<Address> list = addressService.selectAddressList(query);
        if (list.isEmpty())
        {
            return ok(null);
        }
        return ok(buildAddressItem(list.get(0)));
    }

    @PostMapping("/getAccountBalance")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getAccountBalance')")
    public CustomerApiResult<AccountBalance> getAccountBalance()
    {
        AccountBalance balance = new AccountBalance();
        balance.totalBalance = BigDecimal.ZERO;
        balance.availableBalance = BigDecimal.ZERO;
        balance.frozenAmount = BigDecimal.ZERO;
        return ok(balance);
    }

    @PostMapping("/getTransactionList")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getTransactionList')")
    public CustomerApiResult<ListResponseData<TransactionItem>> getTransactionList(@RequestBody(required = false) ListRequestParams request)
    {
        int current = getPageCurrent(request);
        int size = getPageSize(request);
        PageHelper.startPage(current, size);
        UserBid query = new UserBid();
        query.setUserId(getUserId());
        List<UserBid> list = userBidService.selectUserBidList(query);
        PageInfo<UserBid> pageInfo = new PageInfo<UserBid>(list);
        List<TransactionItem> records = list.stream().map(bid -> {
            TransactionItem item = new TransactionItem();
            item.type = "出价";
            item.time = formatDate(bid.getBidTime());
            item.amount = bid.getTotalPrice();
            item.icon = "";
            item.isPositive = false;
            return item;
        }).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/getOrderStats")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getOrderStats')")
    public CustomerApiResult<OrderStats> getOrderStats()
    {
        List<PigOrder> orders = selectOrdersByUser();
        OrderStats stats = new OrderStats();
        stats.unpaid = countOrderStatus(orders, "WAITING");
        stats.unshipped = countOrderStatus(orders, "PAID");
        stats.unreceived = countOrderStatus(orders, "SHIPPED");
        stats.unevaluated = 0;
        stats.afterSale = 0;
        return ok(stats);
    }

    @PostMapping("/getOrderList")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getOrderList')")
    public CustomerApiResult<ListResponseData<OrderListItem>> getOrderList(@RequestBody(required = false) OrderListRequest request)
    {
        int current = getPageCurrent(request);
        int size = getPageSize(request);
        PageHelper.startPage(current, size);
        PigOrder query = new PigOrder();
        query.setCreateBy(String.valueOf(getUserId()));
        if (request != null && StringUtils.isNotEmpty(request.status) && !"ALL".equalsIgnoreCase(request.status))
        {
            query.setOrderStatus(mapOrderStatusToDb(request.status));
        }
        List<PigOrder> list = pigOrderService.selectPigOrderList(query);
        PageInfo<PigOrder> pageInfo = new PageInfo<PigOrder>(list);
        List<OrderListItem> records = list.stream().map(this::buildOrderListItem).collect(Collectors.toList());
        return ok(buildPage(records, pageInfo, current, size));
    }

    @PostMapping("/getOrderDetail")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:getOrderDetail')")
    public CustomerApiResult<OrderDetailInfo> getOrderDetail(@RequestBody OrderDetailRequest request)
    {
        PigOrder order = pigOrderService.selectPigOrderById(toLong(request.orderId));
        if (order == null)
        {
            return ok(null);
        }
        OrderDetailInfo detail = buildOrderDetailInfo(order);
        return ok(detail);
    }

    @PostMapping("/cancelOrder")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:cancelOrder')")
    public CustomerApiResult<SimpleResult> cancelOrder(@RequestBody OrderActionRequest request)
    {
        PigOrder order = pigOrderService.selectPigOrderById(toLong(request.orderId));
        SimpleResult result = new SimpleResult();
        if (order == null)
        {
            result.success = false;
            return ok(result);
        }
        order.setOrderStatus("CANCELED");
        order.setUpdateBy(String.valueOf(getUserId()));
        pigOrderService.updatePigOrder(order);
        result.success = true;
        return ok(result);
    }

    @PostMapping("/payOrder")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:payOrder')")
    public CustomerApiResult<SimpleResult> payOrder(@RequestBody OrderActionRequest request)
    {
        PigOrder order = pigOrderService.selectPigOrderById(toLong(request.orderId));
        SimpleResult result = new SimpleResult();
        if (order == null)
        {
            result.success = false;
            return ok(result);
        }
        order.setOrderStatus("PAID");
        order.setPayTime(new Date());
        order.setUpdateBy(String.valueOf(getUserId()));
        pigOrderService.updatePigOrder(order);
        result.success = true;
        return ok(result);
    }

    @PostMapping("/confirmReceipt")
    // @PreAuthorize("@ss.hasPermi('pig:weixincustomer:confirmReceipt')")
    public CustomerApiResult<SimpleResult> confirmReceipt(@RequestBody OrderActionRequest request)
    {
        PigOrder order = pigOrderService.selectPigOrderById(toLong(request.orderId));
        SimpleResult result = new SimpleResult();
        if (order == null)
        {
            result.success = false;
            return ok(result);
        }
        order.setOrderStatus("COMPLETED");
        order.setReceiveTime(new Date());
        order.setUpdateBy(String.valueOf(getUserId()));
        pigOrderService.updatePigOrder(order);
        result.success = true;
        return ok(result);
    }

    protected <T> CustomerApiResult<T> ok(T data)
    {
        return CustomerApiResult.success(data);
    }

    protected CustomerApiResult<Void> ok()
    {
        return CustomerApiResult.success();
    }

    protected <T> CustomerApiResult<T> fail(int errcode, String errmsg)
    {
        return CustomerApiResult.error(errcode, errmsg);
    }

    private AuctionItem buildAuctionItem(BidProduct bidProduct)
    {
        PigResource resource = bidProduct.getPigResourceId() != null ? pigResourceService.selectPigResourceById(bidProduct.getPigResourceId()) : null;
        PigType pigType = resource != null ? pigTypeService.selectPigTypeById(resource.getPigTypeId()) : null;
        Site site = bidProduct.getSiteId() != null ? siteService.selectSiteById(bidProduct.getSiteId()) : null;
        AuctionItem item = new AuctionItem();
        item.id = String.valueOf(bidProduct.getId());
        item.farmId = site != null ? String.valueOf(site.getId()) : null;
        item.farmName = site != null ? site.getSiteName() : null;
        item.farmIcon = site.getSiteImages() != null ? site.getSiteImages().split(",")[0] : "";
        item.breed = pigType != null ? pigType.getPigName() : null;
        item.quantity = bidProduct.getTotalHeadCount();
        item.weightRange = pigType != null ? pigType.getWeightRange() : null;
        item.tags = resolveTagNames(pigType);
        item.startingPrice = bidProduct.getCurrentHighestPrice();
        item.startingCount = bidProduct.getStartBidCount();
        item.endTime = bidProduct.getEndTime();
        item.imageUrl = firstImageUrl(pigType);
        item.bidStatus = bidProduct.getBidStatus();
        item.bidStartTime = formatDate(bidProduct.getStartTime());
        item.customerBidStatus = resolveMyBidStatus(getUserId(), bidProduct.getId());
        return item;
    }

    private MyBidItem buildMyBidItem(UserBid bid)
    {
        BidProduct bidProduct = bid.getBidProductId() != null ? bidProductService.selectBidProductById(bid.getBidProductId()) : null;
        PigResource resource = bidProduct != null ? pigResourceService.selectPigResourceById(bidProduct.getPigResourceId()) : null;
        PigType pigType = resource != null ? pigTypeService.selectPigTypeById(resource.getPigTypeId()) : null;
        Site site = bidProduct != null && bidProduct.getSiteId() != null ? siteService.selectSiteById(bidProduct.getSiteId()) : null;
        MyBidItem item = new MyBidItem();
        item.id = String.valueOf(bid.getId());
        item.auctionId = bidProduct != null ? String.valueOf(bidProduct.getId()) : null;
        item.farmId = site != null ? String.valueOf(site.getId()) : null;
        item.farmName = site != null ? site.getSiteName() : null;
        item.farmIcon = "";
        item.breed = pigType != null ? pigType.getPigName() : null;
        item.quantity = bidProduct != null ? bidProduct.getTotalHeadCount() : null;
        item.weightRange = pigType != null ? pigType.getWeightRange() : null;
        item.tags = resolveTagNames(pigType);
        item.startingPrice = bidProduct != null ? bidProduct.getStartPrice() : null;
        item.startingCount = bidProduct != null ? bidProduct.getStartBidCount() : null;
        item.endTime = bidProduct != null ? bidProduct.getEndTime() : null;
        item.imageUrl = firstImageUrl(pigType);
        item.bidStatus = resolveMyBidStatus(getUserId(), bid.getBidProductId());
        return item;
    }

    private AddressItem buildAddressItem(Address address)
    {
        if (address == null)
        {
            return null;
        }
        AddressItem item = new AddressItem();
        item.id = String.valueOf(address.getId());
        item.contactName = address.getContactName();
        item.contactPhone = address.getContactPhone();
        item.regionCode = address.getAddressCode();
        item.regionName = address.getAddressCode();
        item.detailAddress = address.getDetailAddress();
        item.isDefault = address.getIsDefault() != null && address.getIsDefault() == 1;
        item.updatedAt = formatDate(address.getUpdateTime());
        return item;
    }

    private OrderListItem buildOrderListItem(PigOrder order)
    {
        BidProduct bidProduct = order.getBidProductId() != null ? bidProductService.selectBidProductById(order.getBidProductId()) : null;
        PigResource resource = bidProduct != null ? pigResourceService.selectPigResourceById(bidProduct.getPigResourceId()) : null;
        PigType pigType = resource != null ? pigTypeService.selectPigTypeById(resource.getPigTypeId()) : null;
        Site site = bidProduct != null && bidProduct.getSiteId() != null ? siteService.selectSiteById(bidProduct.getSiteId()) : null;
        OrderListItem item = new OrderListItem();
        item.orderId = String.valueOf(order.getId());
        item.status = mapOrderStatus(order.getOrderStatus());
        item.farmName = site != null ? site.getSiteName() : null;
        item.pigTypeName = pigType != null ? pigType.getPigName() : null;
        item.weightRange = pigType != null ? pigType.getWeightRange() : null;
        item.quantity = bidProduct != null ? bidProduct.getTotalHeadCount() : null;
        item.price = bidProduct != null ? bidProduct.getCurrentHighestPrice() : null;
        item.totalAmount = order.getOrderAmount();
        item.createdAt = formatDate(order.getCreateTime());
        return item;
    }

    private OrderDetailInfo buildOrderDetailInfo(PigOrder order)
    {
        BidProduct bidProduct = order.getBidProductId() != null ? bidProductService.selectBidProductById(order.getBidProductId()) : null;
        PigResource resource = bidProduct != null ? pigResourceService.selectPigResourceById(bidProduct.getPigResourceId()) : null;
        PigType pigType = resource != null ? pigTypeService.selectPigTypeById(resource.getPigTypeId()) : null;
        Site site = bidProduct != null && bidProduct.getSiteId() != null ? siteService.selectSiteById(bidProduct.getSiteId()) : null;
        Address address = order.getAddressId() != null ? addressService.selectAddressById(order.getAddressId()) : null;
        DeliveryInfo delivery = resolveDeliveryInfo(order.getDeliveryInfoIds());
        OrderDetailInfo detail = new OrderDetailInfo();
        detail.orderId = String.valueOf(order.getId());
        detail.status = mapOrderStatus(order.getOrderStatus());
        detail.farmName = site != null ? site.getSiteName() : null;
        detail.pigTypeName = pigType != null ? pigType.getPigName() : null;
        detail.weightRange = pigType != null ? pigType.getWeightRange() : null;
        detail.quantity = bidProduct != null ? bidProduct.getTotalHeadCount() : null;
        detail.price = bidProduct != null ? bidProduct.getCurrentHighestPrice() : null;
        detail.priceInfo = buildPriceInfo(order);
        detail.deliveryInfo = buildDeliveryInfo(address, order);
        detail.shipmentInfo = buildShipmentInfo(delivery);
        detail.timeline = buildTimeline(order);
        detail.contractName = order.getOrderNo();
        return detail;
    }

    private OrderPriceInfo buildPriceInfo(PigOrder order)
    {
        OrderPriceInfo priceInfo = new OrderPriceInfo();
        priceInfo.depositAmount = BigDecimal.ZERO;
        priceInfo.goodsAmount = defaultZero(order.getOrderAmount());
        priceInfo.freightAmount = BigDecimal.ZERO;
        priceInfo.totalAmount = defaultZero(order.getOrderAmount());
        return priceInfo;
    }

    private OrderDeliveryInfo buildDeliveryInfo(Address address, PigOrder order)
    {
        OrderDeliveryInfo info = new OrderDeliveryInfo();
        info.contactName = address != null ? address.getContactName() : null;
        info.contactPhone = address != null ? address.getContactPhone() : null;
        info.address = address != null ? address.getAddressCode() + address.getDetailAddress() : null;
        info.deliveryTime = formatDate(order.getExpectLoadTime());
        return info;
    }

    private OrderShipmentInfo buildShipmentInfo(DeliveryInfo delivery)
    {
        if (delivery == null)
        {
            return null;
        }
        OrderShipmentInfo info = new OrderShipmentInfo();
        info.driverName = delivery.getDelivererName();
        info.driverPhone = delivery.getDelivererPhone();
        info.vehicleNo = delivery.getVehicleNo();
        info.estimatedArrival = null;
        info.remark = delivery.getRemark();
        return info;
    }

    private List<OrderTimelineNode> buildTimeline(PigOrder order)
    {
        List<OrderTimelineNode> timeline = new ArrayList<OrderTimelineNode>();
        timeline.add(buildTimelineNode("下单", formatDate(order.getCreateTime()), null));
        timeline.add(buildTimelineNode("支付", formatDate(order.getPayTime()), null));
        timeline.add(buildTimelineNode("发货", formatDate(order.getShipTime()), null));
        timeline.add(buildTimelineNode("收货", formatDate(order.getReceiveTime()), null));
        return timeline;
    }

    private OrderTimelineNode buildTimelineNode(String label, String time, String desc)
    {
        OrderTimelineNode node = new OrderTimelineNode();
        node.label = label;
        node.time = time;
        node.desc = desc;
        return node;
    }

    private Address buildUserAddressQuery()
    {
        Address query = new Address();
        query.setUserId(getUserId());
        return query;
    }

    private Enterprise getEnterpriseByUser()
    {
        UserExt userExt = userExtService.selectUserExtById(getUserId());
        if (userExt != null && userExt.getEnterpriseId() != null)
        {
            return enterpriseService.selectEnterpriseById(userExt.getEnterpriseId());
        }
        return null;
    }

    private DeliveryInfo resolveDeliveryInfo(String deliveryInfoIds)
    {
        List<String> ids = splitToList(deliveryInfoIds);
        if (ids.isEmpty())
        {
            return null;
        }
        return deliveryInfoService.selectDeliveryInfoById(toLong(ids.get(0)));
    }

    private String resolveMyBidStatus(Long userId, Long bidProductId)
    {
        if (userId == null || bidProductId == null)
        {
            return "NO_BID";
        }
        UserBid query = new UserBid();
        query.setUserId(userId);
        query.setBidProductId(bidProductId);
        List<UserBid> list = userBidService.selectUserBidList(query);
        // todo 查询条件移除 已经取消的

        list.removeIf(item -> "CANCELED".equalsIgnoreCase(item.getStatus()));
        if (list.isEmpty())
        {
            return "NO_BID";
        }
        String status = list.get(0).getStatus();
        if (StringUtils.isEmpty(status))
        {
            return "BIDDING";
        }
        if (status.toUpperCase().contains("SUCCESS"))
        {
            return "BID_SUCCESS";
        }
        if (status.toUpperCase().contains("FAIL"))
        {
            return "BID_FAILED";
        }
        return "BIDDING";
    }

    private int getPageCurrent(ListRequestParams params)
    {
        if (params != null && params.current != null && params.current > 0)
        {
            return params.current;
        }
        return 1;
    }

    private int getPageSize(ListRequestParams params)
    {
        if (params != null && params.size != null && params.size > 0)
        {
            return params.size;
        }
        return 10;
    }

    private <T> ListResponseData<T> buildPage(List<T> records, PageInfo<?> pageInfo, int current, int size)
    {
        ListResponseData<T> page = new ListResponseData<T>();
        page.current = (long) current;
        page.size = (long) size;
        page.total = pageInfo.getTotal();
        page.pages = (long) pageInfo.getPages();
        page.records = records;
        return page;
    }

    private List<String> resolveTagNames(PigType pigType)
    {
        if (pigType == null)
        {
            return new ArrayList<String>();
        }
        List<String> tagIds = splitToList(pigType.getPigTagIds());
        List<String> names = new ArrayList<String>();
        for (String id : tagIds)
        {
            PigTag tag = pigTagService.selectPigTagById(toLong(id));
            if (tag != null && StringUtils.isNotEmpty(tag.getTagName()))
            {
                names.add(tag.getTagName());
            }
        }
        return names;
    }

    private List<String> splitToList(String value)
    {
        if (StringUtils.isEmpty(value))
        {
            return new ArrayList<String>();
        }
        return Arrays.stream(value.split(","))
            .filter(StringUtils::isNotEmpty)
            .collect(Collectors.toList());
    }

    private String joinList(List<String> list)
    {
        if (list == null || list.isEmpty())
        {
            return null;
        }
        return StringUtils.join(list, ",");
    }

    private String formatDate(Date date)
    {
        return date != null ? DateUtils.parseDateToStr(DateUtils.YYYY_MM_DD_HH_MM_SS, date) : null;
    }


    private String firstImageUrl(PigType pigType)
    {
        if (pigType == null || StringUtils.isEmpty(pigType.getPigMedia()))
        {
            return "";
        }
        List<String> media = splitToList(pigType.getPigMedia());
        for (String url : media)
        {
            if (!isVideoUrl(url))
            {
                return url;
            }
        }
        return media.isEmpty() ? "" : media.get(0);
    }
    private List<String> mergeMediaUrls(PigType pigType)
    {
        List<String> urls = new ArrayList<String>();
        if (pigType == null)
        {
            return urls;
        }
        urls.addAll(splitToList(pigType.getPigMedia()));
        return urls;
    }

    private boolean isVideoUrl(String url)
    {
        return StringUtils.isNotEmpty(url) && url.matches("(?i).*\\.(mp4|webm|mov|m4v|avi)(\\?.*)?$");
    }

    private Long calcRemainSeconds(Date endTime)
    {
        if (endTime == null)
        {
            return 0L;
        }
        long diff = endTime.getTime() - System.currentTimeMillis();
        return diff > 0 ? diff / 1000 : 0L;
    }

    private List<PigOrder> selectOrdersByUser()
    {
        PigOrder query = new PigOrder();
        query.setCreateBy(String.valueOf(getUserId()));
        return pigOrderService.selectPigOrderList(query);
    }

    private int countOrderStatus(List<PigOrder> orders, String status)
    {
        return (int) orders.stream().filter(order -> status.equalsIgnoreCase(order.getOrderStatus())).count();
    }

    private String mapOrderStatus(String dbStatus)
    {
        if ("WAITING".equalsIgnoreCase(dbStatus))
        {
            return "ORDER_PAYMENT";
        }
        if ("PAID".equalsIgnoreCase(dbStatus))
        {
            return "ORDER_SHIPMENT";
        }
        if ("SHIPPED".equalsIgnoreCase(dbStatus))
        {
            return "ORDER_RECEIPT";
        }
        if ("COMPLETED".equalsIgnoreCase(dbStatus))
        {
            return "ORDER_COMPLETED";
        }
        if ("CANCELED".equalsIgnoreCase(dbStatus))
        {
            return "ORDER_CANCELLED";
        }
        return "ORDER_PAYMENT";
    }

    private String mapOrderStatusToDb(String status)
    {
        if ("ORDER_PAYMENT".equalsIgnoreCase(status))
        {
            return "WAITING";
        }
        if ("ORDER_SHIPMENT".equalsIgnoreCase(status))
        {
            return "PAID";
        }
        if ("ORDER_RECEIPT".equalsIgnoreCase(status))
        {
            return "SHIPPED";
        }
        if ("ORDER_COMPLETED".equalsIgnoreCase(status))
        {
            return "COMPLETED";
        }
        if ("ORDER_CANCELLED".equalsIgnoreCase(status))
        {
            return "CANCELED";
        }
        return status;
    }

    private BigDecimal defaultZero(BigDecimal value)
    {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal safeAdd(BigDecimal left, BigDecimal right)
    {
        return defaultZero(left).add(defaultZero(right));
    }

    private Long toLong(String value)
    {
        if (StringUtils.isEmpty(value))
        {
            return null;
        }
        return Long.valueOf(value);
    }

    private String toStr(BigDecimal value)
    {
        return value != null ? value.toPlainString() : null;
    }

    public static class UploadImageResponse
    {
        public String url;
    }
}
