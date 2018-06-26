import * as types from '../types'

// state
const state = {
    btnLoading: false, // 按钮的加载中状态
    isLeaveRemind: false // true -> 开启提醒     false -> 关闭提醒
}

// actions
const actions = {
    setBtnLoading ({ commit }, params){
        commit({
            type: types.BUTTON_LOADING,
            data: params
        })
    },
    setLeaveRemind ({ commit }, params){
        commit({
            type: types.LEAVE_REMIND,
            data: params
        })
    }
}

// mutations
const mutations = {
    [types.BUTTON_LOADING](state, { data }){
        state.btnLoading = data
    },
    [types.LEAVE_REMIND](state, { data }){
        state.isLeaveRemind = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}