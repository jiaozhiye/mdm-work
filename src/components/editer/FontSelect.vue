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
import { appendStyleNode } from 'assets/js/util'

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
            appendStyleNode(val)
            this.$emit('input', val)
        }
    }
}
</script>

<style scoped>
</style>