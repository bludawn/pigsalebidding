<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="用户" prop="id">
        <el-select v-model="queryParams.id" placeholder="请选择用户" clearable filterable style="width: 240px">
          <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="实名认证" prop="isRealName">
        <el-select v-model="queryParams.isRealName" placeholder="请选择是否实名认证" clearable style="width: 240px">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:userExt:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:userExt:edit']">修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:userExt:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:userExt:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userExtList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="用户" align="center" prop="id" v-if="columns.id.visible">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleView(scope.row)">{{ getUserName(scope.row.id) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="实名认证" align="center" prop="isRealName" v-if="columns.isRealName.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isRealName" />
        </template>
      </el-table-column>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:userExt:edit']">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:userExt:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户信息拓展对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户" prop="id">
          <el-select v-model="form.id" placeholder="请选择用户" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in userOptions" :key="item.userId" :label="getUserLabel(item)" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="实名认证" prop="isRealName">
          <el-select v-model="form.isRealName" placeholder="请选择是否实名认证" :disabled="viewModeOnly">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择所属企业" filterable clearable :disabled="viewModeOnly">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.enterpriseName" :value="item.id" />
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
import { listUserExt, getUserExt, addUserExt, updateUserExt, delUserExt } from "@/api/pig/userExt"
import { listUser } from "@/api/system/user"
import { listEnterprise } from "@/api/pig/enterprise"

export default {
  name: "UserExt",
  dicts: ['sys_yes_no'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      userExtList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        isRealName: undefined
      },
      columns: {
        id: { label: '用户', visible: true },
        isRealName: { label: '实名认证', visible: true },
        enterpriseId: { label: '所属企业', visible: true },
        remark: { label: '备注', visible: true },
        createBy: { label: '创建人', visible: true },
        createTime: { label: '创建时间', visible: true },
        updateBy: { label: '更新人', visible: true },
        updateTime: { label: '更新时间', visible: true }
      },
      userOptions: [],
      userMap: {},
      enterpriseOptions: [],
      enterpriseMap: {},
      viewModeOnly: false,
      form: {}
    }
  },
  created() {
    this.loadUserOptions()
    this.loadEnterpriseOptions()
    this.getList()
  },
  methods: {
    loadUserOptions() {
      listUser({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.userOptions = response.rows || []
        this.userMap = this.userOptions.reduce((acc, item) => {
          acc[item.userId] = item
          return acc
        }, {})
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
    getUserLabel(item) {
      if (!item) return ''
      return item.nickName || item.userName || item.userId
    },
    getUserName(id) {
      if (!id) return ""
      return this.userMap[id] ? this.getUserLabel(this.userMap[id]) : id
    },
    getEnterpriseName(id) {
      if (!id) return ""
      return this.enterpriseMap[id] ? this.enterpriseMap[id].enterpriseName : id
    },
    getList() {
      this.loading = true
      listUserExt(this.queryParams).then(response => {
        this.userExtList = response.rows
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
        isRealName: undefined,
        enterpriseId: undefined,
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
      this.title = "添加用户信息拓展"
    },
    handleUpdate(row) {
      this.reset()
      this.viewModeOnly = false
      const id = row.id || this.ids
      getUserExt(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改用户信息拓展"
      })
    },
    handleView(row) {
      this.reset()
      const id = row.id || this.ids
      getUserExt(id).then(response => {
        this.form = response.data
        this.viewModeOnly = true
        this.open = true
        this.title = "查看用户信息拓展"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.isRealName !== undefined && this.form.isRealName !== null && this.form.isRealName !== "") {
            this.form.isRealName = Number(this.form.isRealName)
          }
          // if (this.form.id != undefined) {
          //   updateUserExt(this.form).then(() => {
          //     this.$modal.msgSuccess("修改成功")
          //     this.open = false
          //     this.getList()
          //   })
          // } else {
            addUserExt(this.form).then(() => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          // }
        }
      })
    },
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function() {
        return delUserExt(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/userExt/export', {
        ...this.queryParams
      }, `user_ext_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
