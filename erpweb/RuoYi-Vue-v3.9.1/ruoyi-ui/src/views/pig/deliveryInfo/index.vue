<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="送货人" prop="delivererName">
        <el-input v-model="queryParams.delivererName" placeholder="请输入送货人姓名" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="送货状态" prop="deliveryStatus">
        <el-select v-model="queryParams.deliveryStatus" placeholder="请选择送货状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_delivery_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:deliveryInfo:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:deliveryInfo:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:deliveryInfo:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:deliveryInfo:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deliveryInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="送货人姓名" align="center" prop="delivererName" v-if="columns.delivererName.visible" />
      <el-table-column label="送货人电话" align="center" prop="delivererPhone" v-if="columns.delivererPhone.visible" />
      <el-table-column label="车牌号" align="center" prop="vehicleNo" v-if="columns.vehicleNo.visible" />
      <el-table-column label="车辆类型" align="center" prop="vehicleType" v-if="columns.vehicleType.visible" />
      <el-table-column label="装猪数量" align="center" prop="loadCount" v-if="columns.loadCount.visible" />
      <el-table-column label="送货状态" align="center" prop="deliveryStatus" v-if="columns.deliveryStatus.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_delivery_status" :value="scope.row.deliveryStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:deliveryInfo:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:deliveryInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改送货信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="送货人姓名" prop="delivererName">
          <el-input v-model="form.delivererName" placeholder="请输入送货人姓名" />
        </el-form-item>
        <el-form-item label="送货人电话" prop="delivererPhone">
          <el-input v-model="form.delivererPhone" placeholder="请输入送货人电话" />
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input v-model="form.vehicleNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-input v-model="form.vehicleType" placeholder="请输入车辆类型" />
        </el-form-item>
        <el-form-item label="装猪数量" prop="loadCount">
          <el-input v-model="form.loadCount" placeholder="请输入装猪数量" />
        </el-form-item>
        <el-form-item label="送货状态" prop="deliveryStatus">
          <el-select v-model="form.deliveryStatus" placeholder="请选择送货状态">
            <el-option v-for="dict in dict.type.pig_delivery_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
import { listDeliveryInfo, getDeliveryInfo, delDeliveryInfo, addDeliveryInfo, updateDeliveryInfo } from "@/api/pig/deliveryInfo"

export default {
  name: "DeliveryInfo",
  dicts: ['pig_delivery_status'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      deliveryInfoList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        delivererName: undefined,
        deliveryStatus: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        delivererName: { label: '送货人姓名', visible: true },
        delivererPhone: { label: '送货人电话', visible: true },
        vehicleNo: { label: '车牌号', visible: true },
        vehicleType: { label: '车辆类型', visible: true },
        loadCount: { label: '装猪数量', visible: true },
        deliveryStatus: { label: '送货状态', visible: true },
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
      listDeliveryInfo(this.queryParams).then(response => {
        this.deliveryInfoList = response.rows
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
        delivererName: undefined,
        delivererPhone: undefined,
        vehicleNo: undefined,
        vehicleType: undefined,
        loadCount: undefined,
        deliveryStatus: undefined,
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
      this.title = "添加送货信息"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDeliveryInfo(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改送货信息"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDeliveryInfo(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addDeliveryInfo(this.form).then(() => {
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
        return delDeliveryInfo(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/deliveryInfo/export', {
        ...this.queryParams
      }, `delivery_info_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
