<template>
    <div class="mdm-nav-template" v-if=" value === name ">
        <div class="panel-top">{{ title }}</div>
        <slot></slot>
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
</style>