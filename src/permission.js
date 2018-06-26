import router, { allRoutesMap } from 'routes'
import store from 'store'
import { getToken } from 'assets/js/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'  // Progress 进度条样式
import { MessageBox  } from 'element-ui'

const list = [
    { // 一级
        title: '系统管理',
        link: '/sys_setting',
        iconName: 'sys_setting',
        list: [
            { // 二级
                title: '门店管理',
                link: '',
                iconName: 'menu',
                list: [
                    { // 三级
                        title: '门店列表',
                        link: '/sys_setting/store_list',
                        iconName: ''
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
