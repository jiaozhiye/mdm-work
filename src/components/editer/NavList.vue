<template>
    <div class="mdm-nav">
        <ul class="list">
            <li class="logo" :class="{ left: isShowNavPanel }" @click="clickHandler">
                <i class="icon eqf-arrow-right"></i>
            </li>
            <li class="item" :class="{ active: item.active }" v-for="item in navList" :key="item.id"
                @click="tabPandelHandler(item)">
                <i class="icon" :class="item.icon"></i> <span>{{ item.name }}</span>
            </li>            
            <li class="slide"></li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'nav-list',
    props: ['value', 'panelState', 'change'],
    data(){
        return {
            isShowNavPanel: this.panelState
        }
    },
    computed: {
        ...mapState('editer', ['navList']),
    },
    methods: {
        initial(){ // 初始化方法 
            this.$emit('input', this.navList.find(item => item.active).value)
        },
        clickHandler(){
            this.isShowNavPanel = !this.isShowNavPanel
            this.$emit('change', this.isShowNavPanel)
        },
        tabPandelHandler(item){ // 面板选项卡切换
            // 显示面板
            this.isShowNavPanel = !0
            // 切换选中样式
            this.navList.forEach(item => item.active = !1)
            item.active = !0
            // 切换内容
            this.$emit('input', item.value)
            this.$emit('change', this.isShowNavPanel)
        }
    },
    created(){
        this.initial()
    }
}
</script>

<style scoped>
.mdm-nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: none;
    width: 68px;
    height: 100%;
    color: #76838f;
    background: #1d2024;
}
.mdm-nav .list {
    position: relative;
}
.mdm-nav .list .logo.left .icon {
    transform: rotate(-180deg);
}
.mdm-nav .list .logo .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    font-size: 24px;
    cursor: pointer;
    transition: all .3s ease;
}
.mdm-nav .list .item .icon {
    font-size: 24px;
    margin-bottom: 5px;
}
.mdm-nav .list .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 68px;
    font-size: 12px;
    z-index: 1;
    cursor: pointer;
    transition: all .3s;
}

.mdm-nav .list .item:hover:nth-child(2)~.slide {
    transform: translateY(0)!important;
}
.mdm-nav .list .item.active:nth-child(2)~.slide {
    transform: translateY(0);
}
.mdm-nav .list .item:hover:nth-child(3)~.slide {
    transform: translateY(68px)!important;
}
.mdm-nav .list .item.active:nth-child(3)~.slide {
    transform: translateY(68px);
}
.mdm-nav .list .item:hover:nth-child(4)~.slide {
    transform: translateY(136px)!important;
}
.mdm-nav .list .item.active:nth-child(4)~.slide {
    transform: translateY(136px);
}

.mdm-nav .list .slide {
    position: absolute;
    top: 48px;
    left: 0;
    width: 68px;
    height: 68px;
    background: #1593ff;
    transition: all .3s;
}
.mdm-nav .list .item.active,
.mdm-nav .list .item:hover {
    color: #fff;
}
</style>