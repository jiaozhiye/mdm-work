import * as types from '../types'
import { getPosterList, removeTemplate, getPosterInfo } from 'api'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

// state
const state = {
    navList: [
        {id: '1', name: '模板', value: 'template', icon: 'eqf-tempalte-l', active: true},
        {id: '2', name: '文字', value: 'text', icon: 'eqf-fontmall', active: false},
        {id: '3', name: '上传', value: 'upload', icon: 'eqf-cloudupload-l', active: false}
    ],
    templateList: [],
    uploadList: [],
    outer_style_arr: ['position', 'left', 'top', 'rotateZ', 'zIndex'],
    inner_style_arr: ['width', 'height', 'color', 'fontFamily', 'fontSize', 'lineHeight', 'opacity', 'letterSpacing', 'textAlign', 'fontWeight'],
    box_style_arr: ['left', 'top', 'width', 'height', 'rotateZ', 'zIndex'],
    fontFamilyList: [
        {
            value: 'Microsoft YaHei',
            label: '微软雅黑'
        },
        {
            value: 'fangzheng_ssjt',
            label: '方正书宋简体'
        },
        {
            value: 'fangzheng_ktjt',
            label: '方正楷体简体'
        },
        {
            value: 'fangzheng_htjt',
            label: '方正黑体简体'
        },
        {
            value: 'Zhengqingkehuangyouti',
            label: '郑庆科黄油体'
        },
        {
            value: 'Zhankukuaileti',
            label: '站酷快乐体'
        },
        {
            value: 'Zhankugaoduanhei',
            label: '站酷高端黑'
        },
        {
            value: 'Zhankukuhei',
            label: '站酷酷黑'
        },
        {
            value: 'Zhankuwenyiti',
            label: '站酷文艺体'
        },
        {
            value: 'ZhankuxiaoweiLOGOti',
            label: '站酷小徽LOGI体'
        },
        {
            value: 'Yangrendongzhushiti',
            label: '杨任东竹石体'
        },
        {
            value: 'Yangrendongzhushiticu',
            label: '杨任东竹石粗体'
        },
        {
            value: 'Yangrendongzhushitixi',
            label: '杨任东竹石细体'
        },
        {
            value: 'Pangmenzhengdaobiaotiti',
            label: '庞门正道标题体'
        },
        {
            value: 'Arual',
            label: 'Arual'
        }
    ],
    textStyle: { // 插入文本样式
        title: {size: 68, weight: 'bold'},
        content: {size: 48, weight: 'normal'}
    },
    poster: {
        name: '',
        desc: '',
        size: [ 640, 1008 ],
        type: '手机海报', // 海报类型
        scale: 1,
        current: -1, // 当前操作的元素 -> 与元素的 zIndex 对应
        elements: []
    },
    historys: { // 操作历史，保存 5 步记录
        list: [[]],
        isChange: true, // 是否可操作(改变) historys 数组
        curStep: -1 // 用于恢复和撤销
    }
}

const getMaxIndex = () => state.poster.elements.length ? 
    (state.poster.elements.sort((a, b) => b.zIndex - a.zIndex)[0].zIndex + 1) 
    : 1

const findElementByIndex = index => state.poster.elements.find(item => item.zIndex == index)

// actions
const actions = {
    createPosterName ({ state, commit }, params){
        commit({
            type: types.POSTER_NAME,
            data: params || {}
        })
    },
    createPosterScale ({ state, commit }, params){
        commit({
            type: types.POSTER_SCALE,
            data: params || state.poster.scale
        })
    },
    createPosterImgs ({ state, commit }, params){
        const __img__ = {
            position: 'absolute',
            left: 0,
            top: 0,
            rotateZ: 0,
            url: params.path || '',
            width: state.poster.size[0],
            height: state.poster.size[1],
            zIndex: getMaxIndex() > 1 ? 1 : getMaxIndex() // 图片作为底图
        }
        commit({
            type: types.POSTER_IMGS,
            data: __img__
        })
    },
    resizePosterElement ({ state, commit }, params){
        commit({
            type: types.POSTER_RESIZE,
            index: params.index || -1,
            data: params || {}
        })
    },
    dirSetPosterElement ({ state, commit }, params){
        commit({
            type: types.POSTER_DIR_SET,
            index: params.index || -1,
            data: params || {}
        })
    },
    addNewPosterText ({ state, commit }, params){
        const __text__ = {
            position: 'absolute',
            left: 50,
            top: 200,
            rotateZ: 0,
            content: '双击后可编辑',
            color: '#000',
            fontFamily: '',
            fontSize: state.textStyle[params].size,
            lineHeight: 1.2,
            opacity: 1,
            letterSpacing: 0,
            textAlign: 'center',
            fontWeight: state.textStyle[params].weight,
            width: 540,
            height: state.textStyle[params].size * 1.2 * 2,
            zIndex: getMaxIndex() < 2 ? 2 : getMaxIndex() // zIndex 大于底图
        }
        commit({
            type: types.POSTER_TEXT_ADD,
            data: __text__
        })
    },
    createEditingIndex ({ state, commit }, params){
        commit({
            type: types.POSTER_EDITING_INDEX,
            data: params || -1
        })
    },
    changePosterText ({ state, commit }, params){
        commit({
            type: types.POSTER_CHANGE_TEXT,
            index: params.index || -1,
            data: params.text
        })
    },
    clearPosterArea ({ state, commit }, params){
        commit({
            type: types.POSTER_CLEAR_AREA,
            data: params || []
        })
    },
    createHistory ({ state, commit }, params){
        commit({
            type: types.POSTER_ADD_HISTORY,
            data: params || []
        })
    },
    resetPosterByHistory ({ state, commit }, params){
        commit({
            type: types.POSTER_RESET_BY_HISTORY,
            data: typeof params !== 'undefined' ? params : -1
        })
    },
    changeHistoryState ({ state, commit }, params){
        commit({
            type: types.POSTER_HISTORY_STATE,
            data: params
        })
    },
    async requestTemplateList ({ state, commit }, params){
        const response = await getPosterList()
        // console.log(response)
        if (response.code == 1){
            commit({
                type: types.POSTER_GET_TEMPLATE,
                data: response.data || []
            })
        }
    },
    createUploadTemplate ({ state, commit }, params){
        commit({
            type: types.POSTER_UPLOAD_TEMPLATE,
            data: params
        })
    },
    async removeTemplateRecord ({ state, commit }, params){
        const response = await removeTemplate({ id: params })
        if (response.code == 1){
            commit({
                type: types.POSTER_REMOVE_TEMPLATE,
                data: params
            })
            Message.success(response.message)
        } else {
            Message.error(response.message)
        }
    },
    async requestPosterRecord ({ state, commit }, { id, callback }){
        if (!id) return
        const response = await getPosterInfo({ id })
        if (response.code == 1){
            commit({
                type: types.POSTER_GET_RECORD,
                data: response.data || {}
            })
            // 重新编辑，设置 cookie
            Cookies.set('poster_id', id)
            // 执行回调
            callback && callback()
        } else {
            Message.error(response.message)
        }
    }
}

