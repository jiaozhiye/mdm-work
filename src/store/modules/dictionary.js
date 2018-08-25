import * as types from '../types'

import {
    getDeptSelect,
    getFromDeptSelect,
    getClassifySelect,
    getDictSelect,
    getPlanThead
} from 'api'

// state
const state = {
    // 性别列表
    sexList: [{name: '全部', value: '-1'}, {name: '男', value: '1'}, {name: '女', value: '0'}],
    // 星期列表
    weekList: [
        {name: '星期一', value: '0'},
        {name: '星期二', value: '1'},
        {name: '星期三', value: '2'},
        {name: '星期四', value: '3'},
        {name: '星期五', value: '4'},
        {name: '星期六', value: '5'},
        {name: '星期日', value: '6'}
    ],
    // 门店(部门)列表
    deptList: [],
    // 来源门店
    fromDeptList: [],
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
    // 员工在职状态列表 - 包含禁用项
    jobStatusDisabledList: [],
    // 通知的状态
    noticStateList: [],
    // 职位级别
    jobLevelList: [],
    // 调出类型列表
    transferOutList: [],
    // 调入类型列表
    transferInList: [],
    // 奖罚类别
    scoreTypeList: [],
    // 分类列表
    classifyList: [],
    // 通知类型
    noticTypeList: [],
    // 排班表头列表
    planTheadList: [],
    // 调出员工状态
    staffOutStatusList: []
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
    async createFromDeptList ({ state, commit }, params){
        if (state.fromDeptList.length) return
        const response = await getFromDeptSelect()
        commit({
            type: types.FROM_DEPT_SELECT,
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
    async createJobStatusDisabledList ({ state, commit }, params){
        if (state.jobStatusDisabledList.length) return
        const response = await getDictSelect({ dict: 'job_type_disabled' })
        commit({
            type: types.JOB_STATUS_DISABLED_SELECT,
            data: response.data || []
        })
    },
    async createNoticeStateList ({ state, commit }, params){
        if (state.noticStateList.length) return
        const response = await getDictSelect({ dict: 'notice_status' })
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
    async createClassifyList ({ state, commit }, params){
        if (state.classifyList.length) return
        const response = await getClassifySelect()
        commit({
            type: types.CLASSIFY_SELECT,
            data: response.data || []
        })
    },
    async createNoticTypeList ({ state, commit }, params){
        if (state.noticTypeList.length) return
        const response = await getDictSelect({ dict: 'notice_type' })
        commit({
            type: types.NOTICE_TYPE_SELECT,
            data: response.data || []
        })
    },
    async createPlanTheadList ({ state, commit }, params){
        if (state.planTheadList.length) return
        const response = await getPlanThead()
        commit({
            type: types.PLAN_THEAD,
            data: response.data || []
        })
    },
    async createOutStatusList ({ state, commit }, params){
        if (state.staffOutStatusList.length) return
        const response = await getDictSelect({ dict: 'out_status' })
        commit({
            type: types.STAFF_OUT_STATUS,
            data: response.data || []
        })
    },
}

// mutations
const mutations = {
    [types.DEPT_SELECT](state, { data }){
        state.deptList = data
    },
    [types.FROM_DEPT_SELECT](state, { data }){
        state.fromDeptList = data
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
    [types.JOB_STATUS_DISABLED_SELECT](state, { data }){
        state.jobStatusDisabledList = data
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
    [types.CLASSIFY_SELECT](state, { data }){
        state.classifyList = data
    },
    [types.NOTICE_TYPE_SELECT](state, { data }){
        state.noticTypeList = data
    },
    [types.PLAN_THEAD](state, { data }){
        state.planTheadList = data
    },
    [types.STAFF_OUT_STATUS](state, { data }){
        state.staffOutStatusList = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
