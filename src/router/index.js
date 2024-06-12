import { createRouter, createWebHistory } from 'vue-router'
import { getJwtToken } from '@/services/jwtServices'
import { useAuthStore } from '@/stores/auth'

import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'

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
    }
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
