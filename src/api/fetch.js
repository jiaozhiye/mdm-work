import axios from 'axios'
import qs from 'qs'
import common from 'assets/js/common'
import { removeToken } from 'assets/js/auth'
import store from 'store'
import { Message } from 'element-ui'

console.info(common.env)
const serverUrl = common.serverUrl.charAt(common.serverUrl.length - 1) === '/' 
    ? common.serverUrl : `${common.serverUrl}/`

const qnTokenUrl = common.qnTokenUrl || ''

// nodejs 接口
const nodeServerUrl = common.nodeServerUrl.charAt(common.nodeServerUrl.length - 1) === '/' 
    ? common.nodeServerUrl : `${common.nodeServerUrl}/`

const instance = axios.create({
    baseURL: serverUrl,
    timeout: 5000,
    // withCredentials: true, // 跨域请求时是否需要使用凭证
    paramsSerializer: params => {
        // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
        // 返回值必须是字符串类型
        return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    transformRequest: [data => {
        // 在向服务器发送前修改请求数据，只适用于 POST
        // 返回值必须是字符串类型
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
    Message.error('请求超时！')
    return Promise.reject(error)
})

// http 响应拦截器
instance.interceptors.response.use(response => {
    store.dispatch('stateChange/setBtnLoading', !1)
    // 如果服务端 session 过期，移除cookie
    if (response.data.code == 'nosid'){
        removeToken()
    }
    return response.data
}, error => {
    store.dispatch('stateChange/setBtnLoading', !1)
    Message.error(error.response.data || '数据加载失败！')
    return Promise.reject(error)
})

export { instance, serverUrl, qnTokenUrl, nodeServerUrl }
