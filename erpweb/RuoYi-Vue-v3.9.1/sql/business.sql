-- 生猪竞拍管理端业务sql

-- ----------------------------
-- 业务表
-- ----------------------------
DROP TABLE IF EXISTS t_pigType;
CREATE TABLE t_pigType (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_pigName varchar(100) DEFAULT '' COMMENT '生猪名称',
  f_pigCode varchar(100) DEFAULT '' COMMENT '生猪编码',
  f_pigIntro varchar(500) DEFAULT NULL COMMENT '生猪介绍',
  f_pigTagIds varchar(500) DEFAULT NULL COMMENT '生猪标签id字符串数组',
  f_weightRange varchar(50) DEFAULT NULL COMMENT '体重区间',
  f_pigMedia varchar(5000) DEFAULT NULL COMMENT '生猪图片视频',
  f_feedQuality varchar(100) DEFAULT NULL COMMENT '食料品质',
  f_epidemicStatus varchar(100) DEFAULT NULL COMMENT '防疫状态',
  f_diseaseFreeRegion varchar(100) DEFAULT NULL COMMENT '无疫地区',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='生猪类型表';

DROP TABLE IF EXISTS t_pigResource;
CREATE TABLE t_pigResource (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_resourceCode varchar(100) DEFAULT '' COMMENT '资源编码',
  f_pigTypeId bigint(20) DEFAULT NULL COMMENT '生猪类型id',
  f_siteId bigint(20) DEFAULT NULL COMMENT '场点id',
  f_resourceSource varchar(32) DEFAULT NULL COMMENT '资源来源',
  f_purchaseOrderId bigint(20) DEFAULT NULL COMMENT '采购单id',
  f_resourceCount int(4) DEFAULT NULL COMMENT '资源数量',
  f_resourceUnitPrice decimal(10,6) DEFAULT NULL COMMENT '资源单价',
  f_resourceTotalPrice decimal(10,6) DEFAULT NULL COMMENT '资源总价',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='生猪资源表';

DROP TABLE IF EXISTS t_bidProduct;
CREATE TABLE t_bidProduct (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_bidProductCode varchar(100) DEFAULT '' COMMENT '竞价商品编码',
  f_pigResourceId bigint(20) DEFAULT NULL COMMENT '生猪资源id',
  f_enterpriseGroupId bigint(20) DEFAULT NULL COMMENT '企业分组id',
  f_siteId bigint(20) DEFAULT NULL COMMENT '场点id',
  f_startPrice decimal(10,6) DEFAULT NULL COMMENT '起始单价',
  f_startTime datetime COMMENT '开始时间',
  f_endTime datetime COMMENT '结束时间',
  f_currentHighestPrice decimal(10,6) DEFAULT NULL COMMENT '当前最高出价',
  f_bidNotice varchar(1000) DEFAULT NULL COMMENT '竞价须知',
  f_remark varchar(500) DEFAULT NULL COMMENT '备注',
  f_totalHeadCount int(4) DEFAULT NULL COMMENT '总头数',
  f_startBidCount int(4) DEFAULT NULL COMMENT '起拍头数',
  f_priceStep decimal(10,6) DEFAULT NULL COMMENT '加价幅度',
  f_addPrice decimal(10,6) DEFAULT NULL COMMENT '加拍价',
  f_bidStatus varchar(32) DEFAULT NULL COMMENT '竞价状态',
  f_approvalStatus varchar(32) DEFAULT NULL COMMENT '审批状态',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='竞价商品表';

DROP TABLE IF EXISTS t_site;
CREATE TABLE t_site (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_enterpriseId bigint(20) DEFAULT NULL COMMENT '所属企业',
  f_siteName varchar(100) DEFAULT '' COMMENT '场点名称',
  f_siteAddress varchar(500) DEFAULT NULL COMMENT '场点地址',
  f_siteAddressCode varchar(100) DEFAULT NULL COMMENT '场点地址code',
  f_siteLocation varchar(50) DEFAULT NULL COMMENT '场点经纬度坐标',
  f_sitePhone varchar(50) DEFAULT NULL COMMENT '场点电话',
  f_siteIntro varchar(500) DEFAULT NULL COMMENT '场点介绍',
  f_siteImages varchar(5000) DEFAULT NULL COMMENT '场点图片',
  f_siteVideos varchar(5000) DEFAULT NULL COMMENT '场点视频',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='场点表';

DROP TABLE IF EXISTS t_pigTag;
CREATE TABLE t_pigTag (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_tagName varchar(100) DEFAULT '' COMMENT '标签名称',
  f_tagDesc varchar(500) DEFAULT NULL COMMENT '标签描述',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='生猪标签表';

DROP TABLE IF EXISTS t_userBidInfo;
CREATE TABLE t_userBidInfo (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_userId bigint(20) DEFAULT NULL COMMENT '用户id',
  f_enterpriseId bigint(20) DEFAULT NULL COMMENT '企业id',
  f_bidProductId bigint(20) DEFAULT NULL COMMENT '竞价商品id',
  f_addressId bigint(20) DEFAULT NULL COMMENT '收货地址id',
  f_loadingTime datetime COMMENT '装车时间',
  f_remark varchar(500) DEFAULT NULL COMMENT '备注',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='用户竞价信息维护表';

DROP TABLE IF EXISTS t_userBid;
CREATE TABLE t_userBid (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_userId bigint(20) DEFAULT NULL COMMENT '用户id',
  f_enterpriseId bigint(20) DEFAULT NULL COMMENT '企业id',
  f_bidProductId bigint(20) DEFAULT NULL COMMENT '竞价商品id',
  f_price decimal(10,6) DEFAULT NULL COMMENT '单价',
  f_quantity int(4) DEFAULT NULL COMMENT '数量',
  f_bidTime datetime COMMENT '出价时间',
  f_status varchar(32) DEFAULT NULL COMMENT '状态',
  f_totalPrice decimal(10,6) DEFAULT NULL COMMENT '总价',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='用户出价表';

DROP TABLE IF EXISTS t_enterpriseGroup;
CREATE TABLE t_enterpriseGroup (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_groupName varchar(100) DEFAULT '' COMMENT '组名',
  f_groupDesc varchar(500) DEFAULT NULL COMMENT '组描述',
  f_enterpriseIds varchar(1000) DEFAULT NULL COMMENT '企业id数组',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='企业分组表';

DROP TABLE IF EXISTS t_order;
CREATE TABLE t_order (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_orderNo varchar(100) DEFAULT '' COMMENT '订单编号',
  f_orderStatus varchar(32) DEFAULT NULL COMMENT '订单状态',
  f_orderSource varchar(32) DEFAULT NULL COMMENT '订单来源',
  f_enterpriseId bigint(20) DEFAULT NULL COMMENT '归属企业',
  f_bidProductId bigint(20) DEFAULT NULL COMMENT '竞价商品id',
  f_userBidId bigint(20) DEFAULT NULL COMMENT '用户出价id',
  f_addressId bigint(20) DEFAULT NULL COMMENT '收货地址id',
  f_expectLoadTime datetime COMMENT '期望装车时间',
  f_remark varchar(500) DEFAULT NULL COMMENT '备注',
  f_pigResourceId bigint(20) DEFAULT NULL COMMENT '生猪资源id',
  f_orderAmount decimal(10,6) DEFAULT NULL COMMENT '订单金额',
  f_payChannel varchar(50) DEFAULT NULL COMMENT '支付渠道',
  f_payTime datetime COMMENT '支付时间',
  f_loadTime datetime COMMENT '装货时间',
  f_shipTime datetime COMMENT '发货时间',
  f_deliveryInfoIds varchar(1000) DEFAULT NULL COMMENT '送货信息id数组',
  f_receiveTime datetime COMMENT '确认收货时间',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='订单表';

DROP TABLE IF EXISTS t_deliveryInfo;
CREATE TABLE t_deliveryInfo (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_transportCode varchar(100) DEFAULT '' COMMENT '运输编码',
  f_currentLongitude varchar(50) DEFAULT NULL COMMENT '当前位置经度',
  f_currentLatitude varchar(50) DEFAULT NULL COMMENT '当前位置纬度',
  f_delivererName varchar(100) DEFAULT '' COMMENT '送货人姓名',
  f_delivererPhone varchar(50) DEFAULT NULL COMMENT '送货人电话',
  f_vehicleNo varchar(50) DEFAULT NULL COMMENT '车牌号',
  f_vehicleType varchar(50) DEFAULT NULL COMMENT '车辆类型',
  f_loadCount int(4) DEFAULT NULL COMMENT '装猪数量',
  f_deliveryStatus varchar(32) DEFAULT NULL COMMENT '送货状态',
  f_remark varchar(500) DEFAULT NULL COMMENT '备注',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='送货信息表';

DROP TABLE IF EXISTS t_enterprise;
CREATE TABLE t_enterprise (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_enterpriseName varchar(200) DEFAULT '' COMMENT '企业名称',
  f_creditCode varchar(100) DEFAULT NULL COMMENT '统一社会信用代码',
  f_legalPerson varchar(100) DEFAULT NULL COMMENT '法定代表人',
  f_contactPerson varchar(100) DEFAULT NULL COMMENT '联系人',
  f_contactPhone varchar(50) DEFAULT NULL COMMENT '联系电话',
  f_businessLicenseUrl varchar(1000) DEFAULT NULL COMMENT '营业执照',
  f_otherMaterialUrls varchar(1000) DEFAULT NULL COMMENT '其他资料',
  f_isVerified tinyint(1) DEFAULT 0 COMMENT '是否认证',
  f_canBid tinyint(1) DEFAULT 0 COMMENT '是否可以参与竞价',
  f_hasDeposit tinyint(1) DEFAULT 0 COMMENT '是否缴纳保证金',
  f_depositAmount decimal(10,6) DEFAULT NULL COMMENT '保证金',
  f_paymentAmount decimal(10,6) DEFAULT NULL COMMENT '货款',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='企业信息表';

DROP TABLE IF EXISTS t_address;
CREATE TABLE t_address (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_userId bigint(20) DEFAULT NULL COMMENT '用户id',
  f_contactName varchar(100) DEFAULT NULL COMMENT '联系人姓名',
  f_contactPhone varchar(50) DEFAULT NULL COMMENT '联系人电话',
  f_addressCode varchar(100) DEFAULT NULL COMMENT '地址code',
  f_detailAddress varchar(500) DEFAULT NULL COMMENT '详细地址',
  f_isDefault tinyint(1) DEFAULT 0 COMMENT '是否默认地址',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='地址管理表';

DROP TABLE IF EXISTS t_userExt;
CREATE TABLE t_userExt (
  f_id bigint(20) NOT NULL COMMENT '用户id',
  f_isRealName tinyint(1) DEFAULT 0 COMMENT '是否实名认证',
  f_enterpriseId bigint(20) DEFAULT NULL COMMENT '所属企业id',
  f_creator varchar(64) DEFAULT '' COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator varchar(64) DEFAULT '' COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB COMMENT='用户信息拓展表';

DROP TABLE IF EXISTS t_businessMessage;
CREATE TABLE t_businessMessage (
  f_id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  f_messageType varchar(32) DEFAULT NULL COMMENT '消息类型',
  f_messageContent text COMMENT '消息内容',
  f_isRead tinyint(1) DEFAULT 0 COMMENT '是否阅读',
  f_userId bigint(20) DEFAULT NULL COMMENT '用户id',
  f_creator bigint(20) DEFAULT NULL COMMENT '创建人',
  f_createTime datetime COMMENT '创建时间',
  f_updator bigint(20) DEFAULT NULL COMMENT '更新人',
  f_updateTime datetime COMMENT '更新时间',
  PRIMARY KEY (f_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='业务消息表';

-- ----------------------------
-- 字典类型与字典数据（枚举值）
-- ----------------------------
INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '资源来源', 'pig_resource_source', '0', 'admin', sysdate(), '生猪资源来源'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_resource_source');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '竞价状态', 'pig_bid_status', '0', 'admin', sysdate(), '竞价状态'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_bid_status');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '审批状态', 'pig_approval_status', '0', 'admin', sysdate(), '审批状态'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_approval_status');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '出价状态', 'pig_user_bid_status', '0', 'admin', sysdate(), '出价状态'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_user_bid_status');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '订单状态', 'pig_order_status', '0', 'admin', sysdate(), '订单状态'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_order_status');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '订单来源', 'pig_order_source', '0', 'admin', sysdate(), '订单来源'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_order_source');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '送货状态', 'pig_delivery_status', '0', 'admin', sysdate(), '送货状态'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_delivery_status');

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_by, create_time, remark)
SELECT '消息类型', 'pig_message_type', '0', 'admin', sysdate(), '消息类型'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'pig_message_type');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '采购', '采购', 'pig_resource_source', '', 'primary', 'Y', '0', 'admin', sysdate(), '资源来源-采购'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_resource_source' AND dict_value = '采购');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '自产', '自产', 'pig_resource_source', '', 'success', 'N', '0', 'admin', sysdate(), '资源来源-自产'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_resource_source' AND dict_value = '自产');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '待开始', 'WAITING', 'pig_bid_status', '', 'info', 'Y', '0', 'admin', sysdate(), '竞价状态-待开始'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_bid_status' AND dict_value = 'WAITING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '竞价中', 'BIDDING', 'pig_bid_status', '', 'primary', 'N', '0', 'admin', sysdate(), '竞价状态-竞价中'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_bid_status' AND dict_value = 'BIDDING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '已结束', 'ENDED', 'pig_bid_status', '', 'danger', 'N', '0', 'admin', sysdate(), '竞价状态-已结束'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_bid_status' AND dict_value = 'ENDED');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '待审批', 'WAITING', 'pig_approval_status', '', 'info', 'Y', '0', 'admin', sysdate(), '审批状态-待审批'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_approval_status' AND dict_value = 'WAITING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '已通过', 'APPROVED', 'pig_approval_status', '', 'primary', 'N', '0', 'admin', sysdate(), '审批状态-已通过'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_approval_status' AND dict_value = 'APPROVED');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '已拒绝', 'REJECTED', 'pig_approval_status', '', 'danger', 'N', '0', 'admin', sysdate(), '审批状态-已拒绝'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_approval_status' AND dict_value = 'REJECTED');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '竞价中', 'BIDDING', 'pig_user_bid_status', '', 'primary', 'Y', '0', 'admin', sysdate(), '出价状态-竞价中'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_user_bid_status' AND dict_value = 'BIDDING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '中标', 'BID_SUCCESS', 'pig_user_bid_status', '', 'success', 'N', '0', 'admin', sysdate(), '出价状态-中标'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_user_bid_status' AND dict_value = 'BID_SUCCESS');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '未中标', 'BID_FAILED', 'pig_user_bid_status', '', 'danger', 'N', '0', 'admin', sysdate(), '出价状态-未中标'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_user_bid_status' AND dict_value = 'BID_FAILED');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 4, '已取消', 'BID_CANCEL', 'pig_user_bid_status', '', 'warning', 'N', '0', 'admin', sysdate(), '出价状态-已取消'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_user_bid_status' AND dict_value = 'BID_CANCEL');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '待付款', 'WAITING', 'pig_order_status', '', 'info', 'Y', '0', 'admin', sysdate(), '订单状态-待付款'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_status' AND dict_value = 'WAITING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '已付款', 'PAID', 'pig_order_status', '', 'primary', 'N', '0', 'admin', sysdate(), '订单状态-已付款'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_status' AND dict_value = 'PAID');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '已发货', 'SHIPPED', 'pig_order_status', '', 'warning', 'N', '0', 'admin', sysdate(), '订单状态-已发货'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_status' AND dict_value = 'SHIPPED');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 4, '已完成', 'COMPLETED', 'pig_order_status', '', 'success', 'N', '0', 'admin', sysdate(), '订单状态-已完成'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_status' AND dict_value = 'COMPLETED');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 5, '已取消', 'CANCELED', 'pig_order_status', '', 'danger', 'N', '0', 'admin', sysdate(), '订单状态-已取消'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_status' AND dict_value = 'CANCELED');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '人工', 'MANNUL', 'pig_order_source', '', 'primary', 'Y', '0', 'admin', sysdate(), '订单来源-人工'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_source' AND dict_value = 'MANNUL');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '竞价', 'BID', 'pig_order_source', '', 'success', 'N', '0', 'admin', sysdate(), '订单来源-竞价'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_order_source' AND dict_value = 'BID');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '待发货', 'WAITING', 'pig_delivery_status', '', 'info', 'Y', '0', 'admin', sysdate(), '送货状态-待发货'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_delivery_status' AND dict_value = 'WAITING');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '运输中', 'ON_THE_WAY', 'pig_delivery_status', '', 'primary', 'N', '0', 'admin', sysdate(), '送货状态-运输中'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_delivery_status' AND dict_value = 'ON_THE_WAY');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '已送达', 'ARRIVED', 'pig_delivery_status', '', 'success', 'N', '0', 'admin', sysdate(), '送货状态-已送达'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_delivery_status' AND dict_value = 'ARRIVED');

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 1, '系统', 'SYSTEM', 'pig_message_type', '', 'primary', 'Y', '0', 'admin', sysdate(), '消息类型-系统'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_message_type' AND dict_value = 'SYSTEM');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 2, '竞价', 'BID', 'pig_message_type', '', 'warning', 'N', '0', 'admin', sysdate(), '消息类型-竞价'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_message_type' AND dict_value = 'BID');
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark)
SELECT 3, '订单', 'ORDER', 'pig_message_type', '', 'success', 'N', '0', 'admin', sysdate(), '消息类型-订单'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'pig_message_type' AND dict_value = 'ORDER');

