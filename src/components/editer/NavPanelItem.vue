<template>
    <div class="nav-panel-item" v-if=" value === name ">
        <div class="top">{{ title }}</div>
        <div class="box">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'nav-panel-item',
    props: ['value', 'title', 'name'],
    data(){
        return {}
    }
}
</script>

<style scoped>
.nav-panel-item {
    height: 100%;
}
.nav-panel-item > .top {
    height: 49px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    line-height: 49px;
    text-align: center;
    font-size: 14px;
}
.nav-panel-item > .box {
    height: calc(100% - 50px);
    overflow-y: auto;
}
</style>