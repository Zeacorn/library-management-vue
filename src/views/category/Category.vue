<template>
  <div>
    <!-- 搜索表单 -->
    <div style="margin-bottom: 20px">
      <el-input style="width: 240px" placeholder="请输入分类名称" v-model="params.name"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i>搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i>重置</el-button>
    </div>
    <!-- 表单主体 -->
    <el-table  :data="tableData" stripe row-key="id" default-expand-all>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="updateTime" label="最后一次更新"></el-table-column>

      <el-table-column label="操作" width="380">
        <template v-slot="scope">
          <!-- scope.row 就是当前行的数据 -->
          <el-button style="margin-right: 5px" type="success" @click="handleAdd(scope.row)" v-if="!scope.row.pid">添加二级分类</el-button>
          <el-button style="margin-right: 5px" type="primary" @click="$router.push('/editCategory?id=' + scope.row.id)">编辑</el-button>
          <el-popconfirm
              title="您确定删除这行数据吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 20px">
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          layout="prev, pager, next"
          :total="total">
      </el-pagination>
    </div>

    <!-- 添加二级分类 -->
    <el-dialog title="添加二级分类" :visible.sync="dialogVisible" width="30%">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="分类备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  name: 'Category',
  data() {
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      tableData: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
      },
      dialogVisible: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      pid: null,
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get('/category/page',{params: this.params}).then(res => {
        if(res.code == '200'){
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: ''
      }
      this.load()
    },
    handleCurrentChange(pageNum) {
      //点击分页按钮触发分页
      this.params.pageNum = pageNum
      this.load()
    },
    handleAdd(row) {
      this.dialogVisible = true
      this.pid = row.id
    },
    del(id) {
      request.delete("/category/delete/" + id).then(res => {
        if(res.code == '200'){
          this.$notify.success('删除成功')
          this.load()
        }
        else{
          tthis.$notify.error(res.msg)
        }
      })
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.form.pid = this.pid
          request.post('/category/save',this.form).then(res => {
            if(res.code == '200'){
              this.$notify.success('新增二级分类成功')
              this.$refs['ruleForm'].resetFields()
              this.dialogVisible = false
              this.load()
            }else{
              this.$notify.error(res.msg)
            }
          })
        }
      })
    }
  }
}

</script>
