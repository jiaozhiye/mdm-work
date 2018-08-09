<template>
    <div class="mdm-base-input">
        <el-select v-model="fontFamily" placeholder="默认字体" size="mini">
            <el-option
                v-for="item in fontFamilyList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span :style="{fontFamily: item.value}">{{ item.label }}</span>
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'font-select',
    props: ['value'],
    computed: {
        ...mapState('editer', ['fontFamilyList'])
    },
    data(){
        return {
            fontFamily: this.value
        }
    },
    watch: {
        fontFamily(val){
            this.appendStyleHandle(val)
            this.$emit('input', val)
        }
    },
    methods: {
        appendStyleHandle(fontName){
            const styleEl = document.createElement('style')
            styleEl.id = fontName
            styleEl.innerHTML = `@font-face{font-family:"${fontName}";src:url(static/fonts/${fontName}.woff) format("woff")}`
            document.querySelector('head').appendChild(styleEl)
        }
    }
}
</script>

<style scoped>
</style>