<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="竞价商品" prop="bidProductId">
        <el-input v-model="queryParams.bidProductId" placeholder="请输入竞价商品id" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_user_bid_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:userBid:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:userBid:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:userBid:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:userBid:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userBidList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="用户id" align="center" prop="userId" v-if="columns.userId.visible" />
      <el-table-column label="企业id" align="center" prop="enterpriseId" v-if="columns.enterpriseId.visible" />
      <el-table-column label="竞价商品id" align="center" prop="bidProductId" v-if="columns.bidProductId.visible" />
      <el-table-column label="单价" align="center" prop="price" v-if="columns.price.visible" />
      <el-table-column label="数量" align="center" prop="quantity" v-if="columns.quantity.visible" />
      <el-table-column label="出价时间" align="center" prop="bidTime" v-if="columns.bidTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bidTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" v-if="columns.status.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_user_bid_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="总价" align="center" prop="totalPrice" v-if="columns.totalPrice.visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:userBid:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:userBid:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户出价对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="企业id" prop="enterpriseId">
          <el-input v-model="form.enterpriseId" placeholder="请输入企业id" />
        </el-form-item>
        <el-form-item label="竞价商品id" prop="bidProductId">
          <el-input v-model="form.bidProductId" placeholder="请输入竞价商品id" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="出价时间" prop="bidTime">
          <el-date-picker v-model="form.bidTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择出价时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="dict in dict.type.pig_user_bid_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入总价" />
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
import { listUserBid, getUserBid, delUserBid, addUserBid, updateUserBid } from "@/api/pig/userBid"

export default {
  name: "UserBid",
  dicts: ['pig_user_bid_status'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      userBidList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        bidProductId: undefined,
        status: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        userId: { label: '用户id', visible: true },
        enterpriseId: { label: '企业id', visible: true },
        bidProductId: { label: '竞价商品id', visible: true },
        price: { label: '单价', visible: true },
        quantity: { label: '数量', visible: true },
        bidTime: { label: '出价时间', visible: true },
        status: { label: '状态', visible: true },
        totalPrice: { label: '总价', visible: true },
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
      listUserBid(this.queryParams).then(response => {
        this.userBidList = response.rows
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
        enterpriseId: undefined,
        bidProductId: undefined,
        price: undefined,
        quantity: undefined,
        bidTime: undefined,
        status: undefined,
        totalPrice: undefined,
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
      this.title = "添加用户出价"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getUserBid(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改用户出价"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUserBid(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addUserBid(this.form).then(() => {
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
        return delUserBid(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/userBid/export', {
        ...this.queryParams
      }, `user_bid_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
