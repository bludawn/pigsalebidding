<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户" prop="userId">
        <el-select v-model="queryParams.userId" placeholder="请选择用户" clearable filterable style="width: 240px">
          <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
        </el-select>
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
      <el-table-column label="用户" align="center" prop="userId" v-if="columns.userId.visible">
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.userId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名" align="center" prop="contactName" v-if="columns.contactName.visible">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.contactName || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center" prop="contactPhone" v-if="columns.contactPhone.visible" />
      <el-table-column label="地区" align="center" prop="addressCode" v-if="columns.addressCode.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatAddressCode(scope.row.addressCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="detailAddress" v-if="columns.detailAddress.visible" :show-overflow-tooltip="true" />
      <el-table-column label="完整地址" align="center" v-if="columns.fullAddress.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatAddressFull(scope.row.addressCode, scope.row.detailAddress) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" align="center" prop="longitude" v-if="columns.longitude.visible" />
      <el-table-column label="纬度" align="center" prop="latitude" v-if="columns.latitude.visible" />
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
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:address:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:address:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改地址管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人姓名" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系人电话" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="地区" prop="addressCodeList">
          <el-cascader
            v-model="form.addressCodeList"
            :options="pcasOptions"
            :props="pcasProps"
            clearable
            filterable
            placeholder="请选择地区"
            :disabled="viewModeOnly"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="form.detailAddress" placeholder="请输入详细地址" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="经纬度" prop="longitude">
          <div style="display: flex; gap: 8px;">
            <el-input v-model="form.longitude" placeholder="经度" style="width: 45%;" :disabled="viewModeOnly" />
            <el-input v-model="form.latitude" placeholder="纬度" style="width: 45%;" :disabled="viewModeOnly" />
            <el-button size="mini" @click="openMapPicker" v-if="!viewModeOnly">地图选点</el-button>
          </div>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-select v-model="form.isDefault" placeholder="请选择是否默认" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
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

    <el-dialog title="地图选点" :visible.sync="mapDialogVisible" width="700px" append-to-body>
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <el-input v-model="mapKeyword" placeholder="搜索位置" size="mini" clearable @keyup.enter.native="searchMap" />
        <el-button size="mini" type="primary" @click="searchMap">搜索</el-button>
      </div>
      <div v-loading="mapLoading" style="height: 360px;">
        <div :id="mapContainerId" style="height: 360px;"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMapPicker">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, addAddress, updateAddress } from "@/api/pig/address"
