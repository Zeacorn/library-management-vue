<template>
  <div>
    <!-- 搜索表单 -->
    <div style="margin-bottom: 20px">
      <el-input style="width: 240px" placeholder="请输入用户名" v-model="params.username"></el-input>
      <el-input style="width: 240px; margin-left: 5px" placeholder="请输入联系方式" v-model="params.phone"></el-input>
      <el-input style="width: 240px; margin-left: 5px" placeholder="请输入邮箱" v-model="params.email"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i>搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i>重置</el-button>
    </div>
    <!-- 表单主体 -->
    <el-table  :data="tableData" stripe >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="updateTime" label="最后一次更新"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template v-slot="scope">
          <!-- scope.row 就是当前行的数据 -->
          <el-button style="margin-right: 5px" type="primary" @click="$router.push('/editAdmin?id=' + scope.row.id)">编辑</el-button>
          <el-popconfirm
              title="您确定删除这行数据吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button style="margin-left: 5px" type="warning" @click="handleChangePW(scope.row)">修改密码</el-button>
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

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="新密码" prop="newPW">
          <el-input v-model="form.newPW" autocomplete="off" show-password ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePW">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  name: 'Admin',
  data() {
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      tableData: [],
      total: 0,
      dialogVisible: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: '',
        email: '',
      },
      form: {},
      rules: {
        newPW: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 5, max: 15, message: '密码长度为5到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    changeStatus(row) {
      if(this.admin.id === row.id && !row.status){
        row.status = true;
        this.$notify.warning('您的操作不合法')
        return
      }
      request.put('/admin/update',row).then(res => {
        if(res.code == '200'){
          this.$notify.success('操作成功')
          this.load()
        }else{
          this.$notify.error(res.msg)
        }
      })
    },
    load() {
      request.get('/admin/page',{params: this.params}).then(res => {
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
    savePW() {
      this.$refs['ruleForm'].validate((valid) => {
        if(valid){
          request.put('/admin/password',this.form).then(res => {
            if(res.code === '200'){
              this.$notify.success('修改成功')
              if(this.form.id === this.admin.id){ //如果修改的是登录者的密码
                Cookies.remove('admin')
                this.$router.push('/login')
              }
            else {
              this.dialogVisible = false
              this.load()
              }
            }
            else{
              this.$notify.error("修改失败")
            }
          })
        }
        else {

        }
      })
    },
    handleChangePW(row) {
      this.dialogVisible = true;
      this.form = JSON.parse((JSON.stringify(row)))
    },
    del(id) {
      request.delete("/admin/delete/" + id).then(res => {
        if(res.code == '200'){
          this.$notify.success('删除成功')
          this.load()
        }
        else{
          tthis.$notify.error(res.msg)
        }
      })
    }
  }
}

</script>