-- ----------------------------
-- 菜单与权限（生猪业务）
-- ----------------------------
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '生猪业务', 0, 5, 'pig', NULL, '', '', 1, 0, 'M', '0', '0', '', 'shopping', 'admin', sysdate(), '生猪业务目录'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '生猪业务' AND parent_id = 0);
SET @pigMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '生猪业务' AND parent_id = 0 ORDER BY menu_id DESC LIMIT 1);

-- 生猪类型
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '生猪类型', @pigMenuId, 1, 'pigType', 'pig/pigType/index', '', '', 1, 0, 'C', '0', '0', 'pig:pigType:list', 'table', 'admin', sysdate(), '生猪类型菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '生猪类型' AND parent_id = @pigMenuId);
SET @pigTypeMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '生猪类型' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @pigTypeMenuId, 1, '', '', 'F', '0', '0', 'pig:pigType:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @pigTypeMenuId, 2, '', '', 'F', '0', '0', 'pig:pigType:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @pigTypeMenuId, 3, '', '', 'F', '0', '0', 'pig:pigType:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @pigTypeMenuId, 4, '', '', 'F', '0', '0', 'pig:pigType:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @pigTypeMenuId, 5, '', '', 'F', '0', '0', 'pig:pigType:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:export');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导入', @pigTypeMenuId, 6, '', '', 'F', '0', '0', 'pig:pigType:import', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTypeMenuId AND perms = 'pig:pigType:import');

