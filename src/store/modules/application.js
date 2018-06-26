import * as types from '../types'
import { setToken } from 'assets/js/auth'

import { getNavList } from 'api'

// state
const state = {
    loginInfo: {},
    navList: []
}

// actions
const actions = {
    createLoginInfo ({ commit }, params){
        setToken(params.id)
        commit({
            type: types.LOGININFO,
            data: params
        })
    },
    async createNavList ({ commit, state }, params){
        if (state.navList.length) return
        // const response = await getNavList()
        commit({
            type: types.NAVLIST,
            // data: response.data || [],
            data: params
        })
    }
}

// mutations
const mutations = {
    [types.LOGININFO](state, { data }){
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