// mutations
const mutations = {
    [types.POSTER_NAME](state, { data }){
        state.poster.name = data.name || ''
        state.poster.desc = data.desc || ''
    },
    [types.POSTER_SCALE](state, { data }){
        state.poster.scale = data
    },
    [types.POSTER_IMGS](state, { data }){
        let v = state.poster.elements.findIndex(item => item.url)
        if (v !== -1){
            state.poster.elements.splice(v, 1, data)
        } else {
            state.poster.elements.push(data)
        }
    },
    [types.POSTER_RESIZE](state, { index, data }){
        const __item__ = findElementByIndex(index)
        for (let attr in data){
            if (attr === 'index') continue
            // 旋转角度和 scale 无关
            if (attr !== 'rotateZ'){
                __item__[attr] = Math.round(data[attr] / state.poster.scale)
            } else {
                __item__[attr] = data[attr]
            }
        }
    },
    [types.POSTER_DIR_SET](state, { index, data }){
        const __item__ = findElementByIndex(index)
        for (let attr in data){
            if (attr === 'index') continue
            __item__[attr] = data[attr]
        }
    },
    [types.POSTER_TEXT_ADD](state, { data }){
        state.poster.elements.push(data)
    },
    [types.POSTER_EDITING_INDEX](state, { data }){
        const __item__  = findElementByIndex(data)
        if (!__item__){
            state.poster.current = -1
        } else {
            state.poster.current = __item__.zIndex
        }
    },
    [types.POSTER_CHANGE_TEXT](state, { index, data }){
        const __item__  = findElementByIndex(index)
        __item__.content = data
    },
    [types.POSTER_CLEAR_AREA](state, { data }){
        state.poster.elements = data
    },
    [types.POSTER_ADD_HISTORY](state, { data }){
        state.historys.list.push(data)
        if (state.historys.list.length > 5){
            state.historys.list.shift()
        }
        state.historys.curStep = state.historys.list.length - 1
    },
    [types.POSTER_RESET_BY_HISTORY](state, { data }){
        // 对索引进行越界处理
        data = data < 0 ? 0 : data
        data = data > (state.historys.list.length - 1) ? (state.historys.list.length - 1) : data
        state.poster.elements = state.historys.list[data]
        // 当有恢复和撤销，同步 curStep 的值
        state.historys.curStep = data
    },
    [types.POSTER_HISTORY_STATE](state, { data }){
        state.historys.isChange = data
    },
    [types.POSTER_GET_TEMPLATE](state, { data }){
        state.templateList = data
    },
    [types.POSTER_UPLOAD_TEMPLATE](state, { data }){
        state.uploadList.push(data)
        state.templateList.unshift(data)
    },
    [types.POSTER_REMOVE_TEMPLATE](state, { data }){
        let index = state.uploadList.findIndex(item => item.id === data)
        if (index != -1){
            state.uploadList.splice(index, 1)
        }
    },
    [types.POSTER_GET_RECORD](state, { data }){
        state.poster.name = data.name
        state.poster.desc = data.desc
        state.poster.size = data.size.split('*')
        state.poster.type = data.type
        state.poster.elements = JSON.parse(data.elements)
        // console.log(state.poster)
    }
}

// getters
const getters = {
    scalePercent({ poster }){
        return `${Math.round(poster.scale * 100)}%`
    },
    elementsList({ poster }){
        // poster.elements.sort((a, b) => a.zIndex - b.zIndex)
        return poster.elements
    },
    currentIndex({ poster }){
        return poster.current
    },
    isChangeHistorys({ historys }){
        return historys.isChange
    },
    currentStep({ historys }){
        return historys.curStep
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}