-- 生猪资源
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '生猪资源', @pigMenuId, 2, 'pigResource', 'pig/pigResource/index', '', '', 1, 0, 'C', '0', '0', 'pig:pigResource:list', 'table', 'admin', sysdate(), '生猪资源菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '生猪资源' AND parent_id = @pigMenuId);
SET @pigResourceMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '生猪资源' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @pigResourceMenuId, 1, '', '', 'F', '0', '0', 'pig:pigResource:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @pigResourceMenuId, 2, '', '', 'F', '0', '0', 'pig:pigResource:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @pigResourceMenuId, 3, '', '', 'F', '0', '0', 'pig:pigResource:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @pigResourceMenuId, 4, '', '', 'F', '0', '0', 'pig:pigResource:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @pigResourceMenuId, 5, '', '', 'F', '0', '0', 'pig:pigResource:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:export');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导入', @pigResourceMenuId, 6, '', '', 'F', '0', '0', 'pig:pigResource:import', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigResourceMenuId AND perms = 'pig:pigResource:import');

-- 竞价商品
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '竞价商品', @pigMenuId, 3, 'bidProduct', 'pig/bidProduct/index', '', '', 1, 0, 'C', '0', '0', 'pig:bidProduct:list', 'table', 'admin', sysdate(), '竞价商品菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '竞价商品' AND parent_id = @pigMenuId);
SET @bidProductMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '竞价商品' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @bidProductMenuId, 1, '', '', 'F', '0', '0', 'pig:bidProduct:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @bidProductMenuId, 2, '', '', 'F', '0', '0', 'pig:bidProduct:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @bidProductMenuId, 3, '', '', 'F', '0', '0', 'pig:bidProduct:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @bidProductMenuId, 4, '', '', 'F', '0', '0', 'pig:bidProduct:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @bidProductMenuId, 5, '', '', 'F', '0', '0', 'pig:bidProduct:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:export');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导入', @bidProductMenuId, 6, '', '', 'F', '0', '0', 'pig:bidProduct:import', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @bidProductMenuId AND perms = 'pig:bidProduct:import');

