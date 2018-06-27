<template>
    <div v-if="toggle">
        <el-dialog
            :title="title"
            :visible.sync="isShow"
            :top="top"
            :custom-class="customClass"
            @close="$emit('update:visible', false)"
        >
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'app-dialog',
    props: {
        title: {
            type: String,
            default: '提示信息'
        },
        // 传进来的是 visible
        visible: {
            type: Boolean,
            default: false
        },
        top: {
            type: String,
            default: '15vh'
        },
        customClass: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            isShow: this.visible,
            toggle: this.visible
        }
    },
    watch: {  
        visible (val){
            this.isShow = this.visible
            if (val){
                this.toggle = val
            } else {
                setTimeout(() => this.toggle = val, 300)
            }
        }
    }
}
</script>

<style>
</style>