<template>
  <div style="height: 100vh; overflow: hidden; position: relative">
    <!-- 滑块 -->
    <el-card class="cover" v-if="verify">
      <slide-verify :l="42"
                    :r="10"
                    :w="310"
                    :h="155"
                    slider-text="向右滑动"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
      ></slide-verify>
    </el-card>

    <!--  登录主体 -->
    <div style="width: 500px; height: 400px; background-color: white; border-radius: 10px; margin: 300px auto; padding: 50px">
      <div style="margin: 30px; text-align: center; font-size: 30px; font-weight: bold; color: dodgerblue">登录</div>
      <el-form :model="admin" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="admin.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" show-password prefix-icon="el-icon-lock" v-model="admin.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  name: "Login",
  data() {
    return {
      admin: {},
      verify: false,
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['loginForm'].validate((valid) => {
        if(valid){
          this.verify = true
        }
      })
    },
    onSuccess(){
      request.post('/admin/login',this.admin).then(res => {
        if(res.code == '200'){
          this.$notify.success('登录成功')
          if(res.data !== null){
            Cookies.set('admin',JSON.stringify(res.data))
          }
          this.$router.push('/')
        }
        else{
          this.$notify.error(res.msg)
          this.verify = false
        }
      })
    },
    onFail(){

    },
    onRefresh(){

    }
  }
}
</script>

<style scoped>
.cover {
  width: fit-content;
  background-color: white;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>