-- 场点
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '场点', @pigMenuId, 4, 'site', 'pig/site/index', '', '', 1, 0, 'C', '0', '0', 'pig:site:list', 'table', 'admin', sysdate(), '场点菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '场点' AND parent_id = @pigMenuId);
SET @siteMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '场点' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @siteMenuId, 1, '', '', 'F', '0', '0', 'pig:site:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @siteMenuId, 2, '', '', 'F', '0', '0', 'pig:site:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @siteMenuId, 3, '', '', 'F', '0', '0', 'pig:site:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @siteMenuId, 4, '', '', 'F', '0', '0', 'pig:site:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @siteMenuId, 5, '', '', 'F', '0', '0', 'pig:site:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:export');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导入', @siteMenuId, 6, '', '', 'F', '0', '0', 'pig:site:import', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @siteMenuId AND perms = 'pig:site:import');

-- 生猪标签
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '生猪标签', @pigMenuId, 5, 'pigTag', 'pig/pigTag/index', '', '', 1, 0, 'C', '0', '0', 'pig:pigTag:list', 'table', 'admin', sysdate(), '生猪标签菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '生猪标签' AND parent_id = @pigMenuId);
SET @pigTagMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '生猪标签' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @pigTagMenuId, 1, '', '', 'F', '0', '0', 'pig:pigTag:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTagMenuId AND perms = 'pig:pigTag:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @pigTagMenuId, 2, '', '', 'F', '0', '0', 'pig:pigTag:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTagMenuId AND perms = 'pig:pigTag:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @pigTagMenuId, 3, '', '', 'F', '0', '0', 'pig:pigTag:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTagMenuId AND perms = 'pig:pigTag:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @pigTagMenuId, 4, '', '', 'F', '0', '0', 'pig:pigTag:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTagMenuId AND perms = 'pig:pigTag:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @pigTagMenuId, 5, '', '', 'F', '0', '0', 'pig:pigTag:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigTagMenuId AND perms = 'pig:pigTag:export');

