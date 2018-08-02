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
        {id: '2', img_url: '/static/1.png'},
        {id: '3', img_url: '/static/1.png'},
        {id: '4', img_url: '/static/1.png'}
    ],
    poster: {
        name: '',
        desc: '',
        size: [640, 1008],
        type: '手机海报', // 海报类型
        scale: 1,
        imgs: [
            {
                position: 'absolute',
                left: 0,
                top: 0,
                rotateZ: 0,
                url: '/static/1.png',
                width: 640,
                height: 1008,
                zIndex: 1
            }
        ],
        texts: [
            {
                position: 'absolute',
                left: 100,
                top: 500,
                rotateZ: 0,
                content: '你好',
                color: 'red',
                backgroundColor: 'yellow',
                fontSize: 30,
                lineHeight: 1.2,
                padding: 20,
                textAlign: 'center',
                fontWeight: 'bold',
                width: 200,
                zIndex: 2
            }
        ]
    }
}

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
    }
}

// getters
const getters = {
    scalePercent({ poster }){
        return `${Math.round(poster.scale * 100)}%`
    },
    elementsList({ poster }){
        let __arr__ = poster.imgs.concat(poster.texts)
        __arr__.sort((a, b) => a.zIndex - b.zIndex)
        return __arr__
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}