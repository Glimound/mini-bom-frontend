import { createRouter, createWebHistory } from 'vue-router'
import { getJwtToken } from '@/services/jwtServices'
import { useAuthStore } from '@/stores/auth'

import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import PartManagement from '@/views/ContentView/PartManagement.vue'
import BomManagement from '@/views/ContentView/BomManagement.vue'
import ClassficationManagement from '@/views/ContentView/ClassificationManagement.vue'
import AttributeManagement from '@/views/ContentView/AttributeManagement.vue'
import ClassificationManagement from '@/views/ContentView/ClassificationManagement.vue'
import BomManagement from '@/views/ContentView/BomManagement.vue'
import PartManagement from '@/views/ContentView/PartManagement.vue'
import BlankView from '@/views/ContentView/BlankView.vue'


const authStore = useAuthStore()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DashboardPage',
      component: DashboardPage,
      meta: {
        title: '主页'
      },
      children: [
        {
          path: '',
          name: 'BlankView',
          component: BlankView,
          meta: {
            title: '空白页'
          }
        },
        {
          path: 'attribute-management',
          name: 'AttributeManagement',
          component: AttributeManagement,
          meta: {
            title: '属性管理'
          }
        },
        {
          path: 'classification-management',
          name: 'ClassificationManagement',
          component: ClassificationManagement,
          meta: {
            title: '分类管理'
          }
        },
        {
          path: 'part-management',
          name: 'PartManagement',
          component: PartManagement,
          meta: {
            title: 'Part&BOM管理'
          }
        },
      ]
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
  ]
})

router.beforeEach((to, from) => {
  if (!authStore.authenticated && !!getJwtToken()) {
    authStore.authenticated = true
  }
})

router.beforeEach((to, from) => {
  if (!authStore.authenticated && to.name !== 'LoginPage' && to.name !== 'RegisterPage') {
    return { name: 'LoginPage' }
  }
})

export default router
