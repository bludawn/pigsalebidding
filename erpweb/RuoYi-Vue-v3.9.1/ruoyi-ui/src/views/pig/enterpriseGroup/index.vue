<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="组名" prop="groupName">
        <el-input v-model="queryParams.groupName" placeholder="请输入组名" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:enterpriseGroup:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:enterpriseGroup:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:enterpriseGroup:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:enterpriseGroup:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="enterpriseGroupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="组名" align="center" prop="groupName" v-if="columns.groupName.visible">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ scope.row.groupName || scope.row.id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="组描述" align="center" prop="groupDesc" v-if="columns.groupDesc.visible" />
      <el-table-column label="企业" align="center" prop="enterpriseIds" v-if="columns.enterpriseIds.visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ formatEnterpriseNames(scope.row.enterpriseIds) }}</span>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:enterpriseGroup:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:enterpriseGroup:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改企业分组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="组名" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入组名" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="组描述" prop="groupDesc">
          <el-input v-model="form.groupDesc" type="textarea" placeholder="请输入组描述" :disabled="viewModeOnly" />
        </el-form-item>
        <el-form-item label="企业" prop="enterpriseIds">
          <el-select v-model="enterpriseIdList" placeholder="请选择企业" multiple filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.enterpriseName || item.id" :value="item.id" />
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
  </div>
</template>

<script>
import { listEnterpriseGroup, getEnterpriseGroup, delEnterpriseGroup, addEnterpriseGroup, updateEnterpriseGroup } from "@/api/pig/enterpriseGroup"
import { listEnterprise } from "@/api/pig/enterprise"

export default {
  name: "EnterpriseGroup",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      enterpriseGroupList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupName: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        groupName: { label: '组名', visible: true },
        groupDesc: { label: '组描述', visible: true },
        enterpriseIds: { label: '企业', visible: true },
        createTime: { label: '创建时间', visible: true }
      },
      enterpriseOptions: [],
      enterpriseMap: {},
      enterpriseIdList: [],
      viewModeOnly: false,
      form: {}
    }
  },
  created() {
    this.loadEnterpriseOptions()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listEnterpriseGroup(this.queryParams).then(response => {
        this.enterpriseGroupList = response.rows
        this.total = response.total
        this.loading = false
      })
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
    formatEnterpriseNames(ids) {
      if (!ids) return '-'
      const list = String(ids)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
      return list
        .map(id => {
          const match = this.enterpriseMap[id]
          return match ? (match.enterpriseName || id) : id
        })
        .join('、')
    },
    cancel() {
      this.open = false
      this.viewModeOnly = false
      this.reset()
    },
    reset() {
      this.form = {
        id: undefined,
        groupName: undefined,
        groupDesc: undefined,
        enterpriseIds: undefined,
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
      this.title = "添加企业分组"
      this.viewModeOnly = false
      this.enterpriseIdList = []
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getEnterpriseGroup(id).then(response => {
        this.form = response.data
        this.enterpriseIdList = this.form.enterpriseIds
          ? String(this.form.enterpriseIds).split(',').map(item => Number(item) || item)
          : []
        this.open = true
        this.title = "查看企业分组"
        this.viewModeOnly = true
      })
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getEnterpriseGroup(id).then(response => {
        this.form = response.data
        this.enterpriseIdList = this.form.enterpriseIds
          ? String(this.form.enterpriseIds).split(',').map(item => Number(item) || item)
          : []
        this.open = true
        this.title = "修改企业分组"
        this.viewModeOnly = false
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.enterpriseIds = this.enterpriseIdList && this.enterpriseIdList.length
            ? this.enterpriseIdList.join(',')
            : undefined
          if (this.form.id != undefined) {
            updateEnterpriseGroup(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addEnterpriseGroup(this.form).then(() => {
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
        return delEnterpriseGroup(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/enterpriseGroup/export', {
        ...this.queryParams
      }, `enterprise_group_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
