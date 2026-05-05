<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="名称" prop="accountName">
        <el-input v-model="queryParams.accountName" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="账户名" prop="holderName">
        <el-input v-model="queryParams.holderName" placeholder="请输入账户名" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:bankAccount:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:bankAccount:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:bankAccount:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:bankAccount:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bankAccountList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="名称" align="center" prop="accountName" v-if="columns.accountName.visible" :show-overflow-tooltip="true" />
      <el-table-column label="账户名" align="center" prop="holderName" v-if="columns.holderName.visible" :show-overflow-tooltip="true" />
      <el-table-column label="银行卡号" align="center" prop="bankCardNo" v-if="columns.bankCardNo.visible" :show-overflow-tooltip="true" />
      <el-table-column label="银行网点" align="center" prop="bankBranch" v-if="columns.bankBranch.visible" :show-overflow-tooltip="true" />
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:bankAccount:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:bankAccount:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="560px" append-to-body>
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="账户名" prop="holderName">
          <el-input v-model="form.holderName" placeholder="请输入账户名" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCardNo">
          <el-input v-model="form.bankCardNo" placeholder="请输入银行卡号" />
        </el-form-item>
        <el-form-item label="银行网点" prop="bankBranch">
          <el-input v-model="form.bankBranch" placeholder="请输入银行网点" />
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
import { listBankAccount, getBankAccount, delBankAccount, addBankAccount, updateBankAccount } from "@/api/pig/bankAccount"
import { listUser } from "@/api/system/user"

export default {
  name: "BankAccount",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      bankAccountList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountName: undefined,
        holderName: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        accountName: { label: '名称', visible: true },
        holderName: { label: '账户名', visible: true },
        bankCardNo: { label: '银行卡号', visible: true },
        bankBranch: { label: '银行网点', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      userOptions: [],
      userMap: {},
      form: {}
    }
  },
  created() {
    this.loadUserOptions()
    this.getList()
  },
  methods: {
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
    getList() {
      this.loading = true
      listBankAccount(this.queryParams).then(response => {
        this.bankAccountList = response.rows
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
        accountName: undefined,
        holderName: undefined,
        bankCardNo: undefined,
        bankBranch: undefined
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加银行账号"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids[0]
      getBankAccount(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改银行账号"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBankAccount(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addBankAccount(this.form).then(() => {
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
        return delBankAccount(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/bankAccount/export', {
        ...this.queryParams
      }, `bank_account_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
