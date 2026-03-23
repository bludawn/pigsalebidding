<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-select v-model="queryParams.isDefault" placeholder="请选择是否默认" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:address:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:address:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:address:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:address:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="用户id" align="center" prop="userId" v-if="columns.userId.visible" />
      <el-table-column label="联系人姓名" align="center" prop="contactName" v-if="columns.contactName.visible" />
      <el-table-column label="联系人电话" align="center" prop="contactPhone" v-if="columns.contactPhone.visible" />
      <el-table-column label="地区" align="center" prop="addressCode" v-if="columns.addressCode.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatAddressCode(scope.row.addressCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="detailAddress" v-if="columns.detailAddress.visible" :show-overflow-tooltip="true" />
      <el-table-column label="默认地址" align="center" prop="isDefault" v-if="columns.isDefault.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isDefault" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:address:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:address:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改地址管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="地区" prop="addressCodeList">
          <el-cascader
            v-model="form.addressCodeList"
            :options="pcasOptions"
            :props="pcasProps"
            clearable
            filterable
            placeholder="请选择地区"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="form.detailAddress" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-select v-model="form.isDefault" placeholder="请选择是否默认">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, addAddress, updateAddress } from "@/api/pig/address"
import pcasData from "@/assets/pcas-code.json"

export default {
  name: "Address",
  dicts: ['sys_yes_no'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      addressList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        isDefault: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        userId: { label: '用户id', visible: true },
        contactName: { label: '联系人姓名', visible: true },
        contactPhone: { label: '联系人电话', visible: true },
        addressCode: { label: '地区', visible: true },
        detailAddress: { label: '详细地址', visible: true },
        isDefault: { label: '是否默认', visible: true },
        createTime: { label: '创建时间', visible: true }
      },
      pcasOptions: [],
      pcasCodeMap: {},
      pcasProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      form: {}
    }
  },
  created() {
    this.initPcasOptions()
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
    getCodePath(code) {
      return this.pcasCodeMap[code] ? this.pcasCodeMap[code].codes : []
    },
    formatAddressCode(code) {
      if (!code) return ""
      return this.pcasCodeMap[code] ? this.pcasCodeMap[code].labels.join("/") : code
    },
    getList() {
      this.loading = true
      listAddress(this.queryParams).then(response => {
        this.addressList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    reset() {
      this.form = {
        id: undefined,
        userId: undefined,
        contactName: undefined,
        contactPhone: undefined,
        addressCode: undefined,
        addressCodeList: [],
        detailAddress: undefined,
        isDefault: undefined,
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
      this.open = true
      this.title = "添加地址管理"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data
        this.form.addressCodeList = this.getCodePath(this.form.addressCode)
        this.open = true
        this.title = "修改地址管理"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.addressCodeList && this.form.addressCodeList.length) {
            this.form.addressCode = this.form.addressCodeList[this.form.addressCodeList.length - 1]
          } else {
            this.form.addressCode = undefined
          }
          if (this.form.isDefault !== undefined && this.form.isDefault !== null && this.form.isDefault !== "") {
            this.form.isDefault = Number(this.form.isDefault)
          }
          if (this.form.id != undefined) {
            updateAddress(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addAddress(this.form).then(() => {
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
        return delAddress(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/address/export', {
        ...this.queryParams
      }, `address_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
