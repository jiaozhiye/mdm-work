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
const AppQuestionClassify = () => import('components/QuestionClassify.vue')
const AppQuestionList = () => import('components/QuestionList.vue')
const AppAssessList = () => import('components/AssessList.vue')
const AppJobList = () => import('components/JobList.vue')
const AppPersonalSetting = () => import('components/PersonalSetting.vue')
const AppTurnoverList = () => import('components/TurnoverList.vue')
const AppTimeGuide = () => import('components/TimeGuide.vue')
const AppPlanJob = () => import('components/PlanJob.vue')
const AppStoreReportList = () => import('components/StoreReportList.vue')
const AppPersonReportList = () => import('components/PersonReportList.vue')
const AppEditerList = () => import('components/EditerList.vue')
const AppEditer = () => import('components/Editer.vue')
const AppAreaList = () => import('components/AreaList.vue')
const AppStaffAreaList = () => import('components/StaffAreaList.vue')

export const asyncRouterMap = [
    {
        path: '/sys_setting',
        name: '系统管理',
        component: Layout,
        redirect: '/sys_setting/store_list',
        children: [
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
            },
            {
                path: 'job',
                name: '职务管理',
                component: AppJobList
            }
        ]
    },
    {
        path: '/performance',
        name: '绩效管理',
        component: Layout,
        redirect: '/performance/list',
        children: [
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
        redirect: '/train/type_list',
        children: [
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
    },
    {
        path: '/assessment',
        name: '考核管理',
        component: Layout,
        redirect: '/assessment/questiontype',
        children: [
            {
                path: 'questiontype',
                name: '考题分类',
                component: AppQuestionClassify
            },
            {
                path: 'question',
                name: '考题列表',
                component: AppQuestionList
            },
            {
                path: 'exam',
                name: '成绩列表',
                component: AppAssessList
            }
        ]
    },
    {
        path: '/notice',
        name: '消息管理',
        component: Layout,
        redirect: '/notice/list',
        children: [
            {
                path: 'list',
                name: '通知列表',
                component: AppNoticeList
            }
        ]
    },
    {
        path: '/scheduling',
        name: '排班管理',
        component: Layout,
        redirect: '/scheduling/variable_time_guide',
        children: [
            {
                path: 'variable_time_guide',
                name: '可变工时',
                component: AppTimeGuide
            },
            {
                path: 'store_forecast_turnover',
                name: '预估营业额',
                component: AppTurnoverList
            },
            {
                path: 'table',
                name: '排班表',
                component: AppPlanJob
            },
            {
                path: 'init',
                name: '区域初始化',
                component: AppAreaList
            },
            {
                path: 'edit',
                name: '区域编辑',
                component: AppStaffAreaList
            }
        ]
    },
    {
        path: '/editer',
        name: '海报管理',
        component: Layout,
        redirect: '/editer/list',
        children: [
            {
                path: 'list',
                name: '海报列表',
                component: AppEditerList
            },
            {
                path: 'create',
                name: '海报制作',
                component: AppEditer
            }
        ]
    },
    {
        path: '/work_time',
        name: '工资管理',
        component: Layout,
        redirect: '/work_time/any_store',
        children: [
            {
                path: 'any_store',
                name: '单店报表',
                component: AppStoreReportList
            },
            {
                path: 'any_staff',
                name: '个人报表',
                component: AppPersonReportList
            }
        ]
    }
]

export const constantRouterMap = [
    {
        path: '/login',
        name: '登录',
        component: Login,
        hidden: true
    },
    {
        path: '/',
        name: '',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: '首页',
                component: Home
            }
        ]
    },
    {
        path: '/setting',
        name: '设置',
        component: Layout,
        children: [
            {
                path: 'personal',
                name: '个人设置',
                component: AppPersonalSetting
            }
        ]
    }
]

export default new VueRouter({routes: constantRouterMap})