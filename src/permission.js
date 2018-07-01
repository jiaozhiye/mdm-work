import router, { allRoutesMap } from 'routes'
import store from 'store'
import { getToken } from 'assets/js/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'  // Progress 进度条样式
import { MessageBox  } from 'element-ui'

const list = [
    {
        "iconName": "sys_setting", 
        "parent_id": "0", 
        "link": "/sys_setting", 
        "id": "1", 
        "sort": 0, 
        "title": "系统管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "1", 
                "link": "", 
                "id": "2", 
                "sort": 1, 
                "title": "门店管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "2", 
                        "link": "/sys_setting/store_list", 
                        "id": "3", 
                        "sort": 3, 
                        "title": "门店列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }, 
            {
                "iconName": "location", 
                "parent_id": "1", 
                "link": "", 
                "id": "4", 
                "sort": 4, 
                "title": "员工管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "4", 
                        "link": "/sys_setting/staff_list", 
                        "id": "5", 
                        "sort": 5, 
                        "title": "员工列表", 
                        "type": null, 
                        "list": [ ]
                    }, 
                    {
                        "iconName": null, 
                        "parent_id": "4", 
                        "link": "/sys_setting/staff_not_on_job_list", 
                        "id": "6", 
                        "sort": 6, 
                        "title": "不在职员工列表", 
                        "type": null, 
                        "list": [ ]
                    }, 
                    {
                        "iconName": null, 
                        "parent_id": "4", 
                        "link": "/sys_setting/staff_in", 
                        "id": "7", 
                        "sort": 7, 
                        "title": "调入员工列表", 
                        "type": null, 
                        "list": [ ]
                    }, 
                    {
                        "iconName": null, 
                        "parent_id": "4", 
                        "link": "/sys_setting/staff_out", 
                        "id": "8", 
                        "sort": 8, 
                        "title": "调出员工列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }, 
            {
                "iconName": "share", 
                "parent_id": "1", 
                "link": "", 
                "id": "25", 
                "sort": 25, 
                "title": "组织机构", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "25", 
                        "link": "/sys_setting/job", 
                        "id": "26", 
                        "sort": 26, 
                        "title": "职务管理", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }, 
    {
        "iconName": "performance", 
        "parent_id": "0", 
        "link": "/performance", 
        "id": "9", 
        "sort": 9, 
        "title": "绩效管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "9", 
                "link": "", 
                "id": "10", 
                "sort": 10, 
                "title": "绩效考核", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "10", 
                        "link": "/performance/list", 
                        "id": "11", 
                        "sort": 11, 
                        "title": "绩效列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }, 
    {
        "iconName": "train", 
        "parent_id": "0", 
        "link": "/train", 
        "id": "12", 
        "sort": 12, 
        "title": "培训管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "12", 
                "link": "", 
                "id": "13", 
                "sort": 13, 
                "title": "分类管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "13", 
                        "link": "/train/type_list", 
                        "id": "14", 
                        "sort": 14, 
                        "title": "分类列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }, 
            {
                "iconName": "location", 
                "parent_id": "12", 
                "link": "", 
                "id": "15", 
                "sort": 15, 
                "title": "文章管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "15", 
                        "link": "/train/article_list", 
                        "id": "16", 
                        "sort": 16, 
                        "title": "文章列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }, 
    {
        "iconName": "assessment", 
        "parent_id": "0", 
        "link": "/assessment", 
        "id": "17", 
        "sort": 17, 
        "title": "考核管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "17", 
                "link": "", 
                "id": "18", 
                "sort": 18, 
                "title": "考题管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "18", 
                        "link": "/assessment/question", 
                        "id": "19", 
                        "sort": 19, 
                        "title": "考题列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }, 
            {
                "iconName": "location", 
                "parent_id": "17", 
                "link": "", 
                "id": "20", 
                "sort": 20, 
                "title": "考试管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "20", 
                        "link": "/assessment/exam", 
                        "id": "21", 
                        "sort": 21, 
                        "title": "成绩列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }, 
    {
        "iconName": "notice", 
        "parent_id": "0", 
        "link": "/notice", 
        "id": "22", 
        "sort": 22, 
        "title": "消息管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "22", 
                "link": "", 
                "id": "23", 
                "sort": 23, 
                "title": "通知管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "23", 
                        "link": "/notice/list", 
                        "id": "24", 
                        "sort": 24, 
                        "title": "通知列表", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }, 
    {
        "iconName": "scheduling", 
        "parent_id": "0", 
        "link": "/scheduling", 
        "id": "27", 
        "sort": 27, 
        "title": "排班管理", 
        "type": null, 
        "list": [
            {
                "iconName": "menu", 
                "parent_id": "27", 
                "link": "", 
                "id": "28", 
                "sort": 28, 
                "title": "排班管理", 
                "type": null, 
                "list": [
                    {
                        "iconName": null, 
                        "parent_id": "28", 
                        "link": "/scheduling/variable_time_guide", 
                        "id": "29", 
                        "sort": 29, 
                        "title": "可变工时", 
                        "type": null, 
                        "list": [ ]
                    }, 
                    {
                        "iconName": null, 
                        "parent_id": "28", 
                        "link": "/scheduling/store_forecast_turnover", 
                        "id": "30", 
                        "sort": 30, 
                        "title": "预估营业额", 
                        "type": null, 
                        "list": [ ]
                    }
                ]
            }
        ]
    }
]

// 不重定向白名单
const whiteList = ['/login']

// 生成路由列表方法
const GenerateRoutes = (routesMap, navList) => {
    // console.log(routesMap, navList)
    const routes = routesMap.filter(item => {
        if (navList.some(val => item.name === val.title)){
            return item
        }
    })

    routes.forEach(item => {
        let _arr = []
        let element = navList.find(val => val.title === item.name)
        element.list.forEach(val => {_arr = _arr.concat(val.list)})
        for (let i = 0; i < item.children.length; i++){
            if (item.children[i].path != '' && !(_arr.some(val => item.children[i].name === val.title))){
                item.children.splice(i, 1)
                i--
            }
        }
    })

    let redirectPath = routes.length ? routes[0].path : '/login'
    routes.push({ path: '*', redirect: redirectPath, hidden: true })

    return routes
}

const messageConfirm = next => {
    MessageBox.confirm('您有未保存的数据，确认离开此页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        next()
    }).catch(() => {
        NProgress.done()
        next(false)
    })
}

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if ( getToken() ){ // 判断是否登录，成功登录
        if (to.path === '/login'){
            next('/')
        } else { // 判断是否已经动态生成了路由表
            if ( store.state.app.navList.length == 0 ){
                // 通过 vuex 管理导航数据
                await store.dispatch('app/createNavList', list)
                // 生成可访问的路由表
                router.addRoutes(GenerateRoutes(allRoutesMap, store.state.app.navList))
                // hack 方法 确保 addRoutes 已完成
                next({ ...to, replace: true })
            } else {
                if (!store.state.stateChange.isLeaveRemind){
                    next()
                } else {
                    messageConfirm(next)
                }
            }
        }
    } else { // 非登录
        if (whiteList.indexOf(to.path) !== -1){
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
    store.dispatch('stateChange/setLeaveRemind', !1)
})
