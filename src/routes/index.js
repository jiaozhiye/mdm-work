import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import('components/Login.vue')
const Layout = () => import('components/Layout.vue')
const Home = () => import('components/Home.vue')
const AppStoreList = () => import('components/StoreList.vue')
const AppNoticeList = () => import('components/NoticeList.vue')
const AppStaffList = () => import('components/StaffList.vue')
const AppNoJobStaffList = () => import('components/NoJobStaffList.vue')
const AppStaffInList = () => import('components/StaffInList.vue')
const AppStaffOutList = () => import('components/StaffOutList.vue')
const AppScoreList = () => import('components/ScoreList.vue')
const AppTrainClassList = () => import('components/TrainClassList.vue')
const AppArticleList = () => import('components/ArticleList.vue')

export const allRoutesMap = [
    {
        path: '/sys_setting',
        name: '系统管理',
        component: Layout,
        children: [
            {
                path: '',
                name: '系统管理-欢迎',
                component: Home
            },
            {
                path: 'store_list',
                name: '门店列表',
                component: AppStoreList
            },
            {
                path: 'staff_list',
                name: '员工列表',
                component: AppStaffList
            },
            {
                path: 'staff_not_on_job_list',
                name: '不在职员工列表',
                component: AppNoJobStaffList
            },
            {
                path: 'staff_in',
                name: '调入员工列表',
                component: AppStaffInList
            },
            {
                path: 'staff_out',
                name: '调出员工列表',
                component: AppStaffOutList
            }
        ]
    },
    {
        path: '/performance',
        name: '绩效管理',
        component: Layout,
        children: [
            {
                path: '',
                name: '绩效管理-欢迎',
                component: AppScoreList
            },
            {
                path: 'list',
                name: '绩效列表',
                component: AppScoreList
            }
        ]
    },
    {
        path: '/train',
        name: '培训管理',
        component: Layout,
        children: [
            {
                path: '',
                name: '培训管理-欢迎',
                component: AppTrainClassList
            },
            {
                path: 'type_list',
                name: '分类列表',
                component: AppTrainClassList
            },
            {
                path: 'article_list',
                name: '文章列表',
                component: AppArticleList
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