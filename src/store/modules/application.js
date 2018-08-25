import * as types from '../types'
import Cookies from 'js-cookie'
import { setToken, removeToken } from 'assets/js/auth'

import { getNavList } from 'api'

// state
const state = {
    loginInfo: {},
    navList: []
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
            data: response.data || []
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