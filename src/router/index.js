import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import PartManagement from '@/views/ContentView.vue/PartManagement.vue'
import BomManagement from '@/views/ContentView.vue/BomManagement.vue'
import ClassficationManagement from '@/views/ContentView.vue/ClassificationManagement.vue'
import AttributeManagement from '@/views/ContentView.vue/AttributeManagement.vue'


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
      path: '/classificationManagement',
      name: 'ClassificationManagement',
      component: ClassficationManagement,
      meta: {
        title: '分类管理'
      }
    },
    {
      path: '/attributeManagement',
      name: 'AttributeManagement',
      component: AttributeManagement,
      meta: {
        title: '属性管理'
      }
    }
  ]
})

export default router
