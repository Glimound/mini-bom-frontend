import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import PartManagement from '@/views/ContentView/PartManagement.vue'
import BomManagement from '@/views/ContentView/BomManagement.vue'
import ClassficationManagement from '@/views/ContentView/ClassficationManagement.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DashboardPage',
      component: DashboardPage,
      meta: {
        title: '主页'
      }
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/partManagement',
      name: 'PartManagement',
      component: PartManagement,
      meta: {
        title: '部件管理'
      }
    },
    {
      path: '/bomManagement',
      name: 'BomManagement',
      component: BomManagement,
      meta: {
        title: 'BOM管理'
      }
    },
    {
      path: '/classficationManagement',
      name: 'ClassficationManagement',
      component: ClassficationManagement,
      meta: {
        title: '分类管理'
      }
    }
  ]
})

export default router
