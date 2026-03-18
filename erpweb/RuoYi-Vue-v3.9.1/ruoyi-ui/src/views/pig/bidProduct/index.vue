<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品编码" prop="bidProductCode">
        <el-input v-model="queryParams.bidProductCode" placeholder="请输入商品编码" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="竞价状态" prop="bidStatus">
        <el-select v-model="queryParams.bidStatus" placeholder="请选择竞价状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_bid_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态" prop="approvalStatus">
        <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_approval_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:bidProduct:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:bidProduct:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:bidProduct:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['pig:bidProduct:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:bidProduct:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bidProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="商品编码" align="center" prop="bidProductCode" v-if="columns.bidProductCode.visible" :show-overflow-tooltip="true" />
      <el-table-column label="资源id" align="center" prop="pigResourceId" v-if="columns.pigResourceId.visible" />
      <el-table-column label="场点id" align="center" prop="siteId" v-if="columns.siteId.visible" />
      <el-table-column label="起始单价" align="center" prop="startPrice" v-if="columns.startPrice.visible" />
      <el-table-column label="开始时间" align="center" prop="startTime" v-if="columns.startTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" v-if="columns.endTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最高出价" align="center" prop="currentHighestPrice" v-if="columns.currentHighestPrice.visible" />
      <el-table-column label="竞价状态" align="center" prop="bidStatus" v-if="columns.bidStatus.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_bid_status" :value="scope.row.bidStatus" />
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="approvalStatus" v-if="columns.approvalStatus.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_approval_status" :value="scope.row.approvalStatus" />
        </template>
      </el-table-column>
      <el-table-column label="总头数" align="center" prop="totalHeadCount" v-if="columns.totalHeadCount.visible" />
      <el-table-column label="起拍头数" align="center" prop="startBidCount" v-if="columns.startBidCount.visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:bidProduct:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:bidProduct:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改竞价商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="商品编码" prop="bidProductCode">
          <el-input v-model="form.bidProductCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="资源id" prop="pigResourceId">
          <el-input v-model="form.pigResourceId" placeholder="请输入资源id" />
        </el-form-item>
        <el-form-item label="企业分组id" prop="enterpriseGroupId">
          <el-input v-model="form.enterpriseGroupId" placeholder="请输入企业分组id" />
        </el-form-item>
        <el-form-item label="场点id" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入场点id" />
        </el-form-item>
        <el-form-item label="起始单价" prop="startPrice">
          <el-input v-model="form.startPrice" placeholder="请输入起始单价" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="最高出价" prop="currentHighestPrice">
          <el-input v-model="form.currentHighestPrice" placeholder="请输入当前最高出价" />
        </el-form-item>
        <el-form-item label="竞价状态" prop="bidStatus">
          <el-select v-model="form.bidStatus" placeholder="请选择竞价状态">
            <el-option v-for="dict in dict.type.pig_bid_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态" prop="approvalStatus">
          <el-select v-model="form.approvalStatus" placeholder="请选择审批状态">
            <el-option v-for="dict in dict.type.pig_approval_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="总头数" prop="totalHeadCount">
          <el-input v-model="form.totalHeadCount" placeholder="请输入总头数" />
        </el-form-item>
        <el-form-item label="起拍头数" prop="startBidCount">
          <el-input v-model="form.startBidCount" placeholder="请输入起拍头数" />
        </el-form-item>
        <el-form-item label="加价幅度" prop="priceStep">
          <el-input v-model="form.priceStep" placeholder="请输入加价幅度" />
        </el-form-item>
        <el-form-item label="加拍价" prop="addPrice">
          <el-input v-model="form.addPrice" placeholder="请输入加拍价" />
        </el-form-item>
        <el-form-item label="竞价须知" prop="bidNotice">
          <el-input v-model="form.bidNotice" type="textarea" placeholder="请输入竞价须知" />
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

    <!-- 竞价商品导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBidProduct, getBidProduct, delBidProduct, addBidProduct, updateBidProduct } from "@/api/pig/bidProduct"
import { getToken } from "@/utils/auth"

export default {
  name: "BidProduct",
  dicts: ['pig_bid_status', 'pig_approval_status'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      bidProductList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bidProductCode: undefined,
        bidStatus: undefined,
        approvalStatus: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        bidProductCode: { label: '商品编码', visible: true },
        pigResourceId: { label: '资源id', visible: true },
        siteId: { label: '场点id', visible: true },
        startPrice: { label: '起始单价', visible: true },
        startTime: { label: '开始时间', visible: true },
        endTime: { label: '结束时间', visible: true },
        currentHighestPrice: { label: '最高出价', visible: true },
        bidStatus: { label: '竞价状态', visible: true },
        approvalStatus: { label: '审批状态', visible: true },
        totalHeadCount: { label: '总头数', visible: true },
        startBidCount: { label: '起拍头数', visible: true }
      },
      form: {},
      upload: {
        open: false,
        title: "",
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/pig/bidProduct/importData"
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listBidProduct(this.queryParams).then(response => {
        this.bidProductList = response.rows
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
        bidProductCode: undefined,
        pigResourceId: undefined,
        enterpriseGroupId: undefined,
        siteId: undefined,
        startPrice: undefined,
        startTime: undefined,
        endTime: undefined,
        currentHighestPrice: undefined,
        bidNotice: undefined,
        remark: undefined,
        totalHeadCount: undefined,
        startBidCount: undefined,
        priceStep: undefined,
        addPrice: undefined,
        bidStatus: undefined,
        approvalStatus: undefined
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
      this.title = "添加竞价商品"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBidProduct(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改竞价商品"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBidProduct(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addBidProduct(this.form).then(() => {
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
        return delBidProduct(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/bidProduct/export', {
        ...this.queryParams
      }, `bid_product_${new Date().getTime()}.xlsx`)
    },
    handleImport() {
      this.upload.title = "竞价商品导入"
      this.upload.open = true
    },
    importTemplate() {
      this.download('pig/bidProduct/importTemplate', {}, `bid_product_template_${new Date().getTime()}.xlsx`)
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true
    },
    handleFileSuccess(response) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true })
      this.getList()
    },
    submitFileForm() {
      const file = this.$refs.upload.uploadFiles
      if (!file || file.length === 0 || (!file[0].name.toLowerCase().endsWith('.xls') && !file[0].name.toLowerCase().endsWith('.xlsx'))) {
        this.$modal.msgError("请选择后缀为“xls”或“xlsx”的文件。")
        return
      }
      this.$refs.upload.submit()
    }
  }
}
</script>
