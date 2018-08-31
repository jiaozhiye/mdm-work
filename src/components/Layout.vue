<template>
<el-container class="is-vertical my-app">
    <app-header style="height: 50px">
        <app-head-nav slot="topnav" :list="navList" :path="routerPath"></app-head-nav>
    </app-header>
    <el-container>
        <app-sidebar :list="sidebarList" :path="routerPath"></app-sidebar>
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
import { doLogin } from 'api'

import AppHeader from 'components/Header.vue'
import AppHeadNav from 'components/HeadNav.vue'
import AppSidebar from 'components/Sidebar.vue'

export default {
    name: 'Layout',
    data (){
        return {
            sidebarList: [] // 侧边栏分类数组
        }
    },
    computed: {
        ...mapState('app', ['navList']),
        ...mapState('dict', ['planTheadList']),
        routerPath(){
            return this.$route.path
        },
        key(){
            return this.$route.name !== undefined ? this.$route.name + +new Date() : 'view-' + +new Date()
        }
    },
    watch: {
        $route (to, from){
            this.setNavInfo()
        }
    },
    created(){
        this.setNavInfo()
        this.createPlanTheadList()
    },
    methods: {
        ...mapActions('dict', ['createPlanTheadList']),
        setNavInfo(){
            let curNavObj = this.navList.find(item => item.link === '/' + this.routerPath.split('/')[1])
            if (!curNavObj){
                curNavObj = this.navList[0] || []
            }
            this.sidebarList = curNavObj.list
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