-- 用户竞价信息维护
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '用户竞价信息维护', @pigMenuId, 6, 'userBidInfo', 'pig/userBidInfo/index', '', '', 1, 0, 'C', '0', '0', 'pig:userBidInfo:list', 'table', 'admin', sysdate(), '用户竞价信息维护菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '用户竞价信息维护' AND parent_id = @pigMenuId);
SET @userBidInfoMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '用户竞价信息维护' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @userBidInfoMenuId, 1, '', '', 'F', '0', '0', 'pig:userBidInfo:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidInfoMenuId AND perms = 'pig:userBidInfo:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @userBidInfoMenuId, 2, '', '', 'F', '0', '0', 'pig:userBidInfo:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidInfoMenuId AND perms = 'pig:userBidInfo:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @userBidInfoMenuId, 3, '', '', 'F', '0', '0', 'pig:userBidInfo:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidInfoMenuId AND perms = 'pig:userBidInfo:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @userBidInfoMenuId, 4, '', '', 'F', '0', '0', 'pig:userBidInfo:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidInfoMenuId AND perms = 'pig:userBidInfo:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @userBidInfoMenuId, 5, '', '', 'F', '0', '0', 'pig:userBidInfo:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidInfoMenuId AND perms = 'pig:userBidInfo:export');

