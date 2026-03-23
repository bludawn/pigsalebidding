<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="queryParams.messageType" placeholder="请选择消息类型" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.pig_message_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否阅读" prop="isRead">
        <el-select v-model="queryParams.isRead" placeholder="请选择是否阅读" clearable style="width: 240px">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pig:businessMessage:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pig:businessMessage:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pig:businessMessage:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pig:businessMessage:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="businessMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" v-if="columns.id.visible" />
      <el-table-column label="用户id" align="center" prop="userId" v-if="columns.userId.visible" />
      <el-table-column label="消息类型" align="center" prop="messageType" v-if="columns.messageType.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pig_message_type" :value="scope.row.messageType" />
        </template>
      </el-table-column>
      <el-table-column label="是否阅读" align="center" prop="isRead" v-if="columns.isRead.visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isRead" />
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="messageContent" v-if="columns.messageContent.visible" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pig:businessMessage:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pig:businessMessage:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改业务消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="form.messageType" placeholder="请选择消息类型">
            <el-option v-for="dict in dict.type.pig_message_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否阅读" prop="isRead">
          <el-select v-model="form.isRead" placeholder="请选择是否阅读">
            <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容" prop="messageContent">
          <el-input v-model="form.messageContent" type="textarea" placeholder="请输入消息内容" />
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
import { listBusinessMessage, getBusinessMessage, delBusinessMessage, addBusinessMessage, updateBusinessMessage } from "@/api/pig/businessMessage"

export default {
  name: "BusinessMessage",
  dicts: ['pig_message_type', 'sys_yes_no'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      businessMessageList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        messageType: undefined,
        isRead: undefined
      },
      columns: {
        id: { label: '编号', visible: true },
        userId: { label: '用户id', visible: true },
        messageType: { label: '消息类型', visible: true },
        isRead: { label: '是否阅读', visible: true },
        messageContent: { label: '消息内容', visible: true },
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
      listBusinessMessage(this.queryParams).then(response => {
        this.businessMessageList = response.rows
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
        userId: undefined,
        messageType: undefined,
        messageContent: undefined,
        isRead: undefined,
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
      this.title = "添加业务消息"
    },
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBusinessMessage(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改业务消息"
      })
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.isRead !== undefined && this.form.isRead !== null && this.form.isRead !== "") {
            this.form.isRead = Number(this.form.isRead)
          }
          if (this.form.id != undefined) {
            updateBusinessMessage(this.form).then(() => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addBusinessMessage(this.form).then(() => {
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
        return delBusinessMessage(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    handleExport() {
      this.download('pig/businessMessage/export', {
        ...this.queryParams
      }, `business_message_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
