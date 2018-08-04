<template>
    <div class="mdm-base-input">
        <input type="text" v-drag 
            :value="value" 
            @change="changeHandler">
        <div class="unit">{{ unit }}</div>
    </div>
</template>

<script>
import DragElement from 'assets/js/drag'
import { prefixCss } from 'assets/js/util'

export default {
    name: 'input-drag',
    props: ['value', 'unit', 'minVal', 'maxVal'],
    data(){
        return {
            num: this.value
        }
    },
    directives: {
        drag: {
            inserted (el, binding, vnode){
                // vnode.context -> 指向当前组件实例 == this
                const element = new DragElement({
                    el: el,
                    axis: 'x',
                    dragstart(){
                        vnode.context.num = vnode.context.value
                    },
                    dragging(l, t, mouseX, mouseY){
                        let val = mouseX / 2 + vnode.context.num
                        if (val < vnode.context.minVal){
                            val = vnode.context.minVal
                        }
                        if (val > vnode.context.maxVal){
                            val = vnode.context.maxVal
                        }
                        vnode.context.$emit('input', Math.round(val))
                    }
                })
                element.install()
            }
        }
    },
    methods: {
        changeHandler(){
            this.$emit('input', Math.round(event.target.value))
        }
    }
}
</script>

<style scoped>
.mdm-base-input {
    position: relative;
    font-size: 12px;
}
.mdm-base-input > input {
    width: 100%;
    height: 30px;
    padding: 0 28px 0 12px;
    line-height: 28px;
    color: #2f3c4d;
    border: 1px solid #ddd;
    cursor: col-resize;
    user-select: none;
}
.mdm-base-input > .unit {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    color: #ccd5db;
    pointer-events: none;
}
</style>