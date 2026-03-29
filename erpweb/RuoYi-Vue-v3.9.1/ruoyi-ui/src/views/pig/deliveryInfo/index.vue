<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="运输编码" prop="transportCode">
        <el-input v-model="queryParams.transportCode" placeholder="请输入运输编码" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
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
      <el-col :span="3">
        <el-radio-group v-model="viewMode" size="mini">
          <el-radio-button label="table">列表</el-radio-button>
          <el-radio-button label="card">卡片</el-radio-button>
        </el-radio-group>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deliveryInfoList" v-if="viewMode === 'table'" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="运输编码" align="center" prop="transportCode" v-if="columns.transportCode.visible" :show-overflow-tooltip="true" />
      <el-table-column label="当前位置" align="center" v-if="columns.currentLocation.visible">
        <template slot-scope="scope">
          <span>{{ scope.row.currentLongitude || '-' }}, {{ scope.row.currentLatitude || '-' }}</span>
        </template>
      </el-table-column>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:deliveryInfo:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:deliveryInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row v-if="viewMode === 'card'" :gutter="12">
      <el-col :span="8" v-for="item in deliveryInfoList" :key="item.id" class="mb8">
        <el-card shadow="hover">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600;">{{ item.delivererName || ('送货#' + item.id) }}</span>
            <dict-tag :options="dict.type.pig_delivery_status" :value="item.deliveryStatus" />
          </div>
          <div style="line-height: 1.8;">
            <div>运输编码：{{ item.transportCode }}</div>
            <div>送货人电话：{{ item.delivererPhone }}</div>
            <div>车牌号：{{ item.vehicleNo }}</div>
            <div>车辆类型：{{ item.vehicleType }}</div>
            <div>装猪数量：{{ item.loadCount }}</div>
            <div>当前位置：{{ item.currentLongitude || '-' }}, {{ item.currentLatitude || '-' }}</div>
            <div>备注：{{ item.remark }}</div>
          </div>
          <div v-if="item.currentLongitude && item.currentLatitude" style="margin-top: 8px;">
            <iframe
              :src="getMapEmbedUrl(item.currentLatitude, item.currentLongitude)"
              style="width: 100%; height: 180px; border: 0; border-radius: 4px;"
            ></iframe>
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(item)" v-hasPermi="['pig:deliveryInfo:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(item)" v-hasPermi="['pig:deliveryInfo:remove']">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改送货信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="运输编码" prop="transportCode">
          <el-input v-model="form.transportCode" placeholder="自动生成" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前位置" prop="currentLongitude">
          <div style="display: flex; gap: 8px;">
            <el-input v-model="form.currentLongitude" placeholder="经度" style="width: 45%;" />
            <el-input v-model="form.currentLatitude" placeholder="纬度" style="width: 45%;" />
            <el-button size="mini" @click="openMapPicker('deliveryForm')">地图选点</el-button>
          </div>
        </el-form-item>
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
import { listDeliveryInfo, getDeliveryInfo, delDeliveryInfo, addDeliveryInfo, updateDeliveryInfo, getNextTransportCode } from "@/api/pig/deliveryInfo"

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
      viewMode: "table",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transportCode: undefined,
        delivererName: undefined,
        deliveryStatus: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        transportCode: { label: '运输编码', visible: true },
        currentLocation: { label: '当前位置', visible: true },
        delivererName: { label: '送货人姓名', visible: true },
        delivererPhone: { label: '送货人电话', visible: true },
        vehicleNo: { label: '车牌号', visible: true },
        vehicleType: { label: '车辆类型', visible: true },
        loadCount: { label: '装猪数量', visible: true },
        deliveryStatus: { label: '送货状态', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      mapDialogVisible: false,
      mapTarget: 'deliveryForm',
      mapContainerId: 'delivery-map-picker',
      mapInstance: null,
      mapMarker: null,
      mapLoading: false,
      mapSelectedLat: undefined,
      mapSelectedLng: undefined,
      mapKeyword: '',
      mapPlaceSearch: null,
      mapGeocoder: null,
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
        transportCode: undefined,
        currentLongitude: undefined,
        currentLatitude: undefined,
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
      getNextTransportCode().then(response => {
        this.$set(this.form, 'transportCode', response.data)
      })
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
    openMapPicker(target) {
      this.mapTarget = target
      this.mapDialogVisible = true
      this.mapSelectedLng = this.form.currentLongitude ? Number(this.form.currentLongitude) : undefined
      this.mapSelectedLat = this.form.currentLatitude ? Number(this.form.currentLatitude) : undefined
      this.$nextTick(() => {
        this.initMap()
      })
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
                  this.mapKeyword = result.regeocode.formattedAddress || this.mapKeyword
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
      if (!this.mapPlaceSearch && window.AMap) {
        this.mapPlaceSearch = new AMap.PlaceSearch({ pageSize: 5, map: this.mapInstance })
      }
      if (!this.mapGeocoder && window.AMap) {
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
          if (poi.address || poi.name) {
            this.mapKeyword = `${poi.address || ''}${poi.name || ''}`
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
              this.mapKeyword = geoResult.geocodes[0].formattedAddress || keyword
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
      this.form.currentLongitude = String(this.mapSelectedLng)
      this.form.currentLatitude = String(this.mapSelectedLat)
      this.mapDialogVisible = false
    },
    getMapEmbedUrl(lat, lng) {
      const latNum = Number(lat)
      const lngNum = Number(lng)
      if (!latNum || !lngNum) {
        return ''
      }
      const delta = 0.02
      const left = lngNum - delta
      const right = lngNum + delta
      const top = latNum + delta
      const bottom = latNum - delta
      return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latNum}%2C${lngNum}`
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