-- 用户出价
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '用户出价', @pigMenuId, 7, 'userBid', 'pig/userBid/index', '', '', 1, 0, 'C', '0', '0', 'pig:userBid:list', 'table', 'admin', sysdate(), '用户出价菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '用户出价' AND parent_id = @pigMenuId);
SET @userBidMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '用户出价' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @userBidMenuId, 1, '', '', 'F', '0', '0', 'pig:userBid:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidMenuId AND perms = 'pig:userBid:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @userBidMenuId, 2, '', '', 'F', '0', '0', 'pig:userBid:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidMenuId AND perms = 'pig:userBid:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @userBidMenuId, 3, '', '', 'F', '0', '0', 'pig:userBid:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidMenuId AND perms = 'pig:userBid:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @userBidMenuId, 4, '', '', 'F', '0', '0', 'pig:userBid:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidMenuId AND perms = 'pig:userBid:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @userBidMenuId, 5, '', '', 'F', '0', '0', 'pig:userBid:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userBidMenuId AND perms = 'pig:userBid:export');

-- 企业分组
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '企业分组', @pigMenuId, 8, 'enterpriseGroup', 'pig/enterpriseGroup/index', '', '', 1, 0, 'C', '0', '0', 'pig:enterpriseGroup:list', 'table', 'admin', sysdate(), '企业分组菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '企业分组' AND parent_id = @pigMenuId);
SET @enterpriseGroupMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '企业分组' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @enterpriseGroupMenuId, 1, '', '', 'F', '0', '0', 'pig:enterpriseGroup:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseGroupMenuId AND perms = 'pig:enterpriseGroup:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @enterpriseGroupMenuId, 2, '', '', 'F', '0', '0', 'pig:enterpriseGroup:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseGroupMenuId AND perms = 'pig:enterpriseGroup:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @enterpriseGroupMenuId, 3, '', '', 'F', '0', '0', 'pig:enterpriseGroup:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseGroupMenuId AND perms = 'pig:enterpriseGroup:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @enterpriseGroupMenuId, 4, '', '', 'F', '0', '0', 'pig:enterpriseGroup:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseGroupMenuId AND perms = 'pig:enterpriseGroup:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @enterpriseGroupMenuId, 5, '', '', 'F', '0', '0', 'pig:enterpriseGroup:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseGroupMenuId AND perms = 'pig:enterpriseGroup:export');

