<template>
<div class="app-sidebar">
    <el-menu router class="sidebar-menu" 
        :default-active="active" 
        :default-openeds="[openeds]"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse">
        <el-submenu v-for="(val, key) in list" :key="key" :index="val.depth">
            <template slot="title">
                <i :class="'el-icon-' + val.iconName"></i>
                <span>{{ val.title }}</span>
            </template>
            <el-menu-item v-for="(item, index) in val.list" :key="index" :index="item.link">
                {{ item.title }}
            </el-menu-item>
        </el-submenu>
    </el-menu>
    <div class="sidebar-ctrl-btn" :class="{ off: isCollapse }" @click.stop=" isCollapse = !isCollapse ">
        <i class="el-icon-arrow-left"></i>
    </div>
</div>
</template>

<script>
export default {
    name: 'app-sidebar',
    props: {
        list: Array,
        active: String,
        openeds: String
    },
    data(){
        return {
            isCollapse: false
        }
    }
}
</script>

<style>
.app-sidebar {
    height: 100%;
    background-color: #001529;
    position: relative;
}
.app-sidebar .sidebar-menu:not(.el-menu--collapse) {
    width: 200px;
}
.app-sidebar .sidebar-menu {
    border-right: none;
    /* min-height: 400px; */
}
.app-sidebar .sidebar-ctrl-btn {
    background-color: #002140;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    z-index: 9;
}
.app-sidebar .sidebar-ctrl-btn.off > i {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}
</style>