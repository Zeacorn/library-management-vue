import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/views/Layout";
import Cookies from 'js-cookie';

Vue.use(VueRouter)

const routes = [
  // ==== Login ====
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  // ==== Home ====
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue')
      },
      // ==== User ====
      {
        path: 'userList',
        name: 'UserList',
        component: () => import('@/views/user/User.vue')
      },
      {
        path: 'addUser',
        name: 'AddUser',
        component: () => import('@/views/user/AddUser.vue')
      },
      {
        path: 'editUser',
        name: 'EditUser',
        component: () => import('@/views/user/EditUser.vue')
      },
      // ==== Admin ====
      {
        path: 'adminList',
        name: 'AdminList',
        component: () => import('@/views/admin/Admin.vue')
      },
      {
        path: 'addAdmin',
        name: 'AddAdmin',
        component: () => import('@/views/admin/AddAdmin.vue')
      },
      {
        path: 'editAdmin',
        name: 'EditAdmin',
        component: () => import('@/views/admin/EditAdmin.vue')
      },
      // ==== Category ====
      {
        path: 'categoryList',
        name: 'CategoryList',
        component: () => import('@/views/category/Category.vue')
      },
      {
        path: 'addCategory',
        name: 'AddCategory',
        component: () => import('@/views/category/AddCategory.vue')
      },
      {
        path: 'editCategory',
        name: 'EditCategory',
        component: () => import('@/views/category/EditCategory.vue')
      },
      // ==== Book ====
      {
        path: 'bookList',
        name: 'BookList',
        component: () => import('@/views/book/Book.vue')
      },
      {
        path: 'addBook',
        name: 'AddBook',
        component: () => import('@/views/book/AddBook.vue')
      },
      {
        path: 'editBook',
        name: 'EditBook',
        component: () => import('@/views/book/EditBook.vue')
      },
      // ==== Borrow ====
      {
        path: 'borrowList',
        name: 'BorrowList',
        component: () => import('@/views/borrow/Borrow.vue')
      },
      {
        path: 'addBorrow',
        name: 'AddBorrow',
        component: () => import('@/views/borrow/AddBorrow.vue')
      },
    ]
  },
  {
    path: '*',
    component: () => import('@/views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const admin = Cookies.get("admin")
  if (!admin && to.path !== '/login') return next("/login")
  next()
})

export default router
