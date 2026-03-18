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
      <el-table-column label="资源编码" align="center" prop="resourceCode" v-if="columns.resourceCode.visible" :show-overflow-tooltip="true" />
      <el-table-column label="生猪类型id" align="center" prop="pigTypeId" v-if="columns.pigTypeId.visible" />
      <el-table-column label="场点id" align="center" prop="siteId" v-if="columns.siteId.visible" />
      <el-table-column label="资源来源" align="center" prop="resourceSource" v-if="columns.resourceSource.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_resource_source" :value="scope.row.resourceSource" />
        </template>
      </el-table-column>
      <el-table-column label="资源数量" align="center" prop="resourceCount" v-if="columns.resourceCount.visible" />
      <el-table-column label="资源单价" align="center" prop="resourceUnitPrice" v-if="columns.resourceUnitPrice.visible" />
      <el-table-column label="资源总价" align="center" prop="resourceTotalPrice" v-if="columns.resourceTotalPrice.visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
          <el-input v-model="form.resourceCode" placeholder="请输入资源编码" />
        </el-form-item>
        <el-form-item label="生猪类型id" prop="pigTypeId">
          <el-input v-model="form.pigTypeId" placeholder="请输入生猪类型id" />
        </el-form-item>
        <el-form-item label="场点id" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入场点id" />
        </el-form-item>
        <el-form-item label="资源来源" prop="resourceSource">
          <el-select v-model="form.resourceSource" placeholder="请选择资源来源">
            <el-option v-for="dict in dict.type.pig_resource_source" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="采购单id" prop="purchaseOrderId">
          <el-input v-model="form.purchaseOrderId" placeholder="请输入采购单id" />
        </el-form-item>
        <el-form-item label="资源数量" prop="resourceCount">
          <el-input v-model="form.resourceCount" placeholder="请输入资源数量" />
        </el-form-item>
        <el-form-item label="资源单价" prop="resourceUnitPrice">
          <el-input v-model="form.resourceUnitPrice" placeholder="请输入资源单价" />
        </el-form-item>
        <el-form-item label="资源总价" prop="resourceTotalPrice">
          <el-input v-model="form.resourceTotalPrice" placeholder="请输入资源总价" />
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
        pigTypeId: { label: '生猪类型id', visible: true },
        siteId: { label: '场点id', visible: true },
        resourceSource: { label: '资源来源', visible: true },
        resourceCount: { label: '资源数量', visible: true },
        resourceUnitPrice: { label: '资源单价', visible: true },
        resourceTotalPrice: { label: '资源总价', visible: true },
        createTime: { label: '创建时间', visible: true }
      },
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
    this.getList()
  },
  methods: {
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
      this.open = true
      this.title = "添加生猪资源"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getPigResource(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改生猪资源"
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
