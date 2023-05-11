<template>
  <div style="width: 80%">
    <div style="margin-bottom: 30px; margin-left: 10px; font-size: 26px">编辑分类</div>
    <el-form :inline="true" :model="form"  label-width="200px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
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
  name: "EditCategory",
  data() {
    return {
      form: {}
    }
  },
  created() {
    const id = this.$route.query.id
    request.get("/category/" + id).then(res => {
      this.form = res.data
    })
  },
  methods: {
    update() {
      request.put('/category/update',this.form).then(res => {
        if(res.code == '200'){
          this.$notify.success('更新成功')
          this.returnList()
        }else{
          this.$notify.error(res.msg)
        }
      })
    },
    returnList() {
      this.$router.push("/categoryList")
    }
  }
}
</script>
