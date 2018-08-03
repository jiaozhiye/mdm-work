<template>
    <section class="editer-main" ref="editer">
        <nav-list v-model="currentNav" :panel-state="isShowNavPanel" @change="toggleNavPanelHandler"></nav-list>
        <nav-panel :panel-state="isShowNavPanel">
            <nav-panel-item v-model="currentNav" name="template" title="模版库">
                <div class="mdm-nav-template">
                    <ul>
                        <li v-for="item in templateList" :key="item.id"
                            :style="{ backgroundImage: `url(${item.img_url})` }"
                            @click="changeTemplateHandler(item.img_url)">
                        </li>
                    </ul>
                </div>
            </nav-panel-item>
            <nav-panel-item v-model="currentNav" name="text" title="文字">
                <div class="mdm-nav-text">
                    <div class="title" @click="addNewPosterText('title')">点击添加标题</div>
                    <div class="content" @click="addNewPosterText('content')">点击添加正文</div>
                </div>
            </nav-panel-item>
            <nav-panel-item v-model="currentNav" name="upload" title="上传图片">
                <div class="mdm-nav-upload">
                    
                </div>
            </nav-panel-item>
        </nav-panel>
        <div class="mdm-right">
            <editer-header></editer-header>
            <div class="content">
                <div class="workspace" id="workspace">
                    <div class="mdm-editor" :style="{width:`${poster.size[0]*poster.scale}px`,height:`${poster.size[1]*poster.scale}px`}">
                        <div class="mdm-range mdm-mask"><div class="shadow"></div></div>
                        <div class="mdm-elements" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}">
                            <div v-for="(item, key) in elements" :key="key" :style="item.outer_style">
                                <div class="edit-text" v-if="!item.url" :index="item.zIndex" :style="item.inner_style" :contenteditable="item.isEdit">{{ item.content }}</div>
                                <img v-else :src="item.url" :style="item.inner_style">
                            </div>
                        </div>
                        <div class="mdm-element-boxs">
                            <vue-drr 
                                v-for="(item, key) in elements" :key="key"
                                :x="item.box_style.left" 
                                :y="item.box_style.top" 
                                :w="item.box_style.width" 
                                :h="item.box_style.height" 
                                :angle="item.box_style.rotateZ" 
                                :z="item.box_style.zIndex" 
                                @dragging="handleDragging" 
                                @resizing="handleResizing" 
                                @rotating="handleRotating">
                            </vue-drr>
                        </div>
                    </div>
                    <scale-bar></scale-bar>
                </div>
                <editer-sidebar></editer-sidebar>
                <editer-panel v-if=" true ">
                    <editer-panel-item title="文字" name="text" state="on">
                        <div>asdsad</div>
                    </editer-panel-item>
                    <editer-panel-item title="位置" name="position" state="off">
                        <div>qweqwe</div>
                    </editer-panel-item>
                </editer-panel>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import 'assets/css/iconfonts.css'
import 'assets/css/editer.css'

import NavList from 'components/editer/NavList'
import NavPanel from 'components/editer/NavPanel'
import NavPanelItem from 'components/editer/NavPanelItem'
import EditerHeader from 'components/editer/EditerHeader'
import EditerPanel from 'components/editer/EditerPanel'
import EditerPanelItem from 'components/editer/EditerPanelItem'
import ScaleBar from 'components/editer/ScaleBar'
import EditerSidebar from 'components/editer/EditerSidebar'
import VueDrr from 'components/editer/vue-drr'

export default {
    name: 'app-editer',
    data (){
        return {
            isShowNavPanel: !1, // 默认显示模版对应的面板
            currentNav: '', // 当前选中(操作中)的导航
        }
    },
    computed: {
        ...mapState('editer', ['poster', 'templateList']),
        ...mapGetters('editer', ['scalePercent', 'elementsList', 'currentIndex']),
        elements(){
            return this.elementsList.map(item => this.createElementStyle(item))
        }
    },
    methods: {
        ...mapActions('editer', ['createPosterImgs', 'resizePosterElement', 'addNewPosterText', 'toggleEditState']),
        initial(){ // 初始化方法
            
        },
        changeTemplateHandler(path){ // 更换模版图片
            this.createPosterImgs({ path })
        },
        toggleNavPanelHandler(res){ // 切换导航面板显示状态
            this.isShowNavPanel = res
        },
        createElementStyle(obj){ // 生成元素的style对象
            const item = {...obj}
            // 外层div的css样式
            const outer_style_arr = ['position', 'left', 'top', 'rotateZ', 'zIndex']
            let outer_style = {}
            // 内层元素(img/div)的样式
            const inner_style_arr = ['width', 'height', 'color', 'fontFamily', 'fontSize', 'lineHeight', 'opacity', 'textAlign', 'fontWeight']
            let inner_style = {}
            // 操作元素的盒子(div)的样式
            const box_style_arr = ['left', 'top', 'width', 'height', 'rotateZ', 'zIndex']
            let box_style = {}
            outer_style_arr.forEach(attr => {
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
            inner_style_arr.forEach(attr => {
                switch (attr){
                    case 'lineHeight':
                        item[attr] && (inner_style[attr] = item[attr])
                        break;
                    default:
                        item[attr] && (inner_style[attr] = `${typeof item[attr] == 'number' ? (item[attr] + 'px') : item[attr]}`)
                        break;
                }
            })
            box_style_arr.forEach(attr => {
                if (attr == 'rotateZ' || attr == 'zIndex'){
                    box_style[attr] = item[attr]
                } else {
                    box_style[attr] = item[attr] * this.poster.scale
                }
            })
            item.outer_style = outer_style
            item.inner_style = inner_style
            item.box_style   = box_style
            // console.log(item)
            return item
        },
        handleResizing(index, x, y, w, h){
            this.resizePosterElement({ index, left: x, top: y, width: w, height: h })
        },
        handleDragging(index, x, y){
            this.resizePosterElement({ index, left: x, top: y })
        },
        handleRotating(index, angle){
            this.resizePosterElement({ index, rotateZ: angle })
        },
        eventHandler(){
            // 禁用右键
            this.$refs.editer.addEventListener('contextmenu', ev => ev.preventDefault(), false)
            // 取消文字编辑
            document.getElementById('workspace').addEventListener('click', this.unlockHandler, true)
        },
        unlockHandler(ev){
            ev.stopPropagation()
            let target = this.findParent(ev.target, 'edit-text')
            if (this.currentIndex != -1 && (target && this.currentIndex != target.getAttribute('index') || !target)){
                this.toggleEditState({ index: this.currentIndex, status: !1 })
                document.querySelector('.mdm-element-boxs').style.pointerEvents = 'auto'
            }
            return false
        },
        findParent(obj, claname){
            while (obj && obj != document){
                if (obj.className == claname){
                    return obj
                } else {
                    obj = obj.parentNode
                }
            }
            return null
        }
    },
    created(){
        this.initial()
    },
    mounted(){
        this.eventHandler()
    },
    components: {
        NavList,
        NavPanel,
        NavPanelItem,
        EditerHeader,
        EditerPanel,
        EditerPanelItem,
        ScaleBar,
        EditerSidebar,
        VueDrr
    }
}
</script>

<style>
</style>