-- 订单
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '订单', @pigMenuId, 9, 'pigOrder', 'pig/pigOrder/index', '', '', 1, 0, 'C', '0', '0', 'pig:pigOrder:list', 'table', 'admin', sysdate(), '订单菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '订单' AND parent_id = @pigMenuId);
SET @pigOrderMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '订单' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @pigOrderMenuId, 1, '', '', 'F', '0', '0', 'pig:pigOrder:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigOrderMenuId AND perms = 'pig:pigOrder:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @pigOrderMenuId, 2, '', '', 'F', '0', '0', 'pig:pigOrder:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigOrderMenuId AND perms = 'pig:pigOrder:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @pigOrderMenuId, 3, '', '', 'F', '0', '0', 'pig:pigOrder:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigOrderMenuId AND perms = 'pig:pigOrder:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @pigOrderMenuId, 4, '', '', 'F', '0', '0', 'pig:pigOrder:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigOrderMenuId AND perms = 'pig:pigOrder:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @pigOrderMenuId, 5, '', '', 'F', '0', '0', 'pig:pigOrder:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @pigOrderMenuId AND perms = 'pig:pigOrder:export');

-- 送货信息
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '送货信息', @pigMenuId, 10, 'deliveryInfo', 'pig/deliveryInfo/index', '', '', 1, 0, 'C', '0', '0', 'pig:deliveryInfo:list', 'table', 'admin', sysdate(), '送货信息菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '送货信息' AND parent_id = @pigMenuId);
SET @deliveryInfoMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '送货信息' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @deliveryInfoMenuId, 1, '', '', 'F', '0', '0', 'pig:deliveryInfo:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @deliveryInfoMenuId AND perms = 'pig:deliveryInfo:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @deliveryInfoMenuId, 2, '', '', 'F', '0', '0', 'pig:deliveryInfo:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @deliveryInfoMenuId AND perms = 'pig:deliveryInfo:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @deliveryInfoMenuId, 3, '', '', 'F', '0', '0', 'pig:deliveryInfo:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @deliveryInfoMenuId AND perms = 'pig:deliveryInfo:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @deliveryInfoMenuId, 4, '', '', 'F', '0', '0', 'pig:deliveryInfo:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @deliveryInfoMenuId AND perms = 'pig:deliveryInfo:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @deliveryInfoMenuId, 5, '', '', 'F', '0', '0', 'pig:deliveryInfo:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @deliveryInfoMenuId AND perms = 'pig:deliveryInfo:export');

