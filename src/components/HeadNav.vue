<template>
<nav class="head-nav">
   <ul class="clearFix">
        <li v-for="(item, key) in list" :key="key" :class="{ active: path.indexOf(item.link) != -1 }">
            <router-link :to="item.link">
                <i class="app-icon" :class="'graph-' + item.iconName"></i>
                <span>{{ item.title }}</span>
            </router-link>
        </li>
    </ul> 
</nav>
</template>

<script>
export default {
    name: 'app-head-nav',
    props: {
        list: {
            type: Array,
            default: []
        },
        path: {
            type: String,
            default: '/'
        }
    }
}
</script>

<style>
.head-nav ul li {
    float: left;
}
.head-nav ul li a {
    display: block;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
.head-nav ul li a:hover,
.head-nav ul li.active a {
    background-color: rgba(0, 0, 0, .2);
}
.head-nav ul li a i {
    height: 16px;
    width: 16px;
    margin-top: -3px;
}
.head-nav ul li a span {
    margin-left: 6px;
    font-size: 16px;
    color: #fff;
}

/* 头部导航分类图标 */
.head-nav ul li a i.graph-sys_setting {
    background-position: 0 0;
}
.head-nav ul li a i.graph-performance {
    background-position: -144px 0;
}
.head-nav ul li a i.graph-train {
    background-position: -16px 0;
}
.head-nav ul li a i.graph-assessment {
    background-position: -128px 0;
}
.head-nav ul li a i.graph-notice {
    background-position: -16px -32px;
}
.head-nav ul li a i.graph-scheduling {
    background-position: -112px 0;
}
.head-nav ul li a i.graph-editer {
    background-position: -320px 0;
}
.head-nav ul li a i.graph-work_time {
    background-position: -304px 0;
}
</style>