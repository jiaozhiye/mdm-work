import * as types from '../types'

// state
const state = {
    navList: [
        {id: '1', name: '模板', value: 'template', icon: 'eqf-tempalte-l', active: true},
        {id: '2', name: '文字', value: 'text', icon: 'eqf-fontmall', active: false},
        {id: '3', name: '上传', value: 'upload', icon: 'eqf-cloudupload-l', active: false}
    ],
    templateList: [
        {id: '1', img_url: '/static/1.png'},
        {id: '2', img_url: '/static/2.png'},
        {id: '3', img_url: '/static/1.png'},
        {id: '4', img_url: '/static/2.png'}
    ],
    textStyle: { // 插入文本样式
        title: {size: 68, weight: 'bold'},
        content: {size: 48, weight: 'normal'}
    },
    poster: {
        name: '',
        desc: '',
        size: [640, 1008],
        type: '手机海报', // 海报类型
        scale: 1,
        current: -1, // 当前操作的元素 -> 与元素的 zIndex 对应
        elements: []
    }
}

const getMaxIndex = () => state.poster.elements.length ? 
    (state.poster.elements.sort((a, b) => b.zIndex - a.zIndex)[0].zIndex + 1) 
    : 1

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
            zIndex: getMaxIndex()
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
    addNewPosterText ({ state, commit }, params){
        const __text__ = {
            position: 'absolute',
            left: 50,
            top: 200,
            rotateZ: 0,
            content: '双击后可编辑',
            color: 'rgb(0, 0, 0)',
            fontFamily: '微软雅黑',
            fontSize: state.textStyle[params].size,
            lineHeight: 1.2,
            opacity: 1,
            textAlign: 'center',
            fontWeight: state.textStyle[params].weight,
            width: 540,
            height: state.textStyle[params].size * 1.2,
            isEdit: false,
            zIndex: getMaxIndex()
        }
        commit({
            type: types.POSTER_TEXT_ADD,
            data: __text__
        })
    },
    toggleEditState ({ state, commit }, params){
        commit({
            type: types.POSTER_EDIT_STATE,
            index: params.index || -1,
            data: params.status || !1
        })
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
        const __item__ = state.poster.elements.find(item => item.zIndex == index)
        for (let attr in data){
            if (attr === 'index') continue
            // 旋转角度和 scale 无关
            if (attr !== 'rotateZ'){
                __item__[attr] = data[attr] / state.poster.scale
            } else {
                __item__[attr] = data[attr]
            }
        }
    },
    [types.POSTER_TEXT_ADD](state, { data }){
        state.poster.elements.push(data)
    },
    [types.POSTER_EDIT_STATE](state, { index, data }){
        const __item__  = state.poster.elements.find(item => item.zIndex == index)
        __item__.isEdit = data
        if (!data){ // 不可编辑
            state.poster.current = -1
        } else {
            state.poster.current = __item__.zIndex
        }
    }
}

// getters
const getters = {
    scalePercent({ poster }){
        return `${Math.round(poster.scale * 100)}%`
    },
    elementsList({ poster }){
        return poster.elements.sort((a, b) => a.zIndex - b.zIndex)
    },
    currentIndex({ poster }){
        return poster.current
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}