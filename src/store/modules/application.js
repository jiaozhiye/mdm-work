import * as types from '../types'
import Cookies from 'js-cookie'
import { setToken, removeToken } from 'assets/js/auth'
import { constantRouterMap, asyncRouterMap } from 'routes'
import { getNavList } from 'api'

// 生成路由列表方法
const GenerateRoutes = (routesMap, navList) => {
    // console.log(routesMap, navList)
    const routes = routesMap.filter(item => {
        if (navList.some(val => item.name === val.title)){
            return item
        }
    })

    routes.forEach(item => {
        if (!item) return
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

    routes.push({ path: '*', redirect: '/' })

    return routes
}

// state
const state = {
    loginInfo: {},
    navList: [],
    routerMap: []
}

// actions
const actions = {
    createLoginInfo ({ commit }, params){
        setToken(params.name)
        // 设置门店 ID cookie
        Cookies.set('dept_id', params.dept_id || '')
        commit({
            type: types.LOGININFO,
            data: params
        })
    },
    createLogout ({ commit }){
        removeToken()
        Cookies.remove('deptId')
        commit({
            type: types.LOGOUT,
            data: null
        })
    },
    async createNavList ({ commit, state }, params){
        if (state.navList.length) return
        const response = await getNavList()
        commit({
            type: types.NAVLIST,
            data: response.data || params
        })
    },
    createRouterMap ({ commit, state }){
        commit({
            type: types.ROUTERMAP,
            data: GenerateRoutes(asyncRouterMap, state.navList)
        })
    }
}

// mutations
const mutations = {
    [types.LOGININFO](state, { data }){
        state.loginInfo = data
    },
    [types.LOGOUT](state, { data }){
        state.loginInfo = data
    },
    [types.NAVLIST](state, { data }){
        state.navList = data
    },
    [types.ROUTERMAP](state, { data }){
        state.routerMap = data
    }
}

// getters
const getters = {
    deptId({ loginInfo }){
        return loginInfo.dept_id || Cookies.get('dept_id')
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}