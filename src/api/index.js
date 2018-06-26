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

// 获取城市的信息 select
export const getCitySelect = params => instance.get('mgr/dict/getDict', {params})

// 添加门店
export const addStoreInfo = params => instance.post('/mgr/store/add', params)

// 查看门店信息
export const getStoreRecord = params => instance.get('/mgr/store/showById', {params})

// 修改门店信息
export const modStoreRecord = params => instance.post('/mgr/store/updateById', params)

// 启用/停用门店
export const stopStore = params => instance.get('/mgr/store/stop', {params})

// 获取门店(部门)列表 select
export const getDeptSelect = params => instance.get('', {params})

// 获取职位列表 select
export const getJobSelect = params => instance.get('', {params})

// 获取岗位列表 select
export const getKindSelect = params => instance.get('', {params})

// 获取员工在职状态
export const getJobStatusSelect = params => instance.get('', {params})

// 获取员工列表
export const getStuffInfo = params => instance.get('/mgr/staff/list', {params})

// 新增员工
export const addStuffInfo = params => instance.post('/mgr/staff/add', params)