<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="场点名称" prop="siteName">
        <el-input v-model="queryParams.siteName" placeholder="请输入场点名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="场点地址" prop="siteAddress">
        <el-input v-model="queryParams.siteAddress" placeholder="请输入场点地址" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:site:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:site:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:site:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['pig:site:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:site:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="场点名称" align="center" prop="siteName" v-if="columns.siteName.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.siteName || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="场点电话" align="center" prop="sitePhone" v-if="columns.sitePhone.visible" />
      <el-table-column label="场点地区" align="center" prop="siteAddressCode" v-if="columns.siteAddressCode.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatSiteAddressCode(scope.row.siteAddressCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场点地址" align="center" prop="siteAddress" v-if="columns.siteAddress.visible" :show-overflow-tooltip="true" />
      <el-table-column label="完整地址" align="center" v-if="columns.fullAddress.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatSiteFullAddress(scope.row.siteAddressCode, scope.row.siteAddress) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场点介绍" align="center" prop="siteIntro" v-if="columns.siteIntro.visible" :show-overflow-tooltip="true" />
      <el-table-column label="场点图片" align="center" prop="siteImages" v-if="columns.siteImages.visible">
        <template slot-scope="scope">
          <el-image
            v-if="getFirstUrl(scope.row.siteImages)"
            :src="getFirstUrl(scope.row.siteImages)"
            :preview-src-list="getUrlList(scope.row.siteImages)"
            style="width: 40px; height: 40px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="场点视频" align="center" prop="siteVideos" v-if="columns.siteVideos.visible">
        <template slot-scope="scope">
          <video
            v-if="getFirstUrl(scope.row.siteVideos)"
            :src="getFirstUrl(scope.row.siteVideos)"
            style="width: 120px; height: 80px"
            controls
            preload="metadata"
          ></video>
        </template>
      </el-table-column>
      <el-table-column label="经纬度" align="center" prop="siteLocation" v-if="columns.siteLocation.visible" />
      <el-table-column label="所属企业" align="center" prop="enterpriseId" v-if="columns.enterpriseId.visible">
        <template slot-scope="scope">
          <span>{{ getEnterpriseName(scope.row.enterpriseId) }}</span>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:site:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:site:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改场点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择所属企业" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.enterpriseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="场点名称" prop="siteName">
          <el-input v-model="form.siteName" placeholder="请输入场点名称" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="场点地区" prop="siteAddressCodeList">
          <el-cascader
            v-model="form.siteAddressCodeList"
            :options="pcasOptions"
            :props="pcasProps"
            clearable
            filterable
            placeholder="请选择场点地区"
            :disabled="viewModeOnly"
          />
        </el-form-item>
        <el-form-item label="场点地址" prop="siteAddress">
          <el-input v-model="form.siteAddress" placeholder="请输入详细地址" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="经纬度" prop="siteLocation">
          <el-input v-model="form.siteLocation" placeholder="请输入经纬度坐标" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="场点电话" prop="sitePhone">
          <el-input v-model="form.sitePhone" placeholder="请输入场点电话" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="场点介绍" prop="siteIntro">
          <el-input v-model="form.siteIntro" type="textarea" placeholder="请输入场点介绍" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="场点图片" prop="siteImages">
          <el-input v-model="form.siteImages" placeholder="请输入图片URL，多个用逗号隔开" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="场点视频" prop="siteVideos">
          <el-input v-model="form.siteVideos" placeholder="请输入视频URL，多个用逗号隔开" :disabled="viewModeOnly" />
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

    <!-- 场点导入对话框 -->
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
import { listSite, getSite, delSite, addSite, updateSite } from "@/api/pig/site"
import { listEnterprise } from "@/api/pig/enterprise"
import { getToken } from "@/utils/auth"
import pcasData from "@/assets/pcas-code.json"

export default {
  name: "Site",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      siteList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName: undefined,
        siteAddress: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        siteName: { label: '场点名称', visible: true },
        sitePhone: { label: '场点电话', visible: true },
        siteAddressCode: { label: '场点地区', visible: true },
        siteAddress: { label: '场点地址', visible: true },
        fullAddress: { label: '完整地址', visible: true },
        siteIntro: { label: '场点介绍', visible: true },
        siteImages: { label: '场点图片', visible: true },
        siteVideos: { label: '场点视频', visible: true },
        siteLocation: { label: '经纬度', visible: true },
        enterpriseId: { label: '所属企业', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      enterpriseOptions: [],
      enterpriseMap: {},
      viewModeOnly: false,
      pcasOptions: [],
      pcasCodeMap: {},
      pcasProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      form: {},
      upload: {
        open: false,
        title: "",
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/pig/site/importData"
      }
    }
  },
  created() {
    this.initPcasOptions()
    this.loadEnterpriseOptions()
    this.getList()
  },
  methods: {
    getUrlList(value) {
      if (!value) return []
      return value.split(',').map(item => item.trim()).filter(Boolean)
    },
    getFirstUrl(value) {
      const list = this.getUrlList(value)
      return list.length ? list[0] : ""
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
    getEnterpriseName(id) {
      if (!id) return ""
      return this.enterpriseMap[id] ? this.enterpriseMap[id].enterpriseName : id
    },
    formatSiteFullAddress(code, detail) {
      const region = this.formatSiteAddressCode(code)
      if (region && detail) return `${region}${detail}`
      return region || detail || ""
    },
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
    formatSiteAddressCode(code) {
      if (!code) return ""
      return this.pcasCodeMap[code] ? this.pcasCodeMap[code].labels.join("/") : code
    },
    getList() {
      this.loading = true
      listSite(this.queryParams).then(response => {
        this.siteList = response.rows
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
        enterpriseId: undefined,
        siteName: undefined,
        siteAddress: undefined,
        siteAddressCode: undefined,
        siteAddressCodeList: [],
        siteLocation: undefined,
        sitePhone: undefined,
        siteIntro: undefined,
        siteImages: undefined,
        siteVideos: undefined,
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
      this.title = "添加场点"
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getSite(id).then(response => {
        this.form = response.data
        this.form.siteAddressCodeList = this.getCodePath(this.form.siteAddressCode)
        this.open = true
        this.title = "修改场点"
      })
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getSite(id).then(response => {
        this.form = response.data
        this.form.siteAddressCodeList = this.getCodePath(this.form.siteAddressCode)
        this.viewModeOnly = true
        this.open = true
        this.title = "查看场点"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.siteAddressCodeList && this.form.siteAddressCodeList.length) {
            this.form.siteAddressCode = this.form.siteAddressCodeList[this.form.siteAddressCodeList.length - 1]
          } else {
            this.form.siteAddressCode = undefined
          }
          if (this.form.id != undefined) {
            updateSite(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addSite(this.form).then(() => {
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
        return delSite(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/site/export', {
        ...this.queryParams
      }, `site_${new Date().getTime()}.xlsx`)
    },
    handleImport() {
      this.upload.title = "场点导入"
      this.upload.open = true
    },
    importTemplate() {
      this.download('pig/site/importTemplate', {}, `site_template_${new Date().getTime()}.xlsx`)
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
