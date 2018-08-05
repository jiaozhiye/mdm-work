<template>
    <div class="mdm-setting-color">
        <div class="color" @click.stop="coloPickerHandler" 
            :style="{ backgroundColor: value }">
        </div>
        <transition name="el-fade-in">
            <div class="color-picker" 
                v-if="colorOption.isColoPicker" 
                :style="{ top: `${colorOption.pos.t}px`, right: `${colorOption.pos.r}px` }"
                @click.stop>
                <sketch :value="colorOption.colors" @input="inputHandler"></sketch>
            </div>
        </transition>
    </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
    name: 'setting-color',
    props: ['value'],
    data(){
        return {
            colorOption: {
                isColoPicker: !1,
                pos: { r: 200, t: 200 },
                colors: { hex: '#4A90E2' }
            }
        }
    },
    methods: {
        coloPickerHandler(){ // 处理文字颜色功能
            this.colorOption.pos.t = event.target.getBoundingClientRect().top
            this.colorOption.isColoPicker = !this.colorOption.isColoPicker
        },
        inputHandler(val){
            this.colorOption.colors.hex = val.hex
            this.$emit('input', val.hex)
        }
    },
    mounted(){
        document.querySelector('.editer-main').addEventListener('click', ev => {
            ev.stopPropagation()
            this.colorOption.isColoPicker = !1
        }, false)
    },
    components: {
        Sketch
    }
}
</script>

<style scoped>
.mdm-setting-color {
    position: relative;
    width: 100%;
    height: 30px;
    border: 1px solid #ccd5db;
    cursor: pointer;
}
.mdm-setting-color .color {
    height: 100%;
}
.mdm-setting-color .color-picker {
    position: fixed;
    right: 200px;
    top: 200px;
}
</style>