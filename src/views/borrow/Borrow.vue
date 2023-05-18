<template>
  <div>
    <!-- 搜索表单 -->
    <div style="margin-bottom: 20px">
      <el-input style="width: 240px" placeholder="请输入图书名称" v-model="params.bookName"></el-input>
      <el-input style="width: 240px; margin-left: 5px" placeholder="请输入用户名称" v-model="params.userName"></el-input>
      <template >
        <el-select style="margin-left: 5px" v-model="params.status" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </template>
      <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i>搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i>重置</el-button>
    </div>
    <div>
      <el-button type="primary" @click="handleReturn"><i class="el-icon-thumb"></i>还书</el-button>
    </div>
    <!-- 表单主体 -->
    <el-table  :data="tableData" stripe>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="bookName" label="图书名称"></el-table-column>
      <el-table-column prop="bookNo" label="图书标准码"></el-table-column>
      <el-table-column prop="userId" label="用户Id"></el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="userPhone" label="用户联系方式"></el-table-column>
      <el-table-column prop="createTime" label="借书日期"></el-table-column>
      <el-table-column prop="day" label="借用时间"></el-table-column>
      <el-table-column prop="returnTime" label="归还日期"></el-table-column>
      <el-table-column prop="statue" label="状态">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.status === '已归还'">{{ scope.row.status }}</el-tag>
          <el-tag type="danger" v-if="scope.row.status === '已逾期'">{{ scope.row.status }}</el-tag>
          <el-tag type="warning" v-if="scope.row.status === '即将逾期'">{{ scope.row.status }}</el-tag>
          <el-tag v-if="scope.row.status === '未归还'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="380">
        <template v-slot="scope">
          <!-- scope.row 就是当前行的数据 -->
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
    <!-- 还书 -->
    <el-dialog title="还书" :visible.sync="dialogVisible" width="30%">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="用户名称" prop="id">
          <el-select v-model="form.id" filterable placeholder="请选择" @change="selBorrows">
            <el-option
                v-for="item in borrows"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书名称" prop="bookName">
          <el-input v-model="form.bookName" disabled ></el-input>
        </el-form-item>
        <el-form-item label="图书标准码" prop="bookNo">
          <el-input v-model="form.bookNo" disabled ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  name: 'Borrow',
  data() {
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      tableData: [],
      borrows: [],
      total: 0,
      dialogVisible: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        bookName: '',
        status: '',
        userName: ''
      },
      options: [{
        value: '未归还',
        label: '未归还'
      },{
        value: '已归还',
        label: '已归还'
      }],
      rules: {
        id: [
          { required: true, message: '请选择', trigger: 'blur' },
        ]
      },
      form: {}
    }
  },
  created() {
    request.get('/borrow/list').then(res => {
      this.borrows = res.data.filter(v => {return v.status === '未归还'})
    })
    this.load()
  },
  methods: {
    load() {
      request.get('/borrow/page',{params: this.params}).then(res => {
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
        bookName: '',
        status: '',
        userName: ''
      }
      this.load()
    },
    handleCurrentChange(pageNum) {
      //点击分页按钮触发分页
      this.params.pageNum = pageNum
      this.load()
    },
    del(id) {
      request.delete("/borrow/delete/" + id).then(res => {
        if(res.code == '200'){
          this.$notify.success('删除成功')
          this.load()
        }
        else{
          this.$notify.error(res.msg)
        }
      })
    },
    update() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.put('/borrow/updateStatus',this.form).then(res => {
            if(res.code == '200'){
              this.$notify.success('归还成功')
              this.dialogVisible = false
              this.reset()
            }else{
              this.$notify.error(res.msg)
            }
          })
        }
      })
    },
    handleReturn() {
      this.dialogVisible = true
      this.form = {}
    },
    selBorrows() {
      const borrow = this.borrows.find(v => v.id === this.form.id)
      this.form.bookName = borrow.bookName
      this.form.bookNo = borrow.bookNo
    }
  }
}

</script>
