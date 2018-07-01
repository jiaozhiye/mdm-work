import * as types from '../types'
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
        commit({
            type: types.LOGININFO,
            data: params
        })
    },
    createLogout ({ commit }){
        removeToken()
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
            data: response.data || [],
            // data: params
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

export default {
    namespaced: true,
    state,
    actions,
    mutations
}