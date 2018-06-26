import * as types from '../types'

import {
    getDeptSelect,
    getJobSelect,
    getKindSelect,
    getCitySelect,
    getJobStatusSelect
} from 'api'

// state
const state = {
    // 性别列表
    sexList: [{name: '全部', value: '-1'}, {name: '男', value: '0'}, {name: '女', value: '1'}],
    // 门店(部门)列表
    deptList: [],
    // 职位列表
    jobList: [],
    // 岗位列表
    kindList: [],
    // 工作类型
    workTypeList: [{name: '全部', value: '-1'}, {name: '全职', value: '0'}, {name: '兼职', value: '1'}],
    // 城市列表
    cityList: [],
    // 员工在职状态列表
    jobStatusList: []
}

// actions
const actions = {
    async createDeptList ({ state, commit }, params){
        if (state.deptList.length) return
        const response = await getDeptSelect()
        commit({
            type: types.DEPT_SELECT,
            data: response.data || []
        })
    },
    async createJobList ({ state, commit }, params){
        if (state.jobList.length) return
        const response = await getJobSelect()
        commit({
            type: types.JOB_SELECT,
            data: response.data || []
        })
    },
    async createKindList ({ state, commit }, params){
        if (state.kindList.length) return
        const response = await getKindSelect()
        commit({
            type: types.KIND_SELECT,
            data: response.data || []
        })
    },
    async createCityList ({ state, commit }, params){
        if (state.cityList.length) return
        const response = await getCitySelect({ dict: 'city' })
        commit({
            type: types.CITY_SELECT,
            data: response.data || []
        })
    },
    async createJobStatusList ({ state, commit }, params){
        if (state.jobStatusList.length) return
        const response = await getJobStatusSelect()
        commit({
            type: types.JOB_STATUS_SELECT,
            data: response.data || []
        })
    }
}

// mutations
const mutations = {
    [types.DEPT_SELECT](state, { data }){
        state.deptList = data
    },
    [types.JOB_SELECT](state, { data }){
        state.jobList = data
    },
    [types.KIND_SELECT](state, { data }){
        state.kindList = data
    },
    [types.CITY_SELECT](state, { data }){
        state.cityList = data
    },
    [types.JOB_STATUS_SELECT](state, { data }){
        state.jobStatusList = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}