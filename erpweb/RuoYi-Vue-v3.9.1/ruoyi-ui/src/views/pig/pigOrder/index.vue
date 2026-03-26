<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_order_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单来源" prop="orderSource">
        <el-select v-model="queryParams.orderSource" placeholder="请选择订单来源" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_order_source" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:pigOrder:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:pigOrder:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:pigOrder:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:pigOrder:export']">导出</el-button>
      </el-col>
      <el-col :span="3">
        <el-radio-group v-model="viewMode" size="mini">
          <el-radio-button label="table">列表</el-radio-button>
          <el-radio-button label="card">卡片</el-radio-button>
        </el-radio-group>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pigOrderList" v-if="viewMode === 'table'" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="订单编号" align="center" prop="orderNo" v-if="columns.orderNo.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.orderNo || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus" v-if="columns.orderStatus.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_order_status" :value="scope.row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column label="订单来源" align="center" prop="orderSource" v-if="columns.orderSource.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_order_source" :value="scope.row.orderSource" />
        </template>
      </el-table-column>
      <el-table-column label="归属企业" align="center" prop="enterpriseId" v-if="columns.enterpriseId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnterpriseName(scope.row.enterpriseId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞价商品" align="center" prop="bidProductId" v-if="columns.bidProductId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getBidProductLabel(scope.row.bidProductId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户出价" align="center" prop="userBidId" v-if="columns.userBidId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getUserBidLabel(scope.row.userBidId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" align="center" prop="addressId" v-if="columns.addressId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getAddressLabel(scope.row.addressId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期望装车时间" align="center" prop="expectLoadTime" v-if="columns.expectLoadTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expectLoadTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生猪资源" align="center" prop="pigResourceId" v-if="columns.pigResourceId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getPigResourceLabel(scope.row.pigResourceId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" prop="orderAmount" v-if="columns.orderAmount.visible" />
      <el-table-column label="竞拍数量(头)" align="center" prop="bidQuantity" v-if="columns.bidQuantity.visible">
        <template slot-scope="scope">
          <span>{{ scope.row.bidQuantity ? scope.row.bidQuantity + '头' : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付渠道" align="center" prop="payChannel" v-if="columns.payChannel.visible" />
      <el-table-column label="支付时间" align="center" prop="payTime" v-if="columns.payTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="装货时间" align="center" prop="loadTime" v-if="columns.loadTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loadTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="shipTime" v-if="columns.shipTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.shipTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送货信息id数组" align="center" prop="deliveryInfoIds" v-if="columns.deliveryInfoIds.visible" :show-overflow-tooltip="true" />
      <el-table-column label="确认收货时间" align="center" prop="receiveTime" v-if="columns.receiveTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns.remark.visible" :show-overflow-tooltip="true" />
      <el-table-column label="创建人" align="center" prop="createBy" v-if="columns.createBy.visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" v-if="columns.updateBy.visible" />
      <el-table-column label="更新时间" align="center" prop="updateTime" v-if="columns.updateTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:pigOrder:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:pigOrder:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row v-if="viewMode === 'card'" :gutter="12">
      <el-col :span="8" v-for="item in pigOrderList" :key="item.id" class="mb8">
        <el-card shadow="hover">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <el-link type="primary" :underline="false" @click="handleView(item)">{{ item.orderNo || ('订单#' + item.id) }}</el-link>
            <dict-tag :options="dict.type.pig_order_status" :value="item.orderStatus" />
          </div>
          <div style="line-height: 1.8;">
            <div>订单来源：<dict-tag :options="dict.type.pig_order_source" :value="item.orderSource" /></div>
            <div>归属企业：{{ getEnterpriseName(item.enterpriseId) }}</div>
            <div>竞价商品：{{ getBidProductLabel(item.bidProductId) }}</div>
            <div>用户出价：{{ getUserBidLabel(item.userBidId) }}</div>
            <div>收货地址：{{ getAddressLabel(item.addressId) }}</div>
            <div>生猪资源：{{ getPigResourceLabel(item.pigResourceId) }}</div>
            <div>竞拍数量：{{ item.bidQuantity ? item.bidQuantity + '头' : '-' }}</div>
            <div>单价：{{ item.unitPrice }}</div>
            <div>订单金额：{{ item.orderAmount }}</div>
            <div>支付渠道：{{ item.payChannel }}</div>
            <div>支付时间：{{ parseTime(item.payTime) }}</div>
            <div>期望装车时间：{{ parseTime(item.expectLoadTime) }}</div>
            <div>装货时间：{{ parseTime(item.loadTime) }}</div>
            <div>发货时间：{{ parseTime(item.shipTime) }}</div>
            <div>确认收货时间：{{ parseTime(item.receiveTime) }}</div>
            <div>送货信息id数组：{{ item.deliveryInfoIds }}</div>
            <div>备注：{{ item.remark }}</div>
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(item)" v-hasPermi="['pig:pigOrder:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(item)" v-hasPermi="['pig:pigOrder:remove']">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="自动生成" :disabled="true" />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.pig_order_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" prop="orderSource">
          <el-select v-model="form.orderSource" placeholder="请选择订单来源" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.pig_order_source" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择归属企业" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.enterpriseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞价商品" prop="bidProductId">
          <el-select v-model="form.bidProductId" placeholder="请选择竞价商品" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in bidProductOptions" :key="item.id" :label="getBidProductOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户出价" prop="userBidId">
          <el-select v-model="form.userBidId" placeholder="请选择用户出价" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in userBidOptions" :key="item.id" :label="getUserBidOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址" prop="addressId">
          <el-select v-model="form.addressId" placeholder="请选择收货地址" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in addressOptions" :key="item.id" :label="getAddressOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="期望装车时间" prop="expectLoadTime">
          <el-date-picker v-model="form.expectLoadTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择期望装车时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="生猪资源" prop="pigResourceId">
          <el-select v-model="form.pigResourceId" placeholder="请选择生猪资源" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in pigResourceOptions" :key="item.id" :label="getPigResourceOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞拍数量(头)" prop="bidQuantity">
          <el-input v-model="form.bidQuantity" placeholder="请输入竞拍数量" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入单价" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderAmount">
          <el-input v-model="form.orderAmount" placeholder="自动计算，可手工修改" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="支付渠道" prop="payChannel">
          <el-input v-model="form.payChannel" placeholder="请输入支付渠道" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker v-model="form.payTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择支付时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="装货时间" prop="loadTime">
          <el-date-picker v-model="form.loadTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择装货时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="发货时间" prop="shipTime">
          <el-date-picker v-model="form.shipTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择发货时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="送货信息">
          <div style="margin-bottom: 8px;">
            <el-button v-if="!viewModeOnly" size="mini" type="primary" plain icon="el-icon-plus" @click="openDeliveryInfoDialog()">新增送货信息</el-button>
          </div>
          <el-table :data="deliveryInfoList" size="mini" border style="width: 100%;">
            <el-table-column label="运输编码" prop="transportCode" min-width="140" />
            <el-table-column label="送货人" prop="delivererName" min-width="100" />
            <el-table-column label="电话" prop="delivererPhone" min-width="120" />
            <el-table-column label="车牌号" prop="vehicleNo" min-width="120" />
            <el-table-column label="装猪数量" prop="loadCount" min-width="90" />
            <el-table-column label="当前位置" min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.currentLongitude || '-' }}, {{ scope.row.currentLatitude || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="deliveryStatus" min-width="90">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.pig_delivery_status" :value="scope.row.deliveryStatus" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="120">
              <template slot-scope="scope">
                <el-button v-if="!viewModeOnly" type="text" size="mini" @click="openDeliveryInfoDialog(scope.row)">编辑</el-button>
                <el-button v-if="!viewModeOnly" type="text" size="mini" @click="removeDeliveryInfo(scope.$index)">移除</el-button>
                <span v-if="viewModeOnly">-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="确认收货时间" prop="receiveTime">
          <el-date-picker v-model="form.receiveTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择确认收货时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :disabled="viewModeOnly" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!viewModeOnly">确 定</el-button>
        <el-button @click="cancel">{{ viewModeOnly ? '关 闭' : '取 消' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="deliveryDialogTitle" :visible.sync="deliveryDialogVisible" width="600px" append-to-body>
      <el-form ref="deliveryForm" :model="deliveryForm" label-width="120px">
        <el-form-item label="运输编码" prop="transportCode">
          <el-input v-model="deliveryForm.transportCode" placeholder="自动生成" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前位置" prop="currentLongitude">
          <div style="display: flex; gap: 8px;">
            <el-input v-model="deliveryForm.currentLongitude" placeholder="经度" style="width: 45%;" />
            <el-input v-model="deliveryForm.currentLatitude" placeholder="纬度" style="width: 45%;" />
            <el-button size="mini" @click="openOrderMapPicker">地图选点</el-button>
          </div>
        </el-form-item>
        <el-form-item label="送货人姓名" prop="delivererName">
          <el-input v-model="deliveryForm.delivererName" placeholder="请输入送货人姓名" />
        </el-form-item>
        <el-form-item label="送货人电话" prop="delivererPhone">
          <el-input v-model="deliveryForm.delivererPhone" placeholder="请输入送货人电话" />
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input v-model="deliveryForm.vehicleNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-input v-model="deliveryForm.vehicleType" placeholder="请输入车辆类型" />
        </el-form-item>
        <el-form-item label="装猪数量" prop="loadCount">
          <el-input v-model="deliveryForm.loadCount" placeholder="请输入装猪数量" />
        </el-form-item>
        <el-form-item label="送货状态" prop="deliveryStatus">
          <el-select v-model="deliveryForm.deliveryStatus" placeholder="请选择送货状态">
            <el-option v-for="dict in dict.type.pig_delivery_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="deliveryForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliveryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDeliveryInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="地图选点" :visible.sync="orderMapDialogVisible" width="700px" append-to-body>
      <div v-loading="orderMapLoading" style="height: 360px;">
        <div :id="orderMapContainerId" style="height: 360px;"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderMapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmOrderMapPicker">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPigOrder, getPigOrder, delPigOrder, addPigOrder, updatePigOrder, getNextOrderNo } from "@/api/pig/pigOrder"
import { listEnterprise } from "@/api/pig/enterprise"
import { listBidProduct } from "@/api/pig/bidProduct"
import { listUserBid } from "@/api/pig/userBid"
import { listAddress } from "@/api/pig/address"
import { listPigResource } from "@/api/pig/pigResource"
import { listPigType } from "@/api/pig/pigType"
import { listSite } from "@/api/pig/site"
import { listDeliveryInfo, getDeliveryInfo, addDeliveryInfo, updateDeliveryInfo, getNextTransportCode } from "@/api/pig/deliveryInfo"
import pcasData from "@/assets/pcas-code.json"

export default {
  name: "PigOrder",
  dicts: ['pig_order_status', 'pig_order_source', 'pig_delivery_status'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      pigOrderList: [],
      title: "",
      open: false,
      viewMode: "table",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        orderStatus: undefined,
        orderSource: undefined,
        enterpriseId: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        orderNo: { label: '订单编号', visible: true },
        orderStatus: { label: '订单状态', visible: true },
        orderSource: { label: '订单来源', visible: true },
        enterpriseId: { label: '归属企业', visible: true },
        bidProductId: { label: '竞价商品', visible: true },
        userBidId: { label: '用户出价', visible: true },
        addressId: { label: '收货地址', visible: true },
        expectLoadTime: { label: '期望装车时间', visible: true },
        pigResourceId: { label: '生猪资源', visible: true },
        orderAmount: { label: '订单金额', visible: true },
        unitPrice: { label: '单价', visible: true },
        bidQuantity: { label: '竞拍数量', visible: true },
        payChannel: { label: '支付渠道', visible: true },
        payTime: { label: '支付时间', visible: true },
        loadTime: { label: '装货时间', visible: true },
        shipTime: { label: '发货时间', visible: true },
        deliveryInfoIds: { label: '送货信息id数组', visible: true },
        receiveTime: { label: '确认收货时间', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      enterpriseOptions: [],
      bidProductOptions: [],
      bidProductMap: {},
      userBidOptions: [],
      userBidMap: {},
      addressOptions: [],
      addressMap: {},
      pigResourceOptions: [],
      pigResourceMap: {},
      pigTypeOptions: [],
      pigTypeMap: {},
      siteOptions: [],
      siteMap: {},
      pcasCodeMap: {},
      viewModeOnly: false,
      deliveryInfoList: [],
      deliveryDialogVisible: false,
      deliveryDialogTitle: '新增送货信息',
      deliveryForm: {},
      editingDeliveryIndex: null,
      orderMapDialogVisible: false,
      orderMapContainerId: 'order-map-picker',
      orderMapInstance: null,
      orderMapMarker: null,
      orderMapLoading: false,
      orderMapSelectedLat: undefined,
      orderMapSelectedLng: undefined,
      form: {}
    }
  },
  created() {
    this.initPcasOptions()
    this.getList()
    this.loadEnterpriseOptions()
    this.loadBidProductOptions()
    this.loadUserBidOptions()
    this.loadAddressOptions()
    this.loadPigResourceOptions()
  },
  watch: {
    'form.unitPrice'() {
      this.updateOrderAmount()
    },
    'form.bidQuantity'() {
      this.updateOrderAmount()
    }
  },
  methods: {
    getList() {
      this.loading = true
      listPigOrder(this.queryParams).then(response => {
        this.pigOrderList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.viewModeOnly = false
      this.reset()
    },
    reset() {
      this.form = {
        id: undefined,
        orderNo: undefined,
        orderStatus: undefined,
        orderSource: undefined,
        enterpriseId: undefined,
        bidProductId: undefined,
        userBidId: undefined,
        addressId: undefined,
        expectLoadTime: undefined,
        remark: undefined,
        pigResourceId: undefined,
        orderAmount: undefined,
        bidQuantity: undefined,
        unitPrice: undefined,
        payChannel: undefined,
        payTime: undefined,
        loadTime: undefined,
        shipTime: undefined,
        deliveryInfoIds: undefined,
        receiveTime: undefined
      }
      this.deliveryInfoList = []
      this.resetForm("form")
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.viewModeOnly = false
      this.open = true
      this.title = "添加订单"
      getNextOrderNo().then(response => {
        this.$set(this.form, 'orderNo', response.data)
      })
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getPigOrder(id).then(async response => {
        this.form = response.data
        if (this.form.unitPrice == null) {
          this.form.unitPrice = this.calcUnitPrice(this.form.orderAmount, this.form.bidQuantity)
        }
        this.open = true
        this.title = "修改订单"
        await this.loadDeliveryInfosByIds(this.form.deliveryInfoIds)
      })
    },
    handleView(row) {
      this.reset()
      this.viewModeOnly = true
      const id = row.id || this.ids
      getPigOrder(id).then(async response => {
        this.form = response.data
        this.form.unitPrice = this.calcUnitPrice(this.form.orderAmount, this.form.bidQuantity)
        this.open = true
        this.title = "查看订单"
        await this.loadDeliveryInfosByIds(this.form.deliveryInfoIds)
      })
    },
    loadEnterpriseOptions() {
      listEnterprise({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.enterpriseOptions = response.rows || []
      })
    },
    loadBidProductOptions() {
      listBidProduct({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.bidProductOptions = response.rows || []
        this.bidProductMap = this.bidProductOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadUserBidOptions() {
      listUserBid({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.userBidOptions = response.rows || []
        this.userBidMap = this.userBidOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadAddressOptions() {
      listAddress({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.addressOptions = response.rows || []
        this.addressMap = this.addressOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadPigResourceOptions() {
      listPigResource({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.pigResourceOptions = response.rows || []
        this.pigResourceMap = this.pigResourceOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadPigTypeOptions() {
      listPigType({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.pigTypeOptions = response.rows || []
        this.pigTypeMap = this.pigTypeOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadSiteOptions() {
      listSite({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.siteOptions = response.rows || []
        this.siteMap = this.siteOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    handlePigResourceChange(value) {
      if (this.viewModeOnly) {
        return
      }
      const resource = value ? this.pigResourceMap[value] : null
      if (!resource) {
        return
      }
      if (resource.resourceUnitPrice != null) {
        this.$set(this.form, 'unitPrice', resource.resourceUnitPrice)
      }
    },
    initPcasOptions() {
      const rawList = Object.keys(pcasData)
        .map(key => pcasData[key])
      this.pcasCodeMap = {}
      this.normalizePcasTree(rawList, [], [])
    },
    normalizePcasTree(list, parentCodes, parentLabels) {
      return list.map(item => {
        const currentCodes = [...parentCodes, item.code]
        const currentLabels = [...parentLabels, item.name]
        this.pcasCodeMap[item.code] = {
          codes: currentCodes,
          labels: currentLabels
        }
        const children = item.children ? this.normalizePcasTree(item.children, currentCodes, currentLabels) : undefined
        return {
          value: item.code,
          label: item.name,
          children: children
        }
      })
    },
    formatAddressCode(code) {
      if (!code) return ""
      return this.pcasCodeMap[code] ? this.pcasCodeMap[code].labels.join("/") : code
    },
    formatAddressFull(code, detail) {
      const prefix = this.formatAddressCode(code)
      if (prefix && detail) {
        return `${prefix} ${detail}`
      }
      return prefix || detail || ''
    },
    getBidProductOptionLabel(item) {
      if (!item) return ''
      return item.bidProductCode || item.productName || item.productCode || item.id
    },
    getBidProductLabel(id) {
      if (!id) return '-'
      const item = this.bidProductMap[id]
      return item ? this.getBidProductOptionLabel(item) : id
    },
    getUserBidOptionLabel(item) {
      if (!item) return ''
      const price = item.price ? `单价${item.price}` : ''
      const quantity = item.quantity ? `数量${item.quantity}头` : ''
      const suffix = [price, quantity].filter(Boolean).join(' ')
      return suffix ? `#${item.id} ${suffix}` : `#${item.id}`
    },
    getUserBidLabel(id) {
      if (!id) return '-'
      const item = this.userBidMap[id]
      return item ? this.getUserBidOptionLabel(item) : id
    },
    getAddressOptionLabel(item) {
      if (!item) return ''
      return this.formatAddressFull(item.addressCode, item.detailAddress) || item.id
    },
    getAddressLabel(id) {
      if (!id) return '-'
      const item = this.addressMap[id]
      return item ? this.getAddressOptionLabel(item) : id
    },
    getPigResourceOptionLabel(item) {
      if (!item) return ''
      return item.resourceCode || item.id
    },
    getPigResourceLabel(id) {
      if (!id) return '-'
      const item = this.pigResourceMap[id]
      return item ? this.getPigResourceOptionLabel(item) : id
    },
    calcUnitPrice(orderAmount, bidQuantity) {
      const amount = Number(orderAmount)
      const quantity = Number(bidQuantity)
      if (!Number.isFinite(amount) || !Number.isFinite(quantity) || quantity <= 0) {
        return undefined
      }
      return Number((amount / quantity).toFixed(2))
    },
    updateOrderAmount() {
      if (this.viewModeOnly) {
        return
      }
      const unitPrice = Number(this.form.unitPrice)
      const quantity = Number(this.form.bidQuantity)
      if (!Number.isFinite(unitPrice) || !Number.isFinite(quantity) || quantity <= 0) {
        return
      }
      const amount = Number((unitPrice * quantity).toFixed(2))
      this.$set(this.form, 'orderAmount', amount)
    },
    getEnterpriseName(id) {
      if (!id) {
        return '-'
      }
      const match = this.enterpriseOptions.find(item => item.id === id)
      return match ? match.enterpriseName : id
    },
    resetDeliveryForm() {
      this.deliveryForm = {
        id: undefined,
        transportCode: undefined,
        currentLongitude: undefined,
        currentLatitude: undefined,
        delivererName: undefined,
        delivererPhone: undefined,
        vehicleNo: undefined,
        vehicleType: undefined,
        loadCount: undefined,
        deliveryStatus: undefined,
        remark: undefined
      }
      this.editingDeliveryIndex = null
    },
    openDeliveryInfoDialog(row) {
      this.resetDeliveryForm()
      if (row) {
        this.deliveryDialogTitle = '修改送货信息'
        this.deliveryForm = { ...row }
        this.editingDeliveryIndex = this.deliveryInfoList.findIndex(item => item.id === row.id)
      } else {
        this.deliveryDialogTitle = '新增送货信息'
        getNextTransportCode().then(response => {
          this.$set(this.deliveryForm, 'transportCode', response.data)
        })
      }
      this.deliveryDialogVisible = true
    },
    async saveDeliveryInfo() {
      const payload = { ...this.deliveryForm }
      if (payload.id) {
        await updateDeliveryInfo(payload)
        if (this.editingDeliveryIndex !== null && this.editingDeliveryIndex !== -1) {
          this.$set(this.deliveryInfoList, this.editingDeliveryIndex, payload)
        }
      } else {
        await addDeliveryInfo(payload)
        const res = await listDeliveryInfo({ transportCode: payload.transportCode, pageNum: 1, pageSize: 1 })
        if (res.rows && res.rows.length) {
          this.deliveryInfoList.push(res.rows[0])
        }
      }
      this.syncDeliveryInfoIds()
      this.deliveryDialogVisible = false
    },
    removeDeliveryInfo(index) {
      this.deliveryInfoList.splice(index, 1)
      this.syncDeliveryInfoIds()
    },
    syncDeliveryInfoIds() {
      const ids = this.deliveryInfoList.map(item => item.id).filter(Boolean)
      this.form.deliveryInfoIds = ids.length ? ids.join(',') : undefined
    },
    async loadDeliveryInfosByIds(ids) {
      this.deliveryInfoList = []
      if (!ids) {
        return
      }
      const idList = ids.split(',').map(item => item.trim()).filter(item => item)
      const results = await Promise.all(idList.map(id => getDeliveryInfo(id)))
      this.deliveryInfoList = results.map(result => result.data)
    },
    openOrderMapPicker() {
      this.orderMapSelectedLng = this.deliveryForm.currentLongitude ? Number(this.deliveryForm.currentLongitude) : undefined
      this.orderMapSelectedLat = this.deliveryForm.currentLatitude ? Number(this.deliveryForm.currentLatitude) : undefined
      this.orderMapDialogVisible = true
      this.$nextTick(() => {
        this.initOrderMap()
      })
    },
    ensureLeaflet() {
      if (window.L) {
        return Promise.resolve()
      }
      if (window._leafletLoading) {
        return window._leafletLoading
      }
      window._leafletLoading = new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Leaflet 加载失败'))
        document.body.appendChild(script)
      })
      return window._leafletLoading
    },
    initOrderMap() {
      this.orderMapLoading = true
      const defaultLat = this.orderMapSelectedLat || 31.2304
      const defaultLng = this.orderMapSelectedLng || 121.4737
      this.ensureLeaflet().then(() => {
        if (!this.orderMapInstance) {
          this.orderMapInstance = window.L.map(this.orderMapContainerId).setView([defaultLat, defaultLng], 12)
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(this.orderMapInstance)
          this.orderMapInstance.on('click', event => {
            this.orderMapSelectedLat = Number(event.latlng.lat.toFixed(6))
            this.orderMapSelectedLng = Number(event.latlng.lng.toFixed(6))
            if (!this.orderMapMarker) {
              this.orderMapMarker = window.L.marker([this.orderMapSelectedLat, this.orderMapSelectedLng]).addTo(this.orderMapInstance)
            } else {
              this.orderMapMarker.setLatLng([this.orderMapSelectedLat, this.orderMapSelectedLng])
            }
          })
        }
        this.orderMapInstance.setView([defaultLat, defaultLng], 12)
        if (this.orderMapSelectedLat && this.orderMapSelectedLng) {
          if (!this.orderMapMarker) {
            this.orderMapMarker = window.L.marker([this.orderMapSelectedLat, this.orderMapSelectedLng]).addTo(this.orderMapInstance)
          } else {
            this.orderMapMarker.setLatLng([this.orderMapSelectedLat, this.orderMapSelectedLng])
          }
        }
        this.$nextTick(() => {
          this.orderMapInstance.invalidateSize()
        })
      }).catch(() => {
        this.$modal.msgError('地图加载失败，请稍后重试')
      }).finally(() => {
        this.orderMapLoading = false
      })
    },
    confirmOrderMapPicker() {
      if (!this.orderMapSelectedLat || !this.orderMapSelectedLng) {
        this.$modal.msgWarning('请在地图上选择位置')
        return
      }
      this.deliveryForm.currentLongitude = String(this.orderMapSelectedLng)
      this.deliveryForm.currentLatitude = String(this.orderMapSelectedLat)
      this.orderMapDialogVisible = false
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.syncDeliveryInfoIds()
          this.updateOrderAmount()
          const payload = { ...this.form }
          if (payload.id != undefined) {
            updatePigOrder(payload).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addPigOrder(payload).then(() => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function() {
        return delPigOrder(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/pigOrder/export', {
        ...this.queryParams
      }, `pig_order_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
