import {createRouter, createWebHistory} from 'vue-router'
import {getJwtToken, getUsername} from '@/services/localStorageServices'
import {useAuthStore} from '@/stores/auth'
import pinia from "@/stores";

const authStore = useAuthStore(pinia)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'DashboardPage',
            component: () => import('@/views/DashboardPage.vue'),
            meta: {
                title: '主页'
            },
            children: [
                {
                    path: '',
                    name: 'BlankView',
                    component: () => import('@/views/ContentView/BlankView.vue'),
                    meta: {
                        title: '空白页'
                    }
                },
                {
                    path: 'attribute-management',
                    name: 'AttributeManagement',
                    component: () => import('@/views/ContentView/AttributeManagement.vue'),
                    meta: {
                        title: '属性管理'
                    }
                },
                {
                    path: 'classification-management',
                    name: 'ClassificationManagement',
                    component: () => import('@/views/ContentView/ClassificationManagement.vue'),
                    meta: {
                        title: '分类管理'
                    }
                },
                {
                    path: 'part-management',
                    name: 'PartManagement',
                    component: () => import('@/views/ContentView/PartManagement.vue'),
                    meta: {
                        title: 'Part&BOM管理'
                    }
                },
            ]
        },
        {
            path: '/login',
            name: 'LoginPage',
            component: () => import('@/views/LoginPage.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/register',
            name: 'RegisterPage',
            component: () => import('@/views/RegisterPage.vue'),
            meta: {
                title: '注册'
            }
        },
    ]
})

router.beforeEach((to, from) => {
    if (!authStore.authenticated && !!getJwtToken()) {
        authStore.authenticated = true
        authStore.username = getUsername()
    }
})

router.beforeEach((to, from) => {
    if (!authStore.authenticated && to.name !== 'LoginPage' && to.name !== 'RegisterPage') {
        return {name: 'LoginPage'}
    }
})

export default router
