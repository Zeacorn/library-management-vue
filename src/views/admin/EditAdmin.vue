<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">编辑管理员</div>
    <el-form :inline="true" :model="form"  label-width="200px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align: center; margin-top: 30px">
      <el-button type="primary" @click="update">更新</el-button>
      <el-button type="warning" @click="returnList">返回</el-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "EditAdmin",
  data() {
    return {
      form: {}
    }
  },
  created() {
    const id = this.$route.query.id
    request.get("/admin/" + id).then(res => {
      this.form = res.data
    })
  },
  methods: {
    update() {
      request.put('/admin/update',this.form).then(res => {
        if(res.code == '200'){
          this.$notify.success('更新成功')
          this.returnList()
        }else{
          this.$notify.error(res.msg)
        }
      })
    },
    returnList() {
      this.$router.push("/adminList")
    }
  }
}
</script>
