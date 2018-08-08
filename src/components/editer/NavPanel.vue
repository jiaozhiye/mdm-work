<template>
    <div class="mdm-nav-panel" :class="{ show: panelState }">
        <div class="panel">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'nav-panel',
    props: [ 'panelState' ],
    data(){
        return {}
    }
}
</script>

<style scoped>
.mdm-nav-panel {
    position: relative;
    flex: none;
    width: 0;
    height: 100%;
    background: #f7f8f9;
    opacity: 0;
    transition: all .3s;
    z-index: 2;
    overflow: hidden;
}
.mdm-nav-panel.show {
    width: 270px;
    box-shadow: 0 0 16px 0 rgba(0,0,0,.16);
    opacity: 1;
}
.mdm-nav-panel .panel {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>