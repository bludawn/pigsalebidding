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
      <el-form-item label="支付状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_order_pay_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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

    <el-table v-loading="loading" :data="pigOrderList" border v-if="viewMode === 'table'" @selection-change="handleSelectionChange">
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
      <el-table-column label="支付状态" align="center" prop="payStatus" v-if="columns.payStatus.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_order_pay_status" :value="scope.row.payStatus" />
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
      <el-table-column label="生猪资源" align="center" prop="pigResourceId" v-if="columns.pigResourceId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getPigResourceLabel(scope.row.pigResourceId) }}</span>
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
      <el-table-column label="期望送达时间" align="center" prop="expectedDeliveryTime" v-if="columns.expectedDeliveryTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expectedDeliveryTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" prop="orderAmount" v-if="columns.orderAmount.visible" />
      <el-table-column label="首付货款" align="center" prop="firstPaymentAmount" v-if="columns.firstPaymentAmount.visible" />
      <el-table-column label="运费" align="center" prop="freightAmount" v-if="columns.freightAmount.visible" />
      <el-table-column label="剩余货款" align="center" prop="remainingPaymentAmount" v-if="columns.remainingPaymentAmount.visible" />
      <el-table-column label="收款账户" align="center" prop="bankAccountId" v-if="columns.bankAccountId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getBankAccountLabel(scope.row.bankAccountId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总重量(kg)" align="center" prop="totalWeight" v-if="columns.totalWeight.visible" />
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
      <el-table-column label="送货信息" align="center" prop="deliveryInfoIds" v-if="columns.deliveryInfoIds.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="white-space: nowrap;">{{ getDeliveryInfoLabel(scope.row.deliveryInfoIds) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认收货时间" align="center" prop="receiveTime" v-if="columns.receiveTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns.remark.visible" :show-overflow-tooltip="true" />
      <el-table-column label="创建人" align="center" v-if="columns.createBy.visible">
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.createBy) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" v-if="columns.updateBy.visible">
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.updateBy) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" v-if="columns.updateTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.orderStatus === 'WAIT_CONFIRM'"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleConfirmOrder(scope.row)"
            v-hasPermi="['pig:pigOrder:edit']"
          >订单确认</el-button>
          <el-button
            v-if="scope.row.payStatus === 'WAIT_CONFIRM_FIRST'"
            size="mini"
            type="text"
            icon="el-icon-money"
            @click="handleConfirmPayment(scope.row, 'FIRST')"
            v-hasPermi="['pig:pigOrder:edit']"
          >确认首付款</el-button>
          <el-button
            v-if="scope.row.payStatus === 'WAIT_CONFIRM_FINAL'"
            size="mini"
            type="text"
            icon="el-icon-money"
            @click="handleConfirmPayment(scope.row, 'FINAL')"
            v-hasPermi="['pig:pigOrder:edit']"
          >确认尾款</el-button>
          <el-button
            v-if="scope.row.orderStatus === 'WAIT_SHIP'"
            size="mini"
            type="text"
            icon="el-icon-truck"
            @click="handleShipOrder(scope.row)"
            v-hasPermi="['pig:pigOrder:edit']"
          >订单发货</el-button>
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
            <div>首付货款：{{ item.firstPaymentAmount }}</div>
            <div>运费：{{ item.freightAmount }}</div>
            <div>剩余货款：{{ item.remainingPaymentAmount }}</div>
            <div>收款账户：{{ getBankAccountLabel(item.bankAccountId) }}</div>
            <div>总重量(kg)：{{ item.totalWeight }}</div>
            <div>支付状态：<dict-tag :options="dict.type.pig_order_pay_status" :value="item.payStatus" /></div>
            <div>支付渠道：{{ item.payChannel }}</div>
            <div>支付时间：{{ parseTime(item.payTime) }}</div>
            <div>期望送达时间：{{ parseTime(item.expectedDeliveryTime) }}</div>
            <div>装货时间：{{ parseTime(item.loadTime) }}</div>
            <div>发货时间：{{ parseTime(item.shipTime) }}</div>
            <div>确认收货时间：{{ parseTime(item.receiveTime) }}</div>
            <div>送货信息：<span style="white-space: pre-line;">{{ getDeliveryInfoLabel(item.deliveryInfoIds) }}</span></div>
            <div>备注：{{ item.remark }}</div>
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <el-button
              v-if="item.orderStatus === 'WAIT_CONFIRM'"
              size="mini"
              type="text"
              icon="el-icon-check"
              @click="handleConfirmOrder(item)"
              v-hasPermi="['pig:pigOrder:edit']"
            >订单确认</el-button>
            <el-button
              v-if="item.payStatus === 'WAIT_CONFIRM_FIRST'"
              size="mini"
              type="text"
              icon="el-icon-money"
              @click="handleConfirmPayment(item, 'FIRST')"
              v-hasPermi="['pig:pigOrder:edit']"
            >确认首付款</el-button>
            <el-button
              v-if="item.payStatus === 'WAIT_CONFIRM_FINAL'"
              size="mini"
              type="text"
              icon="el-icon-money"
              @click="handleConfirmPayment(item, 'FINAL')"
              v-hasPermi="['pig:pigOrder:edit']"
            >确认尾款</el-button>
            <el-button
              v-if="item.orderStatus === 'WAIT_SHIP'"
              size="mini"
              type="text"
              icon="el-icon-truck"
              @click="handleShipOrder(item)"
              v-hasPermi="['pig:pigOrder:edit']"
            >订单发货</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(item)" v-hasPermi="['pig:pigOrder:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(item)" v-hasPermi="['pig:pigOrder:remove']">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <el-dialog title="订单确认" :visible.sync="confirmOpen" width="760px" append-to-body>
      <el-form :model="confirmForm" label-width="120px">
        <el-form-item label="订单编码">
          <el-input :value="confirmForm.orderNo || confirmForm.id" disabled />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input :value="getOrderStatusLabel(confirmForm.orderStatus)" disabled />
        </el-form-item>
        <el-form-item label="订单来源">
          <el-input :value="getOrderSourceLabel(confirmForm.orderSource)" disabled />
        </el-form-item>
        <el-form-item label="归属企业">
          <el-input :value="getEnterpriseName(confirmForm.enterpriseId)" disabled />
        </el-form-item>
        <el-form-item label="竞价商品">
          <el-input :value="getBidProductLabel(confirmForm.bidProductId)" disabled />
        </el-form-item>
        <el-form-item label="用户出价">
          <el-input :value="getUserBidLabel(confirmForm.userBidId)" disabled />
        </el-form-item>
        <el-form-item label="生猪资源">
          <el-input :value="getPigResourceLabel(confirmForm.pigResourceId)" disabled />
        </el-form-item>
        <el-form-item label="收货地址" prop="addressId">
          <el-input :value="getAddressLabel(confirmForm.addressId)" disabled />
        </el-form-item>
        <el-form-item label="期望送达时间" prop="expectedDeliveryTime">
          <el-input :value="parseTime(confirmForm.expectedDeliveryTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="竞拍数量(头)" prop="bidQuantity">
          <el-input :value="confirmForm.bidQuantity" disabled />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input :value="confirmForm.unitPrice" disabled />
        </el-form-item>
        <el-form-item label="总重量(kg)" prop="totalWeight">
          <el-input :value="confirmForm.totalWeight" disabled />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderAmount">
          <el-input :value="confirmForm.orderAmount" disabled />
        </el-form-item>
        <el-form-item label="首付货款" prop="firstPaymentAmount">
          <el-input :value="confirmForm.firstPaymentAmount" disabled />
        </el-form-item>
        <el-form-item label="收款银行账户" prop="bankAccountId">
          <el-input :value="getBankAccountLabel(confirmForm.bankAccountId)" disabled />
        </el-form-item>
        <el-form-item label="送货信息">
          <el-table :data="confirmDeliveryInfoList" size="mini" border style="width: 100%;">
            <el-table-column label="运输编码" prop="transportCode" min-width="140" />
            <el-table-column label="送货人" prop="delivererName" min-width="100" />
            <el-table-column label="电话" prop="delivererPhone" min-width="120" />
            <el-table-column label="车牌号" prop="vehicleNo" min-width="120" />
            <el-table-column label="车辆类型" min-width="120">
              <template slot-scope="scope">
                <span>{{ getVehicleTypeName(scope.row.vehicleTypeId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆来源" min-width="120">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.pig_vehicle_source" :value="scope.row.vehicleSource" />
              </template>
            </el-table-column>
            <el-table-column label="附件" min-width="160">
              <template slot-scope="scope">
                <div v-if="splitAttachmentUrls(scope.row.attachmentUrls).length">
                  <el-link
                    v-for="(url, idx) in splitAttachmentUrls(scope.row.attachmentUrls)"
                    :key="`${scope.row.id || 'confirm'}-${idx}`"
                    :href="normalizeFileUrl(url)"
                    target="_blank"
                    :underline="false"
                    type="primary"
                    style="margin-right: 8px;"
                  >附件{{ idx + 1 }}</el-link>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
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
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :value="confirmForm.remark || '-'" type="textarea" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirmOrder">确 认</el-button>
        <el-button @click="cancelConfirm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="paymentConfirmTitle" :visible.sync="paymentConfirmOpen" width="760px" append-to-body>
      <el-form :model="paymentConfirmForm" label-width="120px">
        <el-form-item label="订单编号">
          <el-input :value="paymentConfirmForm.orderNo || paymentConfirmForm.id" disabled />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input :value="getOrderStatusLabel(paymentConfirmForm.orderStatus)" disabled />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-input :value="getOrderPayStatusLabel(paymentConfirmForm.payStatus)" disabled />
        </el-form-item>
        <el-form-item label="订单来源">
          <el-input :value="getOrderSourceLabel(paymentConfirmForm.orderSource)" disabled />
        </el-form-item>
        <el-form-item label="归属企业">
          <el-input :value="getEnterpriseName(paymentConfirmForm.enterpriseId)" disabled />
        </el-form-item>
        <el-form-item label="竞价商品">
          <el-input :value="getBidProductLabel(paymentConfirmForm.bidProductId)" disabled />
        </el-form-item>
        <el-form-item label="用户出价">
          <el-input :value="getUserBidLabel(paymentConfirmForm.userBidId)" disabled />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input :value="getAddressLabel(paymentConfirmForm.addressId)" disabled />
        </el-form-item>
        <el-form-item label="期望送达时间">
          <el-input :value="parseTime(paymentConfirmForm.expectedDeliveryTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="生猪资源">
          <el-input :value="getPigResourceLabel(paymentConfirmForm.pigResourceId)" disabled />
        </el-form-item>
        <el-form-item label="竞拍数量(头)">
          <el-input :value="paymentConfirmForm.bidQuantity" disabled />
        </el-form-item>
        <el-form-item label="单价">
          <el-input :value="paymentConfirmForm.unitPrice" disabled />
        </el-form-item>
        <el-form-item label="总重量(kg)">
          <el-input :value="paymentConfirmForm.totalWeight" disabled />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input :value="paymentConfirmForm.orderAmount" disabled />
        </el-form-item>
        <el-form-item label="首付货款">
          <el-input :value="paymentConfirmForm.firstPaymentAmount" disabled />
        </el-form-item>
        <el-form-item label="运费">
          <el-input :value="paymentConfirmForm.freightAmount" disabled />
        </el-form-item>
        <el-form-item label="剩余货款">
          <el-input :value="paymentConfirmForm.remainingPaymentAmount" disabled />
        </el-form-item>
        <el-form-item label="收款银行账户">
          <el-input :value="getBankAccountLabel(paymentConfirmForm.bankAccountId)" disabled />
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="paymentConfirmForm.payTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择支付时间"
            clearable
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="装货时间">
          <el-input :value="parseTime(paymentConfirmForm.loadTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="发货时间">
          <el-input :value="parseTime(paymentConfirmForm.shipTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="确认收货时间">
          <el-input :value="parseTime(paymentConfirmForm.receiveTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="送货信息">
          <el-table :data="paymentDeliveryInfoList" size="mini" border style="width: 100%;">
            <el-table-column label="运输编码" prop="transportCode" min-width="140" />
            <el-table-column label="送货人" prop="delivererName" min-width="100" />
            <el-table-column label="电话" prop="delivererPhone" min-width="120" />
            <el-table-column label="车牌号" prop="vehicleNo" min-width="120" />
            <el-table-column label="车辆类型" min-width="120">
              <template slot-scope="scope">
                <span>{{ getVehicleTypeName(scope.row.vehicleTypeId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆来源" min-width="120">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.pig_vehicle_source" :value="scope.row.vehicleSource" />
              </template>
            </el-table-column>
            <el-table-column label="附件" min-width="160">
              <template slot-scope="scope">
                <div v-if="splitAttachmentUrls(scope.row.attachmentUrls).length">
                  <el-link
                    v-for="(url, idx) in splitAttachmentUrls(scope.row.attachmentUrls)"
                    :key="`${scope.row.id || 'payment'}-${idx}`"
                    :href="normalizeFileUrl(url)"
                    target="_blank"
                    :underline="false"
                    type="primary"
                    style="margin-right: 8px;"
                  >附件{{ idx + 1 }}</el-link>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
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
          </el-table>
        </el-form-item>
        <el-form-item label="支付渠道">
          <el-input v-model="paymentConfirmForm.payChannel" placeholder="请输入支付渠道" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="paymentConfirmForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPaymentConfirm">确 认</el-button>
        <el-button @click="cancelPaymentConfirm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认发货" :visible.sync="shipConfirmOpen" width="760px" append-to-body>
      <el-form :model="shipConfirmForm" label-width="120px">
        <el-form-item label="订单编号">
          <el-input :value="shipConfirmForm.orderNo || shipConfirmForm.id" disabled />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input :value="getOrderStatusLabel(shipConfirmForm.orderStatus)" disabled />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-input :value="getOrderPayStatusLabel(shipConfirmForm.payStatus)" disabled />
        </el-form-item>
        <el-form-item label="订单来源">
          <el-input :value="getOrderSourceLabel(shipConfirmForm.orderSource)" disabled />
        </el-form-item>
        <el-form-item label="归属企业">
          <el-input :value="getEnterpriseName(shipConfirmForm.enterpriseId)" disabled />
        </el-form-item>
        <el-form-item label="竞价商品">
          <el-input :value="getBidProductLabel(shipConfirmForm.bidProductId)" disabled />
        </el-form-item>
        <el-form-item label="用户出价">
          <el-input :value="getUserBidLabel(shipConfirmForm.userBidId)" disabled />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input :value="getAddressLabel(shipConfirmForm.addressId)" disabled />
        </el-form-item>
        <el-form-item label="期望送达时间">
          <el-input :value="parseTime(shipConfirmForm.expectedDeliveryTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="生猪资源">
          <el-input :value="getPigResourceLabel(shipConfirmForm.pigResourceId)" disabled />
        </el-form-item>
        <el-form-item label="竞拍数量(头)">
          <el-input :value="shipConfirmForm.bidQuantity" disabled />
        </el-form-item>
        <el-form-item label="单价">
          <el-input :value="shipConfirmForm.unitPrice" disabled />
        </el-form-item>
        <el-form-item label="总重量(kg)">
          <el-input :value="shipConfirmForm.totalWeight" disabled />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input :value="shipConfirmForm.orderAmount" disabled />
        </el-form-item>
        <el-form-item label="首付货款">
          <el-input :value="shipConfirmForm.firstPaymentAmount" disabled />
        </el-form-item>
        <el-form-item label="运费">
          <el-input v-model="shipConfirmForm.freightAmount" placeholder="请输入运费" />
        </el-form-item>
        <el-form-item label="剩余货款">
          <el-input v-model="shipConfirmForm.remainingPaymentAmount" placeholder="请输入剩余货款" />
        </el-form-item>
        <el-form-item label="收款银行账户">
          <el-select v-model="shipConfirmForm.bankAccountId" placeholder="请选择收款银行账户" filterable clearable style="width: 100%;">
            <el-option v-for="item in bankAccountOptions" :key="item.id" :label="getBankAccountOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付渠道">
          <el-input :value="shipConfirmForm.payChannel || '-'" disabled />
        </el-form-item>
        <el-form-item label="支付时间">
          <el-input :value="parseTime(shipConfirmForm.payTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="装货时间">
          <el-date-picker v-model="shipConfirmForm.loadTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择装货时间" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker v-model="shipConfirmForm.shipTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择发货时间" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="确认收货时间">
          <el-input :value="parseTime(shipConfirmForm.receiveTime) || '-'" disabled />
        </el-form-item>
        <el-form-item label="送货信息">
          <div style="margin-bottom: 8px;">
            <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="openShipDeliveryInfoDialog()">新增送货信息</el-button>
          </div>
          <el-table :data="shipDeliveryInfoList" size="mini" border style="width: 100%;">
            <el-table-column label="运输编码" prop="transportCode" min-width="140" />
            <el-table-column label="送货人" prop="delivererName" min-width="100" />
            <el-table-column label="电话" prop="delivererPhone" min-width="120" />
            <el-table-column label="车牌号" prop="vehicleNo" min-width="120" />
            <el-table-column label="车辆类型" min-width="120">
              <template slot-scope="scope">
                <span>{{ getVehicleTypeName(scope.row.vehicleTypeId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆来源" min-width="120">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.pig_vehicle_source" :value="scope.row.vehicleSource" />
              </template>
            </el-table-column>
            <el-table-column label="附件" min-width="160">
              <template slot-scope="scope">
                <div v-if="splitAttachmentUrls(scope.row.attachmentUrls).length">
                  <el-link
                    v-for="(url, idx) in splitAttachmentUrls(scope.row.attachmentUrls)"
                    :key="`${scope.row.id || 'ship'}-${idx}`"
                    :href="normalizeFileUrl(url)"
                    target="_blank"
                    :underline="false"
                    type="primary"
                    style="margin-right: 8px;"
                  >附件{{ idx + 1 }}</el-link>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
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
                <el-button type="text" size="mini" @click="openShipDeliveryInfoDialog(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="removeShipDeliveryInfo(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="shipConfirmForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShipConfirm">确 认</el-button>
        <el-button @click="cancelShipConfirm">取 消</el-button>
      </div>
    </el-dialog>

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
        <el-form-item label="支付状态" prop="payStatus">
          <el-select v-model="form.payStatus" placeholder="请选择支付状态" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.pig_order_pay_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
        <el-form-item label="期望送达时间" prop="expectedDeliveryTime">
          <el-date-picker v-model="form.expectedDeliveryTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择期望送达时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="生猪资源" prop="pigResourceId">
          <el-select v-model="form.pigResourceId" placeholder="请选择生猪资源" filterable clearable :disabled="viewModeOnly" @change="handlePigResourceChange">
            <el-option v-for="item in pigResourceOptions" :key="item.id" :label="getPigResourceOptionLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞拍数量(头)" prop="bidQuantity">
          <el-input v-model="form.bidQuantity" placeholder="请输入竞拍数量" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入单价" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="总重量(kg)" prop="totalWeight">
          <el-input v-model="form.totalWeight" placeholder="请输入总重量" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderAmount">
          <el-input v-model="form.orderAmount" placeholder="自动计算，可手工修改" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="首付货款" prop="firstPaymentAmount">
          <el-input v-model="form.firstPaymentAmount" placeholder="请输入首付货款" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="运费" prop="freightAmount">
          <el-input v-model="form.freightAmount" placeholder="请输入运费" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="剩余货款" prop="remainingPaymentAmount">
          <el-input v-model="form.remainingPaymentAmount" placeholder="请输入剩余货款" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="收款银行账户" prop="bankAccountId">
          <el-select v-model="form.bankAccountId" placeholder="请选择收款银行账户" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in bankAccountOptions" :key="item.id" :label="getBankAccountOptionLabel(item)" :value="item.id" />
          </el-select>
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
            <el-table-column label="车辆类型" min-width="120">
              <template slot-scope="scope">
                <span>{{ getVehicleTypeName(scope.row.vehicleTypeId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆来源" min-width="120">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.pig_vehicle_source" :value="scope.row.vehicleSource" />
              </template>
            </el-table-column>
            <el-table-column label="附件" min-width="160">
              <template slot-scope="scope">
                <div v-if="splitAttachmentUrls(scope.row.attachmentUrls).length">
                  <el-link
                    v-for="(url, idx) in splitAttachmentUrls(scope.row.attachmentUrls)"
                    :key="`${scope.row.id || 'order'}-${idx}`"
                    :href="normalizeFileUrl(url)"
                    target="_blank"
                    :underline="false"
                    type="primary"
                    style="margin-right: 8px;"
                  >附件{{ idx + 1 }}</el-link>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
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
        <el-form-item label="车辆类型" prop="vehicleTypeId">
          <el-select v-model="deliveryForm.vehicleTypeId" placeholder="请选择车辆类型" filterable clearable>
            <el-option v-for="item in vehicleTypeOptions" :key="item.id" :label="item.vehicleTypeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆来源" prop="vehicleSource">
          <el-select v-model="deliveryForm.vehicleSource" placeholder="请选择车辆来源" clearable>
            <el-option v-for="dictItem in dict.type.pig_vehicle_source" :key="dictItem.value" :label="dictItem.label" :value="dictItem.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrls">
          <file-upload v-model="deliveryForm.attachmentUrls" :limit="6" :file-size="50" :allow-any-type="true" action="/common/uploadAny" />
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
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <el-input v-model="orderMapKeyword" placeholder="搜索位置" size="mini" clearable @keyup.enter.native="searchOrderMap" />
        <el-button size="mini" type="primary" @click="searchOrderMap">搜索</el-button>
      </div>
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
import { listVehicleType } from "@/api/pig/vehicleType"
import { listBankAccount } from "@/api/pig/bankAccount"
import { listUser } from "@/api/system/user"
import pcasData from "@/assets/pcas-code.json"

export default {
  name: "PigOrder",
  dicts: ['pig_order_status', 'pig_order_source', 'pig_order_pay_status', 'pig_delivery_status', 'pig_vehicle_source'],
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
        payStatus: undefined,
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
        expectedDeliveryTime: { label: '期望送达时间', visible: true },
        pigResourceId: { label: '生猪资源', visible: true },
        orderAmount: { label: '订单金额', visible: true },
        firstPaymentAmount: { label: '首付货款', visible: true },
        freightAmount: { label: '运费', visible: true },
        remainingPaymentAmount: { label: '剩余货款', visible: true },
        bankAccountId: { label: '收款账户', visible: true },
        totalWeight: { label: '总重量(kg)', visible: true },
        unitPrice: { label: '单价', visible: true },
        bidQuantity: { label: '竞拍数量', visible: true },
        payStatus: { label: '支付状态', visible: true },
        payChannel: { label: '支付渠道', visible: true },
        payTime: { label: '支付时间', visible: true },
        loadTime: { label: '装货时间', visible: true },
        shipTime: { label: '发货时间', visible: true },
        deliveryInfoIds: { label: '送货信息', visible: true },
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
      vehicleTypeOptions: [],
      vehicleTypeMap: {},
      pigTypeOptions: [],
      pigTypeMap: {},
      siteOptions: [],
      siteMap: {},
      bankAccountOptions: [],
      bankAccountMap: {},
      userOptions: [],
      userMap: {},
      deliveryInfoMap: {},
      pcasCodeMap: {},
      viewModeOnly: false,
      deliveryInfoList: [],
      deliveryDialogVisible: false,
      deliveryDialogTitle: '新增送货信息',
      deliveryForm: {},
      editingDeliveryIndex: null,
      deliveryDialogScene: 'order',
      orderMapDialogVisible: false,
      orderMapContainerId: 'order-map-picker',
      orderMapInstance: null,
      orderMapMarker: null,
      orderMapLoading: false,
      orderMapSelectedLat: undefined,
      orderMapSelectedLng: undefined,
      orderMapKeyword: '',
      orderMapPlaceSearch: null,
      orderMapGeocoder: null,
      form: {},
      confirmOpen: false,
      confirmForm: {},
      paymentConfirmOpen: false,
      paymentConfirmTitle: '确认付款',
      paymentConfirmForm: {},
      paymentDeliveryInfoList: [],
      shipConfirmOpen: false,
      shipConfirmForm: {},
      confirmDeliveryInfoList: [],
      shipDeliveryInfoList: []
    }
  },
  created() {
    if (!Object.prototype.hasOwnProperty.call(this.$data, 'paymentDeliveryInfoList')) {
      this.$set(this, 'paymentDeliveryInfoList', [])
    }
    if (!Object.prototype.hasOwnProperty.call(this.$data, 'confirmDeliveryInfoList')) {
      this.$set(this, 'confirmDeliveryInfoList', [])
    }
    this.initPcasOptions()
    this.getList()
    this.loadEnterpriseOptions()
    this.loadBidProductOptions()
    this.loadUserBidOptions()
    this.loadAddressOptions()
    this.loadPigResourceOptions()
    this.loadPigTypeOptions()
    this.loadSiteOptions()
    this.loadVehicleTypeOptions()
    this.loadBankAccountOptions()
    this.loadUserOptions()
  },
  watch: {
    'form.unitPrice'() {
      this.updateOrderAmount()
    },
    'form.bidQuantity'() {
      this.updateOrderAmount()
    },
    'form.totalWeight'() {
      this.updateOrderAmount()
    }
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const response = await listPigOrder(this.queryParams)
        this.pigOrderList = response.rows
        this.total = response.total
        await this.preloadDeliveryInfoMap(this.pigOrderList)
      } finally {
        this.loading = false
      }
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
        payStatus: 'UNPAID',
        enterpriseId: undefined,
        bidProductId: undefined,
        userBidId: undefined,
        addressId: undefined,
        expectedDeliveryTime: undefined,
        remark: undefined,
        pigResourceId: undefined,
        orderAmount: undefined,
        firstPaymentAmount: undefined,
        freightAmount: undefined,
        remainingPaymentAmount: undefined,
        bankAccountId: undefined,
        totalWeight: undefined,
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
      this.$set(this.form, 'orderStatus', 'WAIT_CONFIRM')
      this.$set(this.form, 'payStatus', 'UNPAID')
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
          this.form.unitPrice = this.calcUnitPrice(this.form.orderAmount, this.form.totalWeight, this.form.bidQuantity)
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
        this.form.unitPrice = this.calcUnitPrice(this.form.orderAmount, this.form.totalWeight, this.form.bidQuantity)
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
    loadVehicleTypeOptions() {
      listVehicleType({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.vehicleTypeOptions = response.rows || []
        this.vehicleTypeMap = this.vehicleTypeOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadBankAccountOptions() {
      listBankAccount({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.bankAccountOptions = response.rows || []
        this.bankAccountMap = this.bankAccountOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    loadUserOptions() {
      listUser({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.userOptions = response.rows || []
        this.userMap = this.userOptions.reduce((acc, item) => {
          acc[item.userId] = item
          return acc
        }, {})
      })
    },
    getUserLabel(item) {
      if (!item) return ''
      return item.nickName || item.userName || item.userId
    },
    getUserName(id) {
      if (!id) return '-'
      const item = this.userMap[id]
      return item ? this.getUserLabel(item) : id
    },
    getBankAccountOptionLabel(item) {
      if (!item) return ''
      const card = item.bankCardNo || ''
      const tailNo = card.length > 4 ? card.slice(-4) : card
      return `${item.accountName || '收款账户'} / ${item.holderName || '-'} / 尾号${tailNo || '----'}`
    },
    getBankAccountLabel(id) {
      if (!id) return '-'
      const item = this.bankAccountMap[id]
      return item ? this.getBankAccountOptionLabel(item) : id
    },
    getVehicleTypeName(id) {
      if (!id) return '-'
      const item = this.vehicleTypeMap[id]
      return item ? item.vehicleTypeName : id
    },
    splitAttachmentUrls(value) {
      if (!value) return []
      return String(value).split(',').map(item => item.trim()).filter(Boolean)
    },
    normalizeFileUrl(url) {
      if (!url) return ''
      if (/^https?:\/\//i.test(url)) return url
      return `${this.baseApi}${url.startsWith('/') ? '' : '/'}${url}`
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
      const code = item.bidProductCode || item.id
      const siteName = this.getSiteName(item.siteId) || '-'
      const startPrice = item.startPrice != null ? item.startPrice : '-'
      const highestPrice = item.currentHighestPrice != null ? item.currentHighestPrice : '-'
      const quantity = item.totalHeadCount != null ? `${item.totalHeadCount}头` : '-'
      return `编码:${code} 场点名称:${siteName} 起始价:${startPrice} 最高价:${highestPrice} 数量:${quantity}`
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
      const code = item.resourceCode || item.id
      const pigType = this.getPigTypeName(item.pigTypeId) || '-'
      const count = item.resourceCount != null ? `${item.resourceCount}头` : '-'
      const price = item.resourceUnitPrice != null ? item.resourceUnitPrice : '-'
      return `编码:${code} 生猪类型名称:${pigType} 数量头数:${count} 单价:${price}`
    },
    getPigResourceLabel(id) {
      if (!id) return '-'
      const item = this.pigResourceMap[id]
      return item ? this.getPigResourceOptionLabel(item) : id
    },
    getPigTypeName(id) {
      if (!id) return ''
      const item = this.pigTypeMap[id]
      return item ? (item.pigName || item.pigCode || item.id) : id
    },
    getSiteName(id) {
      if (!id) return ''
      const item = this.siteMap[id]
      return item ? (item.siteName || item.id) : id
    },
    calcUnitPrice(orderAmount, totalWeight, bidQuantity) {
      const amount = Number(orderAmount)
      if (!Number.isFinite(amount) || amount <= 0) {
        return undefined
      }
      const weight = Number(totalWeight)
      if (Number.isFinite(weight) && weight > 0) {
        return Number((amount / weight).toFixed(2))
      }
      const quantity = Number(bidQuantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return undefined
      }
      return Number((amount / quantity).toFixed(2))
    },
    updateOrderAmount() {
      if (this.viewModeOnly) {
        return
      }
      const unitPrice = Number(this.form.unitPrice)
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        return
      }
      const totalWeight = Number(this.form.totalWeight)
      if (Number.isFinite(totalWeight) && totalWeight > 0) {
        const amount = Number((unitPrice * totalWeight).toFixed(2))
        this.$set(this.form, 'orderAmount', amount)
        return
      }
      const quantity = Number(this.form.bidQuantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
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
    getDictLabel(options, value) {
      if (!value || !options || !options.length) {
        return '-'
      }
      const match = options.find(item => item.value === value)
      return match ? match.label : value
    },
    getOrderStatusLabel(value) {
      return this.getDictLabel(this.dict.type.pig_order_status || [], value)
    },
    getOrderSourceLabel(value) {
      return this.getDictLabel(this.dict.type.pig_order_source || [], value)
    },
    getOrderPayStatusLabel(value) {
      return this.getDictLabel(this.dict.type.pig_order_pay_status || [], value)
    },
    resetConfirmForm() {
      this.confirmForm = {
        id: undefined,
        orderNo: undefined,
        orderStatus: undefined,
        orderSource: undefined,
        enterpriseId: undefined,
        bidProductId: undefined,
        userBidId: undefined,
        pigResourceId: undefined,
        addressId: undefined,
        expectedDeliveryTime: undefined,
        bidQuantity: undefined,
        unitPrice: undefined,
        totalWeight: undefined,
        orderAmount: undefined,
        firstPaymentAmount: undefined,
        bankAccountId: undefined,
        deliveryInfoIds: undefined,
        remark: undefined
      }
      this.confirmDeliveryInfoList = []
    },
    handleConfirmOrder(row) {
      const id = row.id
      if (!id) {
        this.$modal.msgWarning('订单ID不存在')
        return
      }
      this.resetConfirmForm()
      getPigOrder(id).then(async response => {
        const data = response.data || {}
        const deliveryInfoIds = data.deliveryInfoIds || row.deliveryInfoIds
        this.confirmForm = {
          ...this.confirmForm,
          ...data,
          deliveryInfoIds
        }
        if (this.confirmForm.unitPrice == null) {
          this.confirmForm.unitPrice = this.calcUnitPrice(this.confirmForm.orderAmount, this.confirmForm.totalWeight, this.confirmForm.bidQuantity)
        }
        await this.loadConfirmDeliveryInfosByIds(deliveryInfoIds)
        this.confirmOpen = true
      })
    },
    updateConfirmOrderAmount() {
      const unitPrice = Number(this.confirmForm.unitPrice)
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        return
      }
      const totalWeight = Number(this.confirmForm.totalWeight)
      if (Number.isFinite(totalWeight) && totalWeight > 0) {
        const amount = Number((unitPrice * totalWeight).toFixed(2))
        this.$set(this.confirmForm, 'orderAmount', amount)
        return
      }
      const quantity = Number(this.confirmForm.bidQuantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return
      }
      const amount = Number((unitPrice * quantity).toFixed(2))
      this.$set(this.confirmForm, 'orderAmount', amount)
    },
    cancelConfirm() {
      this.confirmOpen = false
      this.resetConfirmForm()
    },
    submitConfirmOrder() {
      const payload = {
        id: this.confirmForm.id,
        addressId: this.confirmForm.addressId,
        expectedDeliveryTime: this.confirmForm.expectedDeliveryTime,
        bidQuantity: this.confirmForm.bidQuantity,
        unitPrice: this.confirmForm.unitPrice,
        totalWeight: this.confirmForm.totalWeight,
        orderAmount: this.confirmForm.orderAmount,
        firstPaymentAmount: this.confirmForm.firstPaymentAmount,
        bankAccountId: this.confirmForm.bankAccountId,
        deliveryInfoIds: this.confirmForm.deliveryInfoIds,
        remark: this.confirmForm.remark,
        orderStatus: 'WAIT_PAY'
      }
      updatePigOrder(payload).then(() => {
        this.$modal.msgSuccess('订单确认成功，状态已变更为待付款')
        this.confirmOpen = false
        this.getList()
      })
    },
    resetPaymentConfirmForm() {
      this.paymentConfirmForm = {
        id: undefined,
        orderNo: undefined,
        orderStatus: undefined,
        payStatus: undefined,
        orderSource: undefined,
        enterpriseId: undefined,
        bidProductId: undefined,
        userBidId: undefined,
        addressId: undefined,
        expectedDeliveryTime: undefined,
        pigResourceId: undefined,
        bidQuantity: undefined,
        unitPrice: undefined,
        totalWeight: undefined,
        orderAmount: undefined,
        firstPaymentAmount: undefined,
        freightAmount: undefined,
        remainingPaymentAmount: undefined,
        bankAccountId: undefined,
        payChannel: undefined,
        payTime: undefined,
        loadTime: undefined,
        shipTime: undefined,
        deliveryInfoIds: undefined,
        receiveTime: undefined,
        remark: undefined
      }
      this.paymentDeliveryInfoList = []
    },
    handleConfirmPayment(row, type) {
      const id = row.id
      if (!id) {
        this.$modal.msgWarning('订单ID不存在')
        return
      }
      this.resetPaymentConfirmForm()
      getPigOrder(id).then(async response => {
        const data = response.data || {}
        const deliveryInfoIds = data.deliveryInfoIds || row.deliveryInfoIds
        this.paymentConfirmForm = {
          ...this.paymentConfirmForm,
          ...data,
          deliveryInfoIds
        }
        await this.loadPaymentDeliveryInfosByIds(deliveryInfoIds)
        this.paymentConfirmTitle = type === 'FINAL' ? '确认尾款' : '确认首付款'
        this.paymentConfirmOpen = true
      })
    },
    cancelPaymentConfirm() {
      this.paymentConfirmOpen = false
      this.resetPaymentConfirmForm()
    },
    submitPaymentConfirm() {
      let nextPayStatus = ''
      if (this.paymentConfirmForm.payStatus === 'WAIT_CONFIRM_FINAL') {
        nextPayStatus = 'CONFIRMED_FINAL'
      } else if (this.paymentConfirmForm.payStatus === 'WAIT_CONFIRM_FIRST') {
        nextPayStatus = 'CONFIRMED_FIRST'
      } else {
        this.$modal.msgWarning('当前支付状态不支持确认')
        return
      }
      const payload = {
        id: this.paymentConfirmForm.id,
        payStatus: nextPayStatus,
        payTime: this.paymentConfirmForm.payTime,
        payChannel: this.paymentConfirmForm.payChannel,
        remark: this.paymentConfirmForm.remark
      }
      updatePigOrder(payload).then(() => {
        this.$modal.msgSuccess('支付确认成功')
        this.paymentConfirmOpen = false
        this.getList()
      })
    },
    resetShipConfirmForm() {
      this.shipConfirmForm = {
        id: undefined,
        orderNo: undefined,
        orderStatus: undefined,
        payStatus: undefined,
        orderSource: undefined,
        enterpriseId: undefined,
        bidProductId: undefined,
        userBidId: undefined,
        addressId: undefined,
        expectedDeliveryTime: undefined,
        pigResourceId: undefined,
        bidQuantity: undefined,
        unitPrice: undefined,
        totalWeight: undefined,
        orderAmount: undefined,
        firstPaymentAmount: undefined,
        freightAmount: undefined,
        remainingPaymentAmount: undefined,
        bankAccountId: undefined,
        payChannel: undefined,
        payTime: undefined,
        loadTime: undefined,
        shipTime: undefined,
        deliveryInfoIds: undefined,
        receiveTime: undefined,
        remark: undefined
      }
      this.shipDeliveryInfoList = []
    },
    handleShipOrder(row) {
      const id = row.id
      if (!id) {
        this.$modal.msgWarning('订单ID不存在')
        return
      }
      this.resetShipConfirmForm()
      getPigOrder(id).then(async response => {
        const data = response.data || {}
        this.shipConfirmForm = {
          ...this.shipConfirmForm,
          ...data
        }
        await this.loadShipDeliveryInfosByIds(this.shipConfirmForm.deliveryInfoIds)
        this.shipConfirmOpen = true
      })
    },
    cancelShipConfirm() {
      this.shipConfirmOpen = false
      this.resetShipConfirmForm()
    },
    submitShipConfirm() {
      this.syncShipDeliveryInfoIds()
      const payload = {
        id: this.shipConfirmForm.id,
        freightAmount: this.shipConfirmForm.freightAmount,
        remainingPaymentAmount: this.shipConfirmForm.remainingPaymentAmount,
        bankAccountId: this.shipConfirmForm.bankAccountId,
        loadTime: this.shipConfirmForm.loadTime,
        shipTime: this.shipConfirmForm.shipTime,
        deliveryInfoIds: this.shipConfirmForm.deliveryInfoIds,
        remark: this.shipConfirmForm.remark,
        orderStatus: 'WAIT_RECEIVE'
      }
      updatePigOrder(payload).then(() => {
        this.$modal.msgSuccess('发货确认成功，订单状态已更新为待收货')
        this.shipConfirmOpen = false
        this.getList()
      })
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
        vehicleTypeId: undefined,
        vehicleSource: undefined,
        attachmentUrls: undefined,
        loadCount: undefined,
        deliveryStatus: undefined,
        remark: undefined
      }
      this.editingDeliveryIndex = null
    },
    openDeliveryInfoDialog(row) {
      this.deliveryDialogScene = 'order'
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
    openShipDeliveryInfoDialog(row) {
      this.deliveryDialogScene = 'ship'
      this.resetDeliveryForm()
      if (row) {
        this.deliveryDialogTitle = '修改送货信息'
        this.deliveryForm = { ...row }
        this.editingDeliveryIndex = this.shipDeliveryInfoList.findIndex(item => item.id === row.id)
      } else {
        this.deliveryDialogTitle = '新增送货信息'
        getNextTransportCode().then(response => {
          this.$set(this.deliveryForm, 'transportCode', response.data)
        })
      }
      this.deliveryDialogVisible = true
    },
    openConfirmDeliveryInfoDialog(row) {
      this.deliveryDialogScene = 'confirm'
      this.resetDeliveryForm()
      if (row) {
        this.deliveryDialogTitle = '修改送货信息'
        this.deliveryForm = { ...row }
        this.editingDeliveryIndex = this.confirmDeliveryInfoList.findIndex(item => item.id === row.id)
      } else {
        this.deliveryDialogTitle = '新增送货信息'
        getNextTransportCode().then(response => {
          this.$set(this.deliveryForm, 'transportCode', response.data)
        })
      }
      this.deliveryDialogVisible = true
    },
    openPaymentDeliveryInfoDialog(row) {
      this.deliveryDialogScene = 'payment'
      this.resetDeliveryForm()
      if (row) {
        this.deliveryDialogTitle = '修改送货信息'
        this.deliveryForm = { ...row }
        this.editingDeliveryIndex = this.paymentDeliveryInfoList.findIndex(item => item.id === row.id)
      } else {
        this.deliveryDialogTitle = '新增送货信息'
        getNextTransportCode().then(response => {
          this.$set(this.deliveryForm, 'transportCode', response.data)
        })
      }
      this.deliveryDialogVisible = true
    },
    getDeliveryTargetList() {
      if (this.deliveryDialogScene === 'ship') {
        return this.shipDeliveryInfoList
      }
      if (this.deliveryDialogScene === 'confirm') {
        return this.confirmDeliveryInfoList
      }
      if (this.deliveryDialogScene === 'payment') {
        return this.paymentDeliveryInfoList
      }
      return this.deliveryInfoList
    },
    syncDeliveryInfoIdsByScene() {
      if (this.deliveryDialogScene === 'ship') {
        this.syncShipDeliveryInfoIds()
        return
      }
      if (this.deliveryDialogScene === 'confirm') {
        this.syncConfirmDeliveryInfoIds()
        return
      }
      if (this.deliveryDialogScene === 'payment') {
        this.syncPaymentDeliveryInfoIds()
        return
      }
      this.syncDeliveryInfoIds()
    },
    async saveDeliveryInfo() {
      const payload = { ...this.deliveryForm }
      const targetList = this.getDeliveryTargetList()
      if (payload.id) {
        await updateDeliveryInfo(payload)
        if (this.editingDeliveryIndex !== null && this.editingDeliveryIndex !== -1) {
          this.$set(targetList, this.editingDeliveryIndex, payload)
        }
      } else {
        await addDeliveryInfo(payload)
        const res = await listDeliveryInfo({ transportCode: payload.transportCode, pageNum: 1, pageSize: 1 })
        if (res.rows && res.rows.length) {
          targetList.push(res.rows[0])
        }
      }
      this.syncDeliveryInfoIdsByScene()
      this.deliveryDialogVisible = false
    },
    removeDeliveryInfo(index) {
      this.deliveryInfoList.splice(index, 1)
      this.syncDeliveryInfoIds()
    },
    removeShipDeliveryInfo(index) {
      this.shipDeliveryInfoList.splice(index, 1)
      this.syncShipDeliveryInfoIds()
    },
    removeConfirmDeliveryInfo(index) {
      this.confirmDeliveryInfoList.splice(index, 1)
      this.syncConfirmDeliveryInfoIds()
    },
    removePaymentDeliveryInfo(index) {
      this.paymentDeliveryInfoList.splice(index, 1)
      this.syncPaymentDeliveryInfoIds()
    },
    syncDeliveryInfoIds() {
      const ids = this.deliveryInfoList.map(item => item.id).filter(Boolean)
      this.form.deliveryInfoIds = ids.length ? ids.join(',') : undefined
    },
    syncShipDeliveryInfoIds() {
      const ids = this.shipDeliveryInfoList.map(item => item.id).filter(Boolean)
      this.shipConfirmForm.deliveryInfoIds = ids.length ? ids.join(',') : undefined
    },
    syncConfirmDeliveryInfoIds() {
      const ids = this.confirmDeliveryInfoList.map(item => item.id).filter(Boolean)
      this.confirmForm.deliveryInfoIds = ids.length ? ids.join(',') : undefined
    },
    syncPaymentDeliveryInfoIds() {
      const ids = this.paymentDeliveryInfoList.map(item => item.id).filter(Boolean)
      this.paymentConfirmForm.deliveryInfoIds = ids.length ? ids.join(',') : undefined
    },
    formatDeliveryInfoSummary(item) {
      if (!item) return ''
      const delivererName = item.delivererName || '-'
      const vehicleNo = item.vehicleNo || '-'
      const vehicleType = this.getVehicleTypeName(item.vehicleTypeId) || '-'
      const deliveryStatus = this.getDictLabel(this.dict.type.pig_delivery_status || [], item.deliveryStatus) || '-'
      const loadCount = item.loadCount != null ? `${item.loadCount}头` : '-'
      return [delivererName, vehicleNo, vehicleType, deliveryStatus, loadCount].join(' ')
    },
    getDeliveryInfoLabel(ids) {
      const idList = this.parseDeliveryIdList(ids)
      if (!idList.length) return '-'
      const map = this.deliveryInfoMap || {}
      return idList.map(id => {
        const item = map[id]
        return item ? this.formatDeliveryInfoSummary(item) : `#${id}`
      }).join('； ')
    },
    async preloadDeliveryInfoMap(orderList) {
      const rows = Array.isArray(orderList) ? orderList : []
      const idSet = new Set()
      rows.forEach(row => {
        this.parseDeliveryIdList(row && row.deliveryInfoIds).forEach(id => idSet.add(id))
      })
      if (!idSet.size) {
        return
      }
      const currentMap = this.deliveryInfoMap || {}
      const missingIds = Array.from(idSet).filter(id => !currentMap[id])
      if (!missingIds.length) {
        return
      }
      const results = await Promise.allSettled(missingIds.map(id => getDeliveryInfo(id)))
      const nextMap = { ...currentMap }
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value && result.value.data) {
          nextMap[missingIds[index]] = result.value.data
        }
      })
      this.deliveryInfoMap = nextMap
    },
    parseDeliveryIdList(ids) {
      if (!ids) {
        return []
      }
      return String(ids)
        .replace(/[\[\]"'`]/g, ' ')
        .split(/[，,;；\s]+/)
        .map(item => item.trim())
        .filter(item => /^\d+$/.test(item))
    },
    async fetchDeliveryInfosByIds(ids) {
      const idList = this.parseDeliveryIdList(ids)
      if (!idList.length) {
        return []
      }
      const results = await Promise.allSettled(idList.map(id => getDeliveryInfo(id)))
      return results
        .filter(item => item.status === 'fulfilled' && item.value && item.value.data)
        .map(item => item.value.data)
    },
    async loadDeliveryInfosByIds(ids) {
      this.deliveryInfoList = await this.fetchDeliveryInfosByIds(ids)
    },
    async loadShipDeliveryInfosByIds(ids) {
      this.shipDeliveryInfoList = await this.fetchDeliveryInfosByIds(ids)
      this.syncShipDeliveryInfoIds()
    },
    async loadConfirmDeliveryInfosByIds(ids) {
      this.confirmDeliveryInfoList = await this.fetchDeliveryInfosByIds(ids)
    },
    async loadPaymentDeliveryInfosByIds(ids) {
      this.paymentDeliveryInfoList = await this.fetchDeliveryInfosByIds(ids)
    },
    openOrderMapPicker() {
      this.orderMapSelectedLng = this.deliveryForm.currentLongitude ? Number(this.deliveryForm.currentLongitude) : undefined
      this.orderMapSelectedLat = this.deliveryForm.currentLatitude ? Number(this.deliveryForm.currentLatitude) : undefined
      this.orderMapDialogVisible = true
      this.$nextTick(() => {
        this.initOrderMap()
      })
    },
    ensureAmap() {
      if (window.AMap) {
        return Promise.resolve(window.AMap)
      }
      if (window._amapLoading) {
        return window._amapLoading
      }
      const amapKey = window.AMAP_KEY || ''
      if (!amapKey) {
        return Promise.reject(new Error('Missing AMap key'))
      }
      window._amapLoading = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.Geocoder,AMap.PlaceSearch,AMap.ToolBar`
        script.onload = () => resolve(window.AMap)
        script.onerror = () => reject(new Error('AMap load failed'))
        document.body.appendChild(script)
      })
      return window._amapLoading
    },
    initOrderMap() {
      this.orderMapLoading = true
      const defaultLat = this.orderMapSelectedLat || 31.2304
      const defaultLng = this.orderMapSelectedLng || 121.4737
      this.ensureAmap().then(AMap => {
        if (!this.orderMapInstance) {
          this.orderMapInstance = new AMap.Map(this.orderMapContainerId, {
            zoom: 12,
            center: [defaultLng, defaultLat]
          })
          this.orderMapInstance.addControl(new AMap.ToolBar())
          this.orderMapGeocoder = new AMap.Geocoder({ city: '' })
          this.orderMapPlaceSearch = new AMap.PlaceSearch({ pageSize: 5, map: this.orderMapInstance })
          this.orderMapInstance.on('click', event => {
            const lng = Number(event.lnglat.lng.toFixed(6))
            const lat = Number(event.lnglat.lat.toFixed(6))
            this.orderMapSelectedLng = lng
            this.orderMapSelectedLat = lat
            if (!this.orderMapMarker) {
              this.orderMapMarker = new AMap.Marker({ position: [lng, lat] })
              this.orderMapInstance.add(this.orderMapMarker)
            } else {
              this.orderMapMarker.setPosition([lng, lat])
            }
            if (this.orderMapGeocoder) {
              this.orderMapGeocoder.getAddress([lng, lat], (status, result) => {
                if (status === 'complete' && result && result.regeocode) {
                  this.orderMapKeyword = result.regeocode.formattedAddress || this.orderMapKeyword
                }
              })
            }
          })
        }
        this.orderMapInstance.setZoomAndCenter(12, [defaultLng, defaultLat])
        if (this.orderMapSelectedLat && this.orderMapSelectedLng) {
          if (!this.orderMapMarker) {
            this.orderMapMarker = new AMap.Marker({ position: [this.orderMapSelectedLng, this.orderMapSelectedLat] })
            this.orderMapInstance.add(this.orderMapMarker)
          } else {
            this.orderMapMarker.setPosition([this.orderMapSelectedLng, this.orderMapSelectedLat])
          }
        }
        this.$nextTick(() => {
          this.orderMapInstance && this.orderMapInstance.resize()
        })
      }).catch(() => {
        this.$modal.msgError('地图加载失败，请检查高德地图 Key 配置')
      }).finally(() => {
        this.orderMapLoading = false
      })
    },
    searchOrderMap() {
      const keyword = (this.orderMapKeyword || '').trim()
      if (!keyword) {
        this.$modal.msgWarning('请输入搜索关键词')
        return
      }
      if (!this.orderMapInstance) {
        this.$modal.msgWarning('地图未初始化')
        return
      }
      if (!this.orderMapPlaceSearch && window.AMap) {
        this.orderMapPlaceSearch = new AMap.PlaceSearch({ pageSize: 5, map: this.orderMapInstance })
      }
      if (!this.orderMapGeocoder && window.AMap) {
        this.orderMapGeocoder = new AMap.Geocoder({ city: '' })
      }
      if (!this.orderMapPlaceSearch) {
        this.$modal.msgWarning('地图搜索未初始化')
        return
      }
      this.orderMapPlaceSearch.search(keyword, (status, result) => {
        if (status === 'complete' && result && result.poiList && result.poiList.pois && result.poiList.pois.length) {
          const poi = result.poiList.pois[0]
          const lng = Number(poi.location.lng.toFixed(6))
          const lat = Number(poi.location.lat.toFixed(6))
          this.orderMapSelectedLng = lng
          this.orderMapSelectedLat = lat
          if (!this.orderMapMarker) {
            this.orderMapMarker = new AMap.Marker({ position: [lng, lat] })
            this.orderMapInstance.add(this.orderMapMarker)
          } else {
            this.orderMapMarker.setPosition([lng, lat])
          }
          this.orderMapInstance.setZoomAndCenter(15, [lng, lat])
          if (poi.address || poi.name) {
            this.orderMapKeyword = `${poi.address || ''}${poi.name || ''}`
          }
          return
        }
        if (this.orderMapGeocoder) {
          this.orderMapGeocoder.getLocation(keyword, (geoStatus, geoResult) => {
            if (geoStatus === 'complete' && geoResult && geoResult.geocodes && geoResult.geocodes.length) {
              const location = geoResult.geocodes[0].location
              const lng = Number(location.lng.toFixed(6))
              const lat = Number(location.lat.toFixed(6))
              this.orderMapSelectedLng = lng
              this.orderMapSelectedLat = lat
              if (!this.orderMapMarker) {
                this.orderMapMarker = new AMap.Marker({ position: [lng, lat] })
                this.orderMapInstance.add(this.orderMapMarker)
              } else {
                this.orderMapMarker.setPosition([lng, lat])
              }
              this.orderMapInstance.setZoomAndCenter(15, [lng, lat])
              this.orderMapKeyword = geoResult.geocodes[0].formattedAddress || keyword
            } else {
              this.$modal.msgWarning('未找到匹配位置')
            }
          })
          return
        }
        this.$modal.msgWarning('未找到匹配位置')
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
