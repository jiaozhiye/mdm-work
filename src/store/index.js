/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import app from './modules/application'
import stateChange from './modules/state-change'
import dict from './modules/dictionary'
import editer from './modules/editer'

const store = new Vuex.Store({
    modules: {
        app,
        stateChange,
        dict,
        editer
    }
})

export default store