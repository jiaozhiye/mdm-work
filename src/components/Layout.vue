<template>
<el-container class="is-vertical my-app">
    <app-header style="height: 50px">
        <app-head-nav slot="topnav" :navList="navList" :curIndex="curIndex"></app-head-nav>
    </app-header>
    <el-container>
        <app-sidebar :list="sidebarList" :active="sidebarActive" :openeds="sidebarOpeneds"></app-sidebar>
        <el-main>
            <transition name="router">
                <router-view class="view-wrapper" :key="key"></router-view>
            </transition>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getUrlHash } from 'assets/js/util'
import { doLogin } from 'api'

import AppHeader from 'components/Header.vue'
import AppHeadNav from 'components/HeadNav.vue'
import AppSidebar from 'components/Sidebar.vue'

export default {
    name: 'Layout',
    data (){
        return {
            curIndex: 0, // 当前一级分类索引
            parentDepth: '', // 父级元素的深度
            sidebarList: [], // 侧边栏分类数组
            sidebarActive: '', // 侧边栏选中
            sidebarOpeneds: '' // 侧边栏展开
        }
    },
    computed: {
        ...mapState('app', ['navList']),
        ...mapState('dict', ['planTheadList']),
        key (){
            return this.$route.name !== undefined ? this.$route.name + +new Date() : 'view-' + +new Date()
        }
    },
    watch: {
        $route (to, from){
            if (this.navList.length > 0 && to.path.split('/').length < 3){
                this.setNavInfo()
            }
        }
    },
    created(){
        this.iterFunc(this.navList, '')
        this.setNavInfo()
        this.createPlanTheadList()
    },
    methods: {
        ...mapActions('dict', ['createPlanTheadList']),
        setNavInfo(){
            // 处理 hash 值
            let _hash = getUrlHash()
            // 获取一级分类索引
            this.curIndex = this.navList.findIndex(item => item.link === '/' + _hash.split('/')[1])
            // console.log(this.curIndex)
            if (this.curIndex === -1) this.curIndex = 0
            // 设置导航菜单信息
            this.sidebarList = _.cloneDeep(this.navList[this.curIndex].list)
            // 获取父元素的深度
            this.findParDepth(this.navList, _hash)
            // console.log(_hash, this.parentDepth)
            // 切换导航菜单选中状态
            this.sidebarActive  = _hash
            this.sidebarOpeneds = this.parentDepth
        },
        iterFunc(arr, str){
            for (let i = 0; i < arr.length; i++){
                arr[i].depth = str + i
                if (_.isArray(arr[i].list)){
                    this.iterFunc(arr[i].list, arr[i].depth + '-')
                }
            }
        },
        findParDepth(arr, str){
            for (let i = 0; i < arr.length; i++){
                if (arr[i].link === str){
                    this.parentDepth = arr[i].depth.slice(0, -2)
                } else {
                    if (_.isArray(arr[i].list)){
                        this.findParDepth(arr[i].list, str)
                    }
                }
            }
        }
    },
    components: {
        AppHeader,
        AppHeadNav,
        AppSidebar
    }
}
</script>

<style>
.my-app > .el-container {
    height: calc(100vh - 50px);
    display: flex;
}
.my-app .el-main {
    position: relative;
    background-color: #f2f2f2;
    flex: 1;
    padding: 10px;
}
.my-app .view-wrapper {
    position: absolute;
    left: 10px;
    right: 10px;
    /* min-height: calc(100vh - 70px); */
    background-color: #fff;
}

/**
 * 路由组件切换动画
 */
#app .router-enter {
    opacity: 0;
    -webkit-transform: translate3d(0, 25px, 0);
    transform: translate3d(0, 25px, 0);
}
#app .router-enter-to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
#app .router-leave {
    opacity: 1;
}
#app .router-leave-to {
    opacity: 0;
}
#app .router-enter-to,
#app .router-leave {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
#app .router-enter-active,
#app .router-leave-active {
    -webkit-transition: all .5s ease-out;
    transition: all .5s ease-out;
}
</style>