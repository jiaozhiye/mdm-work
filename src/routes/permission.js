import router from 'routes'
import store from 'store'
import { getToken } from 'assets/js/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'  // Progress 进度条样式
import { MessageBox  } from 'element-ui'

const list = []

// 不重定向白名单
const whiteList = ['/login']

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
                store.dispatch('app/createRouterMap')
                // 生成可访问的路由表
                router.addRoutes(store.state.app.routerMap)
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
