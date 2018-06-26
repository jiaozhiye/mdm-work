import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import('components/Login.vue')
const Layout = () => import('components/Layout.vue')
const Home = () => import('components/Home.vue')
const AppStoreList = () => import('components/StoreList.vue')
const AppStaffList = () => import('components/StaffList.vue')

export const allRoutesMap = [
    {
        path: '/sys_setting',
        name: '系统管理',
        component: Layout,
        children: [
            {
                path: '',
                name: '首页-欢迎',
                component: Home
            },
            {
                path: 'store_list',
                name: '门店列表',
                component: AppStoreList,
            }
        ]
    }
]

export const constantRouterMap = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

export default new VueRouter({routes: constantRouterMap})