<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户" prop="userId">
        <el-select v-model="queryParams.userId" placeholder="请选择用户" clearable filterable style="width: 240px">
          <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="竞价商品" prop="bidProductId">
        <el-select v-model="queryParams.bidProductId" placeholder="请选择竞价商品" clearable filterable style="width: 240px">
          <el-option v-for="item in bidProductOptions" :key="item.id" :label="item.productName || item.productCode || item.id" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:userBidInfo:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:userBidInfo:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:userBidInfo:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:userBidInfo:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userBidInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" prop="userId" v-if="columns.userId.visible">
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.userId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业" align="center" prop="enterpriseId" v-if="columns.enterpriseId.visible">
        <template slot-scope="scope">
          <span>{{ getEnterpriseName(scope.row.enterpriseId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞价商品" align="center" prop="bidProductId" v-if="columns.bidProductId.visible">
        <template slot-scope="scope">
          <span>{{ getBidProductName(scope.row.bidProductId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" align="center" prop="addressId" v-if="columns.addressId.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getAddressLabel(scope.row.addressId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="装车时间" align="center" prop="loadingTime" v-if="columns.loadingTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loadingTime) }}</span>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:userBidInfo:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:userBidInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户竞价信息维护对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择企业" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.enterpriseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞价商品" prop="bidProductId">
          <el-select v-model="form.bidProductId" placeholder="请选择竞价商品" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in bidProductOptions" :key="item.id" :label="item.productName || item.productCode || item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址" prop="addressId">
          <el-select v-model="form.addressId" placeholder="请选择收货地址" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in addressOptions" :key="item.id" :label="getAddressLabel(item.id)" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="装车时间" prop="loadingTime">
          <el-date-picker v-model="form.loadingTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择装车时间" :disabled="viewModeOnly"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :disabled="viewModeOnly" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!viewModeOnly">确 定</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserBidInfo, getUserBidInfo, delUserBidInfo, addUserBidInfo, updateUserBidInfo } from "@/api/pig/userBidInfo"
import { listUser } from "@/api/system/user"
import { listEnterprise } from "@/api/pig/enterprise"
import { listBidProduct } from "@/api/pig/bidProduct"
import { listAddress } from "@/api/pig/address"
import pcasData from "@/assets/pcas-code.json"

export default {
  name: "UserBidInfo",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      userBidInfoList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        bidProductId: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        userId: { label: '用户', visible: true },
        enterpriseId: { label: '企业', visible: true },
        bidProductId: { label: '竞价商品', visible: true },
        addressId: { label: '收货地址', visible: true },
        loadingTime: { label: '装车时间', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      userOptions: [],
      userMap: {},
      enterpriseOptions: [],
      enterpriseMap: {},
      bidProductOptions: [],
      bidProductMap: {},
      addressOptions: [],
      addressMap: {},
      viewModeOnly: false,
      pcasOptions: [],
      pcasCodeMap: {},
      form: {}
    }
  },
  created() {
    this.initPcasOptions()
    this.loadUserOptions()
    this.loadEnterpriseOptions()
    this.loadBidProductOptions()
    this.loadAddressOptions()
    this.getList()
  },
  methods: {
    initPcasOptions() {
      const rawList = Object.keys(pcasData)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => pcasData[key])
      this.pcasCodeMap = {}
      this.pcasOptions = this.normalizePcasTree(rawList, [], [])
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
      const region = this.formatAddressCode(code)
      if (region && detail) return `${region}${detail}`
      return region || detail || ""
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
    loadEnterpriseOptions() {
      listEnterprise({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.enterpriseOptions = response.rows || []
        this.enterpriseMap = this.enterpriseOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
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
    loadAddressOptions() {
      listAddress({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.addressOptions = response.rows || []
        this.addressMap = this.addressOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    getUserLabel(item) {
      if (!item) return ''
      return item.nickName || item.userName || item.userId
    },
    getUserName(id) {
      if (!id) return ""
      return this.userMap[id] ? this.getUserLabel(this.userMap[id]) : id
    },
    getEnterpriseName(id) {
      if (!id) return ""
      return this.enterpriseMap[id] ? this.enterpriseMap[id].enterpriseName : id
    },
    getBidProductName(id) {
      if (!id) return ""
      const item = this.bidProductMap[id]
      return item ? (item.productName || item.productCode || item.id) : id
    },
    getAddressLabel(id) {
      if (!id) return ""
      const address = this.addressMap[id]
      if (!address) return id
      return this.formatAddressFull(address.addressCode, address.detailAddress)
    },
    getList() {
      this.loading = true
      listUserBidInfo(this.queryParams).then(response => {
        this.userBidInfoList = response.rows
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
        userId: undefined,
        enterpriseId: undefined,
        bidProductId: undefined,
        addressId: undefined,
        loadingTime: undefined,
        remark: undefined
      }
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
      this.title = "添加用户竞价信息维护"
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getUserBidInfo(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改用户竞价信息维护"
      })
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getUserBidInfo(id).then(response => {
        this.form = response.data
        this.viewModeOnly = true
        this.open = true
        this.title = "查看用户竞价信息维护"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUserBidInfo(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addUserBidInfo(this.form).then(() => {
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
        return delUserBidInfo(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/userBidInfo/export', {
        ...this.queryParams
      }, `user_bid_info_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
