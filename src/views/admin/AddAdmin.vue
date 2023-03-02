<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">新增管理员</div>
    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm"  label-width="200px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
    </el-form>

     <div style="text-align: center; margin-top: 30px">
       <el-button type="primary" @click="save">提交</el-button>
       <el-button type="warning" @click="reset">重置</el-button>
     </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { validPassword } from '@/utils/validate'


export default {
  name: "AddAdmin",
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }

      if(!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)){
        callback(new Error('请输入合法的11位手机号'))
      }
      callback()
    };
    const validatePassword = (rule, value, callback) => {
      if (!value){
        return callback(new Error('密码不能为空'));
      }
      if (validPassword(value)) callback()
      else callback(new Error('密码6-20位，必须包含大写字母，小写字母，数字及特殊字符'))
    };
    return {
      form: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, required: true, trigger: 'blur' },
        ],
        password: [
          { required: true, trigger: "blur",validator: validatePassword},
        ],
      }
    }
  },
  methods: {
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post('/admin/save',this.form).then(res => {
            if(res.code == '200'){
              this.$notify.success('新增成功')
              this.reset()
            }else{
              this.$notify.error(res.msg)
            }
          })
        }
      })
    },
    reset() {
      this.form = {}
    }
  }
}
</script>
