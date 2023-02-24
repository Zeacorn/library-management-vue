<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">新增用户</div>
    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm"  label-width="200px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age"  placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.sex" label="男">男</el-radio>
        <el-radio v-model="form.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder="请输入地址"></el-input>
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

export default {
  name: "AddUser",
  data() {
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 1 || value > 100) {
          callback(new Error('请输入合法年龄'));
        } else {
          callback();
        }
      }
    };
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }

      if(!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)){
        callback(new Error('请输入合法的11位手机号'))
      }
      callback()
    };
    return {
      form: {sex: '男'},
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, required: true, trigger: 'blur' },
        ],
        phone: [
          { validator: checkPhone, required: true, trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post('/user/save',this.form).then(res => {
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
      this.form = {sex: '男'}
    }
  }
}
</script>
