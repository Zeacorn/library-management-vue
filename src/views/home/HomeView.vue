<template>
  <div>
    <div style="margin: 10px 0">用户名：{{ admin.username }}</div>
    <div style="margin: 10px 0">联系方式：{{ admin.phone }}</div>
    <div style="margin: 10px 0">邮箱： {{ admin.email }}</div>
  </div>
</template>

<script>

import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {}
    }
  },
  created() {
    request.get('/admin/' + this.admin.id).then(res => {
      this.admin = res.data
    })
  }
}

</script>
