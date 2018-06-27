import * as types from '../types'

import {
    getDeptSelect,
    getDictSelect
} from 'api'

// state
const state = {
    // 性别列表
    sexList: [{name: '全部', value: '-1'}, {name: '男', value: '1'}, {name: '女', value: '0'}],
    // 门店(部门)列表
    deptList: [],
    // 职位列表
    jobList: [],
    // 岗位列表
    kindList: [],
    // 工作类型
    workTypeList: [],
    // 城市列表
    cityList: [],
    // 员工在职状态列表
    jobStatusList: [],
    // 通知的状态
    noticStateList: [],
    // 职位级别
    jobLevelList: [],
    // 调出类型列表
    transferOutList: [],
    // 调入类型列表
    transferInList: [],
    // 奖罚类别
    scoreTypeList: []
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
        const response = await getDictSelect({ dict: 'position' })
        commit({
            type: types.JOB_SELECT,
            data: response.data || []
        })
    },
    async createKindList ({ state, commit }, params){
        if (state.kindList.length) return
        const response = await getDictSelect({ dict: 'post' })
        commit({
            type: types.KIND_SELECT,
            data: response.data || []
        })
    },
    async createWorkTypeList ({ state, commit }, params){
        if (state.workTypeList.length) return
        const response = await getDictSelect({ dict: 'staff_type' })
        commit({
            type: types.WORK_TYPE_SELECT,
            data: response.data || []
        })
    },
    async createCityList ({ state, commit }, params){
        if (state.cityList.length) return
        const response = await getDictSelect({ dict: 'city' })
        commit({
            type: types.CITY_SELECT,
            data: response.data || []
        })
    },
    async createJobStatusList ({ state, commit }, params){
        if (state.jobStatusList.length) return
        const response = await getDictSelect({ dict: 'job_type' })
        commit({
            type: types.JOB_STATUS_SELECT,
            data: response.data || []
        })
    },
    async createNoticeStateList ({ state, commit }, params){
        if (state.noticStateList.length) return
        const response = await getDictSelect({ dict: 'notice' })
        commit({
            type: types.NOTICE_STATE_SELECT,
            data: response.data || []
        })
    },
    async createJobLevelList ({ state, commit }, params){
        if (state.jobLevelList.length) return
        const response = await getDictSelect({ dict: 'level' })
        commit({
            type: types.JOB_LEVEL_SELECT,
            data: response.data || []
        })
    },
    async createTransferOutList ({ state, commit }, params){
        if (state.transferOutList.length) return
        const response = await getDictSelect({ dict: 'out_type' })
        commit({
            type: types.TRANSFER_OUT_SELECT,
            data: response.data || []
        })
    },
    async createTransferInList ({ state, commit }, params){
        if (state.transferInList.length) return
        const response = await getDictSelect({ dict: 'in_type' })
        commit({
            type: types.TRANSFER_IN_SELECT,
            data: response.data || []
        })
    },
    async createScoreTypeList ({ state, commit }, params){
        if (state.scoreTypeList.length) return
        const response = await getDictSelect({ dict: 'performance_type' })
        commit({
            type: types.SCORE_TYPE_SELECT,
            data: response.data || []
        })
    },
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
    [types.WORK_TYPE_SELECT](state, { data }){
        state.workTypeList = data
    },
    [types.CITY_SELECT](state, { data }){
        state.cityList = data
    },
    [types.JOB_STATUS_SELECT](state, { data }){
        state.jobStatusList = data
    },
    [types.NOTICE_STATE_SELECT](state, { data }){
        state.noticStateList = data
    },
    [types.JOB_LEVEL_SELECT](state, { data }){
        state.jobLevelList = data
    },
    [types.TRANSFER_OUT_SELECT](state, { data }){
        state.transferOutList = data
    },
    [types.TRANSFER_IN_SELECT](state, { data }){
        state.transferInList = data
    },
    [types.SCORE_TYPE_SELECT](state, { data }){
        state.scoreTypeList = data
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}