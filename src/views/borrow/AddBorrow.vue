<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">新增借书</div>
    <el-form :inline="true" :rules="rules" ref="ruleForm" :model="form"  label-width="200px">
      <el-form-item label="图书标准码" prop="bookNo">
        <el-select v-model="form.bookNo" filterable placeholder="请选择" @change="selBook">
          <el-option
              v-for="item in books"
              :key="item.id"
              :label="item.bookNo"
              :value="item.bookNo">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图书名称" prop="bookName">
      <el-input v-model="form.bookName" disabled placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="图书数量" prop="nums">
        <el-input v-model="nums" disabled placeholder="请输入数量"></el-input>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-select v-model="form.userId" filterable placeholder="请选择" @change="selUser">
          <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名称" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户联系方式" prop="userPhone">
        <el-input v-model="form.userPhone" placeholder="请输入用户联系方式" disabled></el-input>
      </el-form-item>
      <el-form-item label="借用时间" prop="day">
        <el-input v-model.number="form.day"></el-input>
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
  name: "AddBorrow",
  data() {
    const checkNums = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数量不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 1 || value > 100) {
          callback(new Error('请输入合法数量(1~100)'));
        } else {
          callback();
        }
      }
    };
    return {
      form: {},
      rules: {
        bookNo: [
          { required: true, message: '请选择图书标准码', trigger: 'blur' },
        ],
        userId: [
          { required: true, message: '请选择用户ID', trigger: 'blur' },
        ],
        day: [
          { validator: checkNums, required: true, trigger: 'blur' },
        ]
      },
      books: [],
      users: [],
      nums: null
    }
  },
  created() {
    request.get('/book/list').then(res => {
      this.books = res.data
    })

    request.get('/user/list').then(res => {
      this.users = res.data.filter(v => v.status)
    })
  },
  methods: {
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post('/borrow/save',this.form).then(res => {
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
    },
    selBook() {
      const book = this.books.find(v => v.bookNo === this.form.bookNo)
      this.form.bookName = book.name
      this.nums = book.nums
    },
    selUser() {
      const user = this.users.find(v => v.username === this.form.userId)
      this.form.userName = user.name
      this.form.userPhone = user.phone
    }
  }
}
</script>
