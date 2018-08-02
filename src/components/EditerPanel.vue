<template>
    <transition name="setting-side">
        <div class="setting">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'editer-panel',
    
}
</script>

<style scoped>
.setting {
    width: 190px;
    height: 100%;
    background: #fff;
    overflow: hidden;
}

/**
 * 抽出面板组件切换动画
 */
.setting-side-enter,
.setting-side-leave-to {
    opacity: 0;
    margin-right: -190px;
}
.setting-side-enter-to,
.setting-side-leave {
    opacity: 1;
    margin-right: 0px;
}
.setting-side-enter-active,
.setting-side-leave-active {
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
</style>