-- 企业信息
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '企业信息', @pigMenuId, 11, 'enterprise', 'pig/enterprise/index', '', '', 1, 0, 'C', '0', '0', 'pig:enterprise:list', 'table', 'admin', sysdate(), '企业信息菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '企业信息' AND parent_id = @pigMenuId);
SET @enterpriseMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '企业信息' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @enterpriseMenuId, 1, '', '', 'F', '0', '0', 'pig:enterprise:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseMenuId AND perms = 'pig:enterprise:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @enterpriseMenuId, 2, '', '', 'F', '0', '0', 'pig:enterprise:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseMenuId AND perms = 'pig:enterprise:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @enterpriseMenuId, 3, '', '', 'F', '0', '0', 'pig:enterprise:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseMenuId AND perms = 'pig:enterprise:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @enterpriseMenuId, 4, '', '', 'F', '0', '0', 'pig:enterprise:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseMenuId AND perms = 'pig:enterprise:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @enterpriseMenuId, 5, '', '', 'F', '0', '0', 'pig:enterprise:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @enterpriseMenuId AND perms = 'pig:enterprise:export');

-- 地址管理
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '地址管理', @pigMenuId, 12, 'address', 'pig/address/index', '', '', 1, 0, 'C', '0', '0', 'pig:address:list', 'table', 'admin', sysdate(), '地址管理菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '地址管理' AND parent_id = @pigMenuId);
SET @addressMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '地址管理' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @addressMenuId, 1, '', '', 'F', '0', '0', 'pig:address:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @addressMenuId AND perms = 'pig:address:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @addressMenuId, 2, '', '', 'F', '0', '0', 'pig:address:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @addressMenuId AND perms = 'pig:address:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @addressMenuId, 3, '', '', 'F', '0', '0', 'pig:address:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @addressMenuId AND perms = 'pig:address:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @addressMenuId, 4, '', '', 'F', '0', '0', 'pig:address:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @addressMenuId AND perms = 'pig:address:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @addressMenuId, 5, '', '', 'F', '0', '0', 'pig:address:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @addressMenuId AND perms = 'pig:address:export');

-- 用户信息拓展
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '用户信息拓展', @pigMenuId, 13, 'userExt', 'pig/userExt/index', '', '', 1, 0, 'C', '0', '0', 'pig:userExt:list', 'table', 'admin', sysdate(), '用户信息拓展菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '用户信息拓展' AND parent_id = @pigMenuId);
SET @userExtMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '用户信息拓展' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @userExtMenuId, 1, '', '', 'F', '0', '0', 'pig:userExt:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userExtMenuId AND perms = 'pig:userExt:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @userExtMenuId, 2, '', '', 'F', '0', '0', 'pig:userExt:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userExtMenuId AND perms = 'pig:userExt:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @userExtMenuId, 3, '', '', 'F', '0', '0', 'pig:userExt:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userExtMenuId AND perms = 'pig:userExt:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @userExtMenuId, 4, '', '', 'F', '0', '0', 'pig:userExt:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userExtMenuId AND perms = 'pig:userExt:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @userExtMenuId, 5, '', '', 'F', '0', '0', 'pig:userExt:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @userExtMenuId AND perms = 'pig:userExt:export');

-- 业务消息
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '业务消息', @pigMenuId, 14, 'businessMessage', 'pig/businessMessage/index', '', '', 1, 0, 'C', '0', '0', 'pig:businessMessage:list', 'table', 'admin', sysdate(), '业务消息菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_name = '业务消息' AND parent_id = @pigMenuId);
SET @businessMessageMenuId = (SELECT menu_id FROM sys_menu WHERE menu_name = '业务消息' AND parent_id = @pigMenuId ORDER BY menu_id DESC LIMIT 1);
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '查询', @businessMessageMenuId, 1, '', '', 'F', '0', '0', 'pig:businessMessage:query', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @businessMessageMenuId AND perms = 'pig:businessMessage:query');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '新增', @businessMessageMenuId, 2, '', '', 'F', '0', '0', 'pig:businessMessage:add', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @businessMessageMenuId AND perms = 'pig:businessMessage:add');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '修改', @businessMessageMenuId, 3, '', '', 'F', '0', '0', 'pig:businessMessage:edit', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @businessMessageMenuId AND perms = 'pig:businessMessage:edit');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '删除', @businessMessageMenuId, 4, '', '', 'F', '0', '0', 'pig:businessMessage:remove', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @businessMessageMenuId AND perms = 'pig:businessMessage:remove');
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
SELECT '导出', @businessMessageMenuId, 5, '', '', 'F', '0', '0', 'pig:businessMessage:export', '#', 'admin', sysdate(), ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE parent_id = @businessMessageMenuId AND perms = 'pig:businessMessage:export');
