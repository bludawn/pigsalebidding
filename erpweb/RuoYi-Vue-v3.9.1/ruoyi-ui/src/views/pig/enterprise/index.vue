<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否认证" prop="isVerified">
        <el-select v-model="queryParams.isVerified" placeholder="请选择是否认证" clearable style="width: 240px">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:enterprise:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:enterprise:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:enterprise:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:enterprise:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="enterpriseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="企业名称" align="center" prop="enterpriseName" v-if="columns.enterpriseName.visible" :show-overflow-tooltip="true" />
      <el-table-column label="统一信用代码" align="center" prop="creditCode" v-if="columns.creditCode.visible" />
      <el-table-column label="法定代表人" align="center" prop="legalPerson" v-if="columns.legalPerson.visible" />
      <el-table-column label="联系人" align="center" prop="contactPerson" v-if="columns.contactPerson.visible" />
      <el-table-column label="联系电话" align="center" prop="contactPhone" v-if="columns.contactPhone.visible" />
      <el-table-column label="是否认证" align="center" prop="isVerified" v-if="columns.isVerified.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isVerified" />
        </template>
      </el-table-column>
      <el-table-column label="是否可竞价" align="center" prop="canBid" v-if="columns.canBid.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.canBid" />
        </template>
      </el-table-column>
      <el-table-column label="是否缴纳保证金" align="center" prop="hasDeposit" v-if="columns.hasDeposit.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.hasDeposit" />
        </template>
      </el-table-column>
      <el-table-column label="保证金" align="center" prop="depositAmount" v-if="columns.depositAmount.visible" />
      <el-table-column label="货款" align="center" prop="paymentAmount" v-if="columns.paymentAmount.visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:enterprise:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:enterprise:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="统一信用代码" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicenseUrl">
          <el-input v-model="form.businessLicenseUrl" placeholder="请输入营业执照URL" />
        </el-form-item>
        <el-form-item label="其他资料" prop="otherMaterialUrls">
          <el-input v-model="form.otherMaterialUrls" placeholder="请输入其他资料URL，多个用逗号隔开" />
        </el-form-item>
        <el-form-item label="是否认证" prop="isVerified">
          <el-select v-model="form.isVerified" placeholder="请选择是否认证">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可竞价" prop="canBid">
          <el-select v-model="form.canBid" placeholder="请选择是否可竞价">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否缴纳保证金" prop="hasDeposit">
          <el-select v-model="form.hasDeposit" placeholder="请选择是否缴纳保证金">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="保证金" prop="depositAmount">
          <el-input v-model="form.depositAmount" placeholder="请输入保证金" />
        </el-form-item>
        <el-form-item label="货款" prop="paymentAmount">
          <el-input v-model="form.paymentAmount" placeholder="请输入货款" />
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
import { listEnterprise, getEnterprise, delEnterprise, addEnterprise, updateEnterprise } from "@/api/pig/enterprise"

export default {
  name: "Enterprise",
  dicts: ['sys_yes_no'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      enterpriseList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: undefined,
        isVerified: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        enterpriseName: { label: '企业名称', visible: true },
        creditCode: { label: '统一信用代码', visible: true },
        legalPerson: { label: '法定代表人', visible: true },
        contactPerson: { label: '联系人', visible: true },
        contactPhone: { label: '联系电话', visible: true },
        isVerified: { label: '是否认证', visible: true },
        canBid: { label: '是否可竞价', visible: true },
        hasDeposit: { label: '是否缴纳保证金', visible: true },
        depositAmount: { label: '保证金', visible: true },
        paymentAmount: { label: '货款', visible: true },
        createTime: { label: '创建时间', visible: true }
      },
      form: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listEnterprise(this.queryParams).then(response => {
        this.enterpriseList = response.rows
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
        enterpriseName: undefined,
        creditCode: undefined,
        legalPerson: undefined,
        contactPerson: undefined,
        contactPhone: undefined,
        businessLicenseUrl: undefined,
        otherMaterialUrls: undefined,
        isVerified: undefined,
        canBid: undefined,
        hasDeposit: undefined,
        depositAmount: undefined,
        paymentAmount: undefined,
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
      this.title = "添加企业信息"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getEnterprise(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改企业信息"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateEnterprise(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addEnterprise(this.form).then(() => {
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
        return delEnterprise(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/enterprise/export', {
        ...this.queryParams
      }, `enterprise_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
