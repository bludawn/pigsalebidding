<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="生猪名称" prop="pigName">
        <el-input v-model="queryParams.pigName" placeholder="请输入生猪名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生猪编码" prop="pigCode">
        <el-input v-model="queryParams.pigCode" placeholder="请输入生猪编码" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:pigType:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:pigType:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:pigType:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['pig:pigType:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:pigType:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pigTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="生猪名称" align="center" prop="pigName" v-if="columns.pigName.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.pigName || scope.row.pigCode || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="生猪编码" align="center" prop="pigCode" v-if="columns.pigCode.visible" :show-overflow-tooltip="true" />
      <el-table-column label="生猪介绍" align="center" prop="pigIntro" v-if="columns.pigIntro.visible" :show-overflow-tooltip="true" />
      <el-table-column label="生猪标签" align="center" prop="pigTagIds" v-if="columns.pigTagIds.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatPigTags(scope.row.pigTagIds) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体重区间" align="center" prop="weightRange" v-if="columns.weightRange.visible" />
      <el-table-column label="食料品质" align="center" prop="feedQuality" v-if="columns.feedQuality.visible" />
      <el-table-column label="防疫状态" align="center" prop="epidemicStatus" v-if="columns.epidemicStatus.visible" />
      <el-table-column label="无疫地区" align="center" prop="diseaseFreeRegion" v-if="columns.diseaseFreeRegion.visible" />
      <el-table-column label="生猪图片视频" align="center" prop="pigMedia" v-if="columns.pigMedia.visible">
        <template slot-scope="scope">
          <template v-if="getFirstMedia(scope.row.pigMedia)">
            <el-image
              v-if="!isVideoUrl(getFirstMedia(scope.row.pigMedia))"
              :src="getFirstMedia(scope.row.pigMedia)"
              :preview-src-list="getImageList(scope.row.pigMedia)"
              style="width: 40px; height: 40px"
              fit="cover"
            />
            <video
              v-else
              :src="getFirstMedia(scope.row.pigMedia)"
              style="width: 120px; height: 80px"
              controls
              preload="metadata"
            ></video>
          </template>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:pigType:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:pigType:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改生猪类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="生猪名称" prop="pigName">
          <el-input v-model="form.pigName" placeholder="请输入生猪名称" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="生猪编码" prop="pigCode">
          <el-input v-model="form.pigCode" placeholder="自动生成" :disabled="true" />
        </el-form-item>
        <el-form-item label="生猪介绍" prop="pigIntro">
          <el-input v-model="form.pigIntro" type="textarea" placeholder="请输入生猪介绍" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="生猪标签" prop="pigTagIds">
          <el-select v-model="form.pigTagIds" placeholder="请选择生猪标签" multiple filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in pigTagOptions" :key="item.id" :label="item.tagName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="体重区间" prop="weightRange">
          <el-input v-model="form.weightRange" placeholder="请输入体重区间" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="生猪图片视频" prop="pigMedia">
          <ImageUpload
            v-model="form.pigMedia"
            :disabled="viewModeOnly"
            :limit="9"
            :file-type="mediaFileTypes"
            :file-size="200"
          />
        </el-form-item>
        <el-form-item label="食料品质" prop="feedQuality">
          <el-input v-model="form.feedQuality" placeholder="请输入食料品质" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="防疫状态" prop="epidemicStatus">
          <el-input v-model="form.epidemicStatus" placeholder="请输入防疫状态" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="无疫地区" prop="diseaseFreeRegion">
          <el-input v-model="form.diseaseFreeRegion" placeholder="请输入无疫地区" :disabled="viewModeOnly" />
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

    <!-- 生猪类型导入对话框 -->
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
import { listPigType, getPigType, delPigType, addPigType, updatePigType, getNextPigTypeCode } from "@/api/pig/pigType"
import { listPigTag } from "@/api/pig/pigTag"
import ImageUpload from "@/components/ImageUpload"
import { getToken } from "@/utils/auth"

export default {
  name: "PigType",
  components: {
    ImageUpload
  },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      pigTypeList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pigName: undefined,
        pigCode: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        pigName: { label: '生猪名称', visible: true },
        pigCode: { label: '生猪编码', visible: true },
        pigIntro: { label: '生猪介绍', visible: true },
        pigTagIds: { label: '生猪标签', visible: true },
        weightRange: { label: '体重区间', visible: true },
        feedQuality: { label: '食料品质', visible: true },
        epidemicStatus: { label: '防疫状态', visible: true },
        diseaseFreeRegion: { label: '无疫地区', visible: true },
        pigMedia: { label: '生猪图片视频', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      pigTagOptions: [],
      pigTagMap: {},
      viewModeOnly: false,
      form: {},
      upload: {
        open: false,
        title: "",
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/pig/pigType/importData"
      },
      mediaFileTypes: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "mp4", "webm", "mov", "m4v", "avi"]
    }
  },
  created() {
    this.loadPigTagOptions()
    this.getList()
  },
  methods: {
    getUrlList(value) {
      if (!value) return []
      return value.split(',').map(item => item.trim()).filter(Boolean)
    },
    isVideoUrl(url) {
      return !!url && /\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i.test(url)
    },
    getFirstMedia(value) {
      const list = this.getUrlList(value)
      return list.length ? list[0] : ""
    },
    getImageList(value) {
      return this.getUrlList(value).filter(url => !this.isVideoUrl(url))
    },
    loadPigTagOptions() {
      listPigTag({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.pigTagOptions = response.rows || []
        this.pigTagMap = this.pigTagOptions.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {})
      })
    },
    normalizePigTagIds(value) {
      if (!value) return []
      if (Array.isArray(value)) return value
      return String(value)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => Number(item))
    },
    formatPigTags(value) {
      const ids = this.normalizePigTagIds(value)
      if (!ids.length) return ""
      return ids
        .map(id => (this.pigTagMap[id] ? this.pigTagMap[id].tagName : id))
        .join("、")
    },
    getList() {
      this.loading = true
      listPigType(this.queryParams).then(response => {
        this.pigTypeList = response.rows
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
        pigName: undefined,
        pigCode: undefined,
        pigIntro: undefined,
        pigTagIds: [],
        weightRange: undefined,
        pigMedia: undefined,
        feedQuality: undefined,
        epidemicStatus: undefined,
        diseaseFreeRegion: undefined,
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
      this.title = "添加生猪类型"
      getNextPigTypeCode().then(response => {
        this.$set(this.form, 'pigCode', response.data)
      })
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getPigType(id).then(response => {
        this.form = response.data
        this.form.pigTagIds = this.normalizePigTagIds(this.form.pigTagIds)
        this.open = true
        this.title = "修改生猪类型"
      })
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getPigType(id).then(response => {
        this.form = response.data
        this.form.pigTagIds = this.normalizePigTagIds(this.form.pigTagIds)
        this.viewModeOnly = true
        this.open = true
        this.title = "查看生猪类型"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const payload = {
            ...this.form,
            pigTagIds: this.form.pigTagIds && this.form.pigTagIds.length ? this.form.pigTagIds.join(',') : undefined
          }
          if (this.form.id != undefined) {
            updatePigType(payload).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addPigType(payload).then(() => {
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
        return delPigType(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/pigType/export', {
        ...this.queryParams
      }, `pig_type_${new Date().getTime()}.xlsx`)
    },
    handleImport() {
      this.upload.title = "生猪类型导入"
      this.upload.open = true
    },
    importTemplate() {
      this.download('pig/pigType/importTemplate', {}, `pig_type_template_${new Date().getTime()}.xlsx`)
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
