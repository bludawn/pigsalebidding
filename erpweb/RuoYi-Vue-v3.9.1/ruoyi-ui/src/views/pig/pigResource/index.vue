<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资源编码" prop="resourceCode">
        <el-input v-model="queryParams.resourceCode" placeholder="请输入资源编码" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="资源来源" prop="resourceSource">
        <el-select v-model="queryParams.resourceSource" placeholder="请选择资源来源" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_resource_source" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:pigResource:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:pigResource:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:pigResource:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['pig:pigResource:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:pigResource:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pigResourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="资源编码" align="center" prop="resourceCode" v-if="columns.resourceCode.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.resourceCode || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="生猪类型" align="center" prop="pigTypeId" v-if="columns.pigTypeId.visible">
        <template slot-scope="scope">
          <span>{{ getPigTypeName(scope.row.pigTypeId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场点" align="center" prop="siteId" v-if="columns.siteId.visible">
        <template slot-scope="scope">
          <span>{{ getSiteName(scope.row.siteId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源来源" align="center" prop="resourceSource" v-if="columns.resourceSource.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_resource_source" :value="scope.row.resourceSource" />
        </template>
      </el-table-column>
      <el-table-column label="采购单" align="center" prop="purchaseOrderId" v-if="columns.purchaseOrderId.visible" />
      <el-table-column label="资源数量" align="center" prop="resourceCount" v-if="columns.resourceCount.visible" />
      <el-table-column label="资源单价" align="center" prop="resourceUnitPrice" v-if="columns.resourceUnitPrice.visible" />
      <el-table-column label="资源总价" align="center" prop="resourceTotalPrice" v-if="columns.resourceTotalPrice.visible" />
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:pigResource:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:pigResource:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改生猪资源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="资源编码" prop="resourceCode">
          <el-input v-model="form.resourceCode" placeholder="请输入资源编码" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="生猪类型" prop="pigTypeId">
          <el-select v-model="form.pigTypeId" placeholder="请选择生猪类型" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in pigTypeOptions" :key="item.id" :label="item.pigName || item.pigCode || item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="场点" prop="siteId">
          <el-select v-model="form.siteId" placeholder="请选择场点" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in siteOptions" :key="item.id" :label="item.siteName || item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源来源" prop="resourceSource">
          <el-select v-model="form.resourceSource" placeholder="请选择资源来源" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.pig_resource_source" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="采购单id" prop="purchaseOrderId">
          <el-input v-model="form.purchaseOrderId" placeholder="请输入采购单id" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="资源数量" prop="resourceCount">
          <el-input v-model="form.resourceCount" placeholder="请输入资源数量" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="资源单价" prop="resourceUnitPrice">
          <el-input v-model="form.resourceUnitPrice" placeholder="请输入资源单价" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="资源总价" prop="resourceTotalPrice">
          <el-input v-model="form.resourceTotalPrice" placeholder="请输入资源总价" :disabled="viewModeOnly" />
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

    <!-- 生猪资源导入对话框 -->
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
import { listPigResource, getPigResource, delPigResource, addPigResource, updatePigResource } from "@/api/pig/pigResource"
import { listPigType } from "@/api/pig/pigType"
import { listSite } from "@/api/pig/site"
import { getToken } from "@/utils/auth"

export default {
  name: "PigResource",
  dicts: ['pig_resource_source'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      pigResourceList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        resourceCode: undefined,
        resourceSource: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        resourceCode: { label: '资源编码', visible: true },
        pigTypeId: { label: '生猪类型', visible: true },
        siteId: { label: '场点', visible: true },
        resourceSource: { label: '资源来源', visible: true },
        purchaseOrderId: { label: '采购单', visible: true },
        resourceCount: { label: '资源数量', visible: true },
        resourceUnitPrice: { label: '资源单价', visible: true },
        resourceTotalPrice: { label: '资源总价', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      pigTypeOptions: [],
      pigTypeMap: {},
      siteOptions: [],
      siteMap: {},
      viewModeOnly: false,
      form: {},
      upload: {
        open: false,
        title: "",
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/pig/pigResource/importData"
      }
    }
  },
  created() {
    this.loadPigTypeOptions()
    this.loadSiteOptions()
    this.getList()
  },
  methods: {
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
    getPigTypeName(id) {
      if (!id) return ""
      const item = this.pigTypeMap[id]
      return item ? (item.pigName || item.pigCode || item.id) : id
    },
    getSiteName(id) {
      if (!id) return ""
      const item = this.siteMap[id]
      return item ? (item.siteName || item.id) : id
    },
    getList() {
      this.loading = true
      listPigResource(this.queryParams).then(response => {
        this.pigResourceList = response.rows
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
        resourceCode: undefined,
        pigTypeId: undefined,
        siteId: undefined,
        resourceSource: undefined,
        purchaseOrderId: undefined,
        resourceCount: undefined,
        resourceUnitPrice: undefined,
        resourceTotalPrice: undefined,
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
      this.title = "添加生猪资源"
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getPigResource(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改生猪资源"
      })
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getPigResource(id).then(response => {
        this.form = response.data
        this.viewModeOnly = true
        this.open = true
        this.title = "查看生猪资源"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePigResource(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addPigResource(this.form).then(() => {
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
        return delPigResource(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/pigResource/export', {
        ...this.queryParams
      }, `pig_resource_${new Date().getTime()}.xlsx`)
    },
    handleImport() {
      this.upload.title = "生猪资源导入"
      this.upload.open = true
    },
    importTemplate() {
      this.download('pig/pigResource/importTemplate', {}, `pig_resource_template_${new Date().getTime()}.xlsx`)
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
