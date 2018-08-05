<template>
<div class="workspace preview-workspace">
    <div class="mdm-editor" :style="{width:`${poster.size[0]*poster.scale}px`,height:`${poster.size[1]*poster.scale}px`}">
        <div class="mdm-background" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}"></div>
        <div class="mdm-range mdm-mask"><div class="shadow"></div></div>
        <div class="mdm-elements" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}">
            <div v-for="(item, key) in elements" :key="key" :style="item.outer_style">
                <textarea class="edit-text" 
                    v-if="!item.url" 
                    :index="item.zIndex" 
                    :style="item.inner_style" 
                    :value="item.content">
                </textarea>
                <img v-else :src="item.url" :style="item.inner_style">
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'poster-preview',
    props: [],
    data(){
        return {}
    },
    computed: {
        ...mapState('editer', ['poster', 'outer_style_arr', 'inner_style_arr']),
        ...mapGetters('editer', ['elementsList']),
        elements(){
            return this.elementsList.map(item => this.createElementStyle(item))
        }
    },
    methods: {
        createElementStyle(obj){ // 生成元素的style对象
            const item = {...obj}
            // 外层div的css样式
            let outer_style = {}
            // 内层元素(img/div)的样式
            let inner_style = {}
            this.outer_style_arr.forEach(attr => {
                switch (attr){
                    case 'rotateZ':
                        outer_style['transform'] = `rotateZ(${item[attr]}deg)`
                        break;
                    case 'zIndex':
                        outer_style[attr] = item[attr]
                        break;
                    default:
                        outer_style[attr] = `${typeof item[attr] == 'number' ? (item[attr] + 'px') : item[attr]}`
                        break;
                }
            })
            this.inner_style_arr.forEach(attr => {
                if (attr == 'lineHeight' || attr == 'opacity'){
                    item[attr] && (inner_style[attr] = item[attr])
                } else {
                    item[attr] && (inner_style[attr] = `${typeof item[attr] == 'number' ? (item[attr] + 'px') : item[attr]}`)
                }
            })
            item.outer_style = outer_style
            item.inner_style = inner_style
            return item
        }
    }
}
</script>

<style scoped>
.preview-workspace {
    background: none !important;
}
.preview-workspace .mdm-editor {
    overflow: hidden !important;
}
</style>