import { listUser } from "@/api/system/user"
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
        userId: { label: '用户', visible: true },
        contactName: { label: '联系人姓名', visible: true },
        contactPhone: { label: '联系人电话', visible: true },
        addressCode: { label: '地区', visible: true },
        detailAddress: { label: '详细地址', visible: true },
        fullAddress: { label: '完整地址', visible: true },
        longitude: { label: '经度', visible: true },
        latitude: { label: '纬度', visible: true },
        isDefault: { label: '是否默认', visible: true },
        createTime: { label: '创建时间', visible: true }
      },
      userOptions: [],
      userMap: {},
      viewModeOnly: false,
      pcasOptions: [],
      pcasCodeMap: {},
      pcasLabelPathList: [],
      pcasProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      form: {},
      mapDialogVisible: false,
      mapContainerId: 'address-map-picker',
      mapInstance: null,
      mapMarker: null,
      mapLoading: false,
      mapSelectedLat: undefined,
      mapSelectedLng: undefined,
      mapSelectedAddress: '',
      mapKeyword: '',
      mapPlaceSearch: null,
      mapGeocoder: null
    }
  },
  created() {
    this.initPcasOptions()
    this.loadUserOptions()
    this.getList()
  },
  methods: {
    initPcasOptions() {
      const rawList = Object.keys(pcasData)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => pcasData[key])
      this.pcasCodeMap = {}
      this.pcasLabelPathList = []
      this.pcasOptions = this.normalizePcasTree(rawList, [], [])
      this.pcasLabelPathList.sort((a, b) => b.labelText.length - a.labelText.length)
    },
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
    getUserName(userId) {
      if (!userId) return '-'
      const item = this.userMap[userId]
      return item ? this.getUserLabel(item) : userId
    },
    formatAddressFull(code, detail) {
      const prefix = this.formatAddressCode(code)
      if (prefix && detail) {
        return `${prefix} ${detail}`
      }
      return prefix || detail || ''
    },
    normalizePcasTree(list, parentCodes, parentLabels) {
      return list.map(item => {
        const currentCodes = [...parentCodes, item.code]
        const currentLabels = [...parentLabels, item.name]
        const labelText = currentLabels.join('')
        this.pcasCodeMap[item.code] = {
          codes: currentCodes,
          labels: currentLabels
        }
        this.pcasLabelPathList.push({
          code: item.code,
          codes: currentCodes,
          labels: currentLabels,
          labelText
        })
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
    escapeRegExp(text) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    matchAddressToPcas(address) {
      if (!address) return null
      const normalized = address.replace(/\s+/g, '')
      for (const item of this.pcasLabelPathList) {
        if (normalized.startsWith(item.labelText)) {
          let detail = address
          const prefixPattern = item.labels.map(label => this.escapeRegExp(label)).join('\\s*')
          const prefixRegex = new RegExp(`^\\s*${prefixPattern}\\s*`)
          detail = detail.replace(prefixRegex, '').replace(/^[,，\s]+/, '').trim()
          return {
            code: item.code,
            codes: item.codes,
            labels: item.labels,
            detail: detail || address
          }
        }
      }
      return null
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
      this.viewModeOnly = false
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
        longitude: undefined,
        latitude: undefined,
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
      this.viewModeOnly = false
    },
    ensureAmap() {
      if (window.AMap) {
        return Promise.resolve(window.AMap)
      }
      if (window._amapLoading) {
        return window._amapLoading
      }
      const amapKey = window.AMAP_KEY || ''
      if (!amapKey) {
        return Promise.reject(new Error('Missing AMap key'))
      }
      window._amapLoading = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.Geocoder,AMap.PlaceSearch,AMap.ToolBar`
        script.onload = () => resolve(window.AMap)
        script.onerror = () => reject(new Error('AMap load failed'))
        document.body.appendChild(script)
      })
      return window._amapLoading
    },
    initMap() {
      this.mapLoading = true
      const defaultLat = this.mapSelectedLat || 31.2304
      const defaultLng = this.mapSelectedLng || 121.4737
      this.ensureAmap().then(AMap => {
        if (!this.mapInstance) {
          this.mapInstance = new AMap.Map(this.mapContainerId, {
            zoom: 12,
            center: [defaultLng, defaultLat]
          })
          this.mapInstance.addControl(new AMap.ToolBar())
          this.mapGeocoder = new AMap.Geocoder({ city: '' })
          this.mapPlaceSearch = new AMap.PlaceSearch({ pageSize: 5, map: this.mapInstance })
          this.mapInstance.on('click', event => {
            const lng = Number(event.lnglat.lng.toFixed(6))
            const lat = Number(event.lnglat.lat.toFixed(6))
            this.mapSelectedLng = lng
            this.mapSelectedLat = lat
            if (!this.mapMarker) {
              this.mapMarker = new AMap.Marker({ position: [lng, lat] })
              this.mapInstance.add(this.mapMarker)
            } else {
              this.mapMarker.setPosition([lng, lat])
            }
            if (this.mapGeocoder) {
              this.mapGeocoder.getAddress([lng, lat], (status, result) => {
                if (status === 'complete' && result && result.regeocode) {
                  this.mapSelectedAddress = result.regeocode.formattedAddress || ''
                  this.mapKeyword = this.mapSelectedAddress || this.mapKeyword
                }
              })
            }
          })
        }
        this.mapInstance.setZoomAndCenter(12, [defaultLng, defaultLat])
        if (this.mapSelectedLat && this.mapSelectedLng) {
          if (!this.mapMarker) {
            this.mapMarker = new AMap.Marker({ position: [this.mapSelectedLng, this.mapSelectedLat] })
            this.mapInstance.add(this.mapMarker)
          } else {
            this.mapMarker.setPosition([this.mapSelectedLng, this.mapSelectedLat])
          }
        }
        this.$nextTick(() => {
          this.mapInstance && this.mapInstance.resize()
        })
      }).catch(() => {
        this.$modal.msgError('地图加载失败，请检查高德地图 Key 配置')
      }).finally(() => {
        this.mapLoading = false
      })
    },
    openMapPicker() {
      this.mapSelectedLng = this.form.longitude ? Number(this.form.longitude) : undefined
      this.mapSelectedLat = this.form.latitude ? Number(this.form.latitude) : undefined
      this.mapKeyword = this.form.detailAddress || ''
      this.mapSelectedAddress = ''
      this.mapDialogVisible = true
      this.$nextTick(() => {
        this.initMap()
      })
    },
    searchMap() {
      const keyword = (this.mapKeyword || '').trim()
      if (!keyword) {
        this.$modal.msgWarning('请输入搜索关键词')
        return
      }
      if (!this.mapInstance) {
        this.$modal.msgWarning('地图未初始化')
        return
      }
      if (!this.mapPlaceSearch || !window.AMap) {
        this.mapPlaceSearch = new AMap.PlaceSearch({ pageSize: 5, map: this.mapInstance })
      }
      if (!this.mapGeocoder || !window.AMap) {
        this.mapGeocoder = new AMap.Geocoder({ city: '' })
      }
      if (!this.mapPlaceSearch) {
        this.$modal.msgWarning('地图搜索未初始化')
        return
      }
      this.mapPlaceSearch.search(keyword, (status, result) => {
        if (status === 'complete' && result && result.poiList && result.poiList.pois && result.poiList.pois.length) {
          const poi = result.poiList.pois[0]
          const lng = Number(poi.location.lng.toFixed(6))
          const lat = Number(poi.location.lat.toFixed(6))
          this.mapSelectedLng = lng
          this.mapSelectedLat = lat
          if (!this.mapMarker) {
            this.mapMarker = new AMap.Marker({ position: [lng, lat] })
            this.mapInstance.add(this.mapMarker)
          } else {
            this.mapMarker.setPosition([lng, lat])
          }
          this.mapInstance.setZoomAndCenter(15, [lng, lat])
          this.mapSelectedAddress = `${poi.address || ''}${poi.name || ''}`
          if (this.mapSelectedAddress) {
            this.mapKeyword = this.mapSelectedAddress
          }
          return
        }
        if (this.mapGeocoder) {
          this.mapGeocoder.getLocation(keyword, (geoStatus, geoResult) => {
            if (geoStatus === 'complete' && geoResult && geoResult.geocodes && geoResult.geocodes.length) {
              const location = geoResult.geocodes[0].location
              const lng = Number(location.lng.toFixed(6))
              const lat = Number(location.lat.toFixed(6))
              this.mapSelectedLng = lng
              this.mapSelectedLat = lat
              if (!this.mapMarker) {
                this.mapMarker = new AMap.Marker({ position: [lng, lat] })
                this.mapInstance.add(this.mapMarker)
              } else {
                this.mapMarker.setPosition([lng, lat])
              }
              this.mapInstance.setZoomAndCenter(15, [lng, lat])
              this.mapSelectedAddress = geoResult.geocodes[0].formattedAddress || keyword
              this.mapKeyword = this.mapSelectedAddress
            } else {
              this.$modal.msgWarning('未找到匹配位置')
            }
          })
          return
        }
        this.$modal.msgWarning('未找到匹配位置')
      })
    },
    confirmMapPicker() {
      if (!this.mapSelectedLat || !this.mapSelectedLng) {
        this.$modal.msgWarning('请在地图上选择位置')
        return
      }
      this.form.longitude = String(this.mapSelectedLng)
      this.form.latitude = String(this.mapSelectedLat)
      if (this.mapSelectedAddress) {
        const match = this.matchAddressToPcas(this.mapSelectedAddress)
        if (match) {
          this.form.addressCodeList = match.codes
          this.form.addressCode = match.code
          this.form.detailAddress = match.detail
        } else {
          this.form.detailAddress = this.mapSelectedAddress
        }
      }
      this.mapDialogVisible = false
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data
        this.form.addressCodeList = this.getCodePath(this.form.addressCode)
        this.open = true
        this.title = "查看地址"
        this.viewModeOnly = true
      })
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data
        this.form.addressCodeList = this.getCodePath(this.form.addressCode)
        this.open = true
        this.title = "修改地址管理"
        this.viewModeOnly = false
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
