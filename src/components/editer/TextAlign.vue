<template>
    <div class="mdm-setting-text-align">
        <li v-for="item in taList" :key="item"
            :class="`icon eqf-align-${item} ${item == value ? 'active' : ''}`"
            @click.stop="clickHandler(item)">
        </li>
    </div>
</template>

<script>
export default {
    name: 'text-align',
    props: ['value'],
    data(){
        return {
            taList: ['left', 'center', 'right']
        }
    },
    methods: {
        clickHandler(val){
            this.$emit('input', val)
        }
    }
}
</script>

<style scoped>
.mdm-setting-text-align {
    display: flex;
    position: relative;
    width: 100%;
    height: 30px;
    margin-top: 12px;
    border: 1px solid #ddd;
    background: #f7f8f9;
    cursor: pointer;
}
.mdm-setting-text-align .icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: #76838f;
    transition: all 0.3s;
}
.mdm-setting-text-align .icon:not(:last-child) {
    border-right: 1px solid #ccd5db;
}
.mdm-setting-text-align .icon:hover,
.mdm-setting-text-align .icon.active {
    color: #1593ff;
    background: #fff;
}
</style>