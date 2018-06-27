import axios from 'axios'
import qs from 'qs'
import common from 'assets/js/common'
import store from 'store'
import { Message } from 'element-ui'

console.info(common.env)

const instance = axios.create({
    baseURL: common.serverUrl,
    timeout: 5000,
    // withCredentials: true, // 跨域请求时是否需要使用凭证
    paramsSerializer: params => {
        // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
        return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    transformRequest: [data => {
        // 在向服务器发送前修改请求数据，只适用于 POST
        return qs.stringify(data, { arrayFormat: 'repeat' })
    }],
    headers: {
        post: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
})

// http 请求拦截器
instance.interceptors.request.use(config => {
    store.dispatch('stateChange/setBtnLoading', !0)
    return config
}, error => {
    store.dispatch('stateChange/setBtnLoading', !1)
    Message.error('数据加载超时！')
    return Promise.reject(error)
})

// http 响应拦截器
instance.interceptors.response.use(response => {
    store.dispatch('stateChange/setBtnLoading', !1)
    return response.data
}, error => {
    store.dispatch('stateChange/setBtnLoading', !1)
    Message.error('数据加载失败！')
    return Promise.reject(error)
})

/**
 * 向后台请求数据的 API 接口
 */

// 登录接口
export const doLogin = params => instance.post('/login', params)

// 退出登录接口
export const doLogout = () => instance.get('/logout')

// 获取应用导航接口
export const getNavList = () => instance.get('/mgr/menu')

// 显示所有门店
export const getStoreList = params => instance.get('/mgr/store/list', {params})

// 添加门店
export const addStoreInfo = params => instance.post('/mgr/store/add', params)

// 查看门店信息
export const getStoreRecord = params => instance.get('/mgr/store/showById', {params})

// 修改门店信息
export const modStoreRecord = params => instance.post('/mgr/store/updateById', params)

// 启用/停用门店
export const stopStore = params => instance.get('/mgr/store/stop', {params})

// 获取门店(部门)列表 select
export const getDeptSelect = () => instance.get('mgr/store/getStoreDict')

// 获取数据字典列表 select
export const getDictSelect = params => instance.get('mgr/dict/getDictIncludeChoose', {params})

// 获取员工列表
export const getStaffInfo = params => instance.get('/mgr/staff/list', {params})

// 新增员工
export const addStaffInfo = params => instance.post('/mgr/staff/add', params)

// 获取通知的状态列表
export const getNoticeStateSelect = params => instance.get('', {params})

// 获取通知信息
export const getNoticeRecord = params => instance.get('/mgr/notice/showApplyById', {params})

// 处理申请调入
export const execApplyIn = params => instance.post('/mgr/apply/deal', params)

// 辞退员工
export const fireStaff = params => instance.post('/mgr/storeMgr/fire', params)

// 获取员工信息
export const getStaffRecord = params => instance.get('/mgr/staff/showById', {params})

// 修改员工信息
export const modStaffInfo = params => instance.post('/mgr/staff/updateById', params)

// 处理调出员工
export const execTransferOut = params => instance.post('/mgr/moveOut/out', params)

// 获取不在职员工信息
export const getNoJobStaffInfo = params => instance.get('/mgr/staffNotOnJob/list', {params})

// 获取不在职员工信息
export const getOffJobStaffRecord = params => instance.get('/mgr/staffNotOnJob/showById', {params})

// 恢复员工在职
export const recoverStaffOnJob = params => instance.get('', {params})

// 获取调入员工列表
export const getStaffInList = params => instance.get('/mgr/moveIn/list', {params})

// 获取员工调入信息
export const getStaffInRecord = params => instance.get('/mgr/moveIn/showById', {params})

// 获取调出员工列表
export const getStaffOutList = params => instance.get('/mgr/moveOut/list', {params})

// 获取调出员工信息
export const getStaffOutRecord = params => instance.get('/mgr/moveOut/showById', {params})

// 撤销调出
export const cancleStaffOut = params => instance.get('/mgr/moveOut/cancelOut', {params})

// 获取绩效考核列表
export const getStaffScoreList = params => instance.get('/mgr/performance/list', {params})

// 获取员工绩效
export const getStaffScoreRecord = params => instance.get('/mgr/performance/showById', {params})

// 修改员工绩效
export const modStaffScoreRecord = params => instance.post('/mgr/performance/updateById', params)

// 删除奖罚
export const delStaffScoreRecord = params => instance.get('/mgr/performance/deleteById', {params})

// 添加惩罚
export const addStaffScoreRecord = params => instance.post('/mgr/performance/add', params)

// 新增分类
export const addTrainClass = params => instance.post('/mgr/train/type/add', params)








