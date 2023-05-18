<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">新增图书</div>
    <el-form :inline="true" :rules="rules" ref="ruleForm" :model="form"  label-width="200px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input style="width: 300px" type="textarea" v-model="form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="出版日期" prop="publishDate">
        <el-date-picker
            v-model="form.publishDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出版日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="publisher">
        <el-input v-model="form.publisher" placeholder="请输入出版社"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categories">
        <el-cascader
            :props="{ value: 'name', label: 'name'}"
            v-model="form.categories"
            :options="categories"></el-cascader>
      </el-form-item>
      <el-form-item label="标注码" prop="bookNo">
        <el-input v-model="form.bookNo" placeholder="请输入标注码"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="nums">
        <el-input v-model.number="form.nums" placeholder="请输入数量"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
            class="avatar-uploader"
            :action="'http://localhost:9090/api/book/file/upload?token=' + this.admin.token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
          <img v-if="form.cover" :src="form.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
import Cookies from "js-cookie";


export default {
  name: "AddBook",
  data() {
    const checkNums = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数量不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 1 || value > 1000) {
          callback(new Error('请输入合法数量(1~1000)'));
        } else {
          callback();
        }
      }
    };
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      form: {cover: ''},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        nums: [
          { validator: checkNums, required: true, trigger: 'blur' },
        ]
      },
      categories: []
    }
  },
  created() {
    request.get('/category/tree').then(res => {
      this.categories = res.data
    })
  },
  methods: {
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post('/book/save',this.form).then(res => {
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
    handleAvatarSuccess(res) {
      if(res.code === '200') {
        this.form.cover = res.data
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

