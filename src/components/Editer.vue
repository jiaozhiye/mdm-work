<template>
    <section class="editer-main" ref="editer" 
        @click.stop=" colorOption.isColoPicker = !1 "
        @contextmenu.stop.prevent>
        <nav-list v-model="currentNav" :panel-state="isShowNavPanel" @change="toggleNavPanelHandler"></nav-list>
        <nav-panel :panel-state="isShowNavPanel">
            <nav-panel-item v-model="currentNav" name="template" title="模版库">
                <div class="mdm-nav-template">
                    <ul>
                        <li v-for="item in templateList" :key="item.id"
                            :style="{ backgroundImage: `url(${item.img_url})` }"
                            @click.stop="changeTemplateHandler(item.img_url)">
                        </li>
                    </ul>
                </div>
            </nav-panel-item>
            <nav-panel-item v-model="currentNav" name="text" title="文字">
                <div class="mdm-nav-text">
                    <div class="title" @click.stop="addNewPosterText('title')">点击添加标题</div>
                    <div class="content" @click.stop="addNewPosterText('content')">点击添加正文</div>
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
                                <textarea class="edit-text" 
                                    v-if="!item.url" 
                                    :index="item.zIndex" 
                                    :style="item.inner_style" 
                                    :value="item.content"
                                    @change="changeTextHandler(item.zIndex, $event.target.value)">
                                </textarea>
                                <img v-else :src="item.url" :style="item.inner_style">
                            </div>
                        </div> 
                        <div class="mdm-element-boxs">
                            <vue-drr 
                                v-for="(item, key) in elements" :key="key"
                                :active="currentIndex === item.zIndex"
                                :x="item.box_style.left" 
                                :y="item.box_style.top" 
                                :w="item.box_style.width" 
                                :h="item.box_style.height" 
                                :angle="item.box_style.rotateZ" 
                                :z="item.box_style.zIndex" 
                                :index="item.zIndex"
                                @click.native.stop="elboxHandler(item.zIndex)"
                                @dblclick.native.stop="dblClickHandler(item.zIndex)"
                                @dragging="handleDragging" 
                                @resizing="handleResizing" 
                                @rotating="handleRotating"
                                @deactivated="deactivatedFn">
                            </vue-drr>
                        </div>
                    </div>
                    <scale-bar></scale-bar>
                    <drag-panel></drag-panel>
                </div>
                <editer-sidebar></editer-sidebar>
                <setting-panel v-if=" currentIndex != -1 ">
                    <setting-panel-item title="文字" name="text" state="on">
                        <div class="setting-box">
                            <div class="name">文字颜色</div>
                            <div class="mdm-setting-color">
                                <div class="color" @click.stop="coloPickerHandler" 
                                    :style="{ backgroundColor: params.color }">
                                </div>
                                <transition name="el-fade-in">
                                    <div class="color-picker" 
                                        v-if="colorOption.isColoPicker" 
                                        :style="{ top: `${colorOption.pos.t}px`, right: `${colorOption.pos.r}px` }"
                                        @click.stop>
                                        <sketch :value="colorOption.colors" @input=" val => params.color = val.hex "></sketch>
                                    </div>
                                </transition>
                            </div>
                            <div class="name">字体</div>
                            <div class="mdm-base-input">
                                <el-select v-model="params.fontFamily" placeholder="默认字体" size="mini">
                                    <el-option
                                        v-for="item in fontFamilyList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="name">文字大小</div>
                            <input-drag 
                                v-model="params.fontSize"
                                unit="px"
                                :min-val="12"
                                :max-val="200">
                            </input-drag>
                            <div class="name">行高</div>
                            <input-drag 
                                v-model="params.lineHeight"
                                unit="%"
                                :min-val="100"
                                :max-val="200">
                            </input-drag>
                            <div class="name">透明度</div>
                            <input-drag 
                                v-model="params.opacity"
                                unit="%"
                                :min-val="0"
                                :max-val="100">
                            </input-drag>
                            <!-- <ul class="mdm-setting-text-align">
                                <li class="icon fl eqf-align-left"></li>
                                <li class="icon fl eqf-align-center active"></li>
                                <li class="icon fl eqf-align-right"></li>
                            </ul> -->
                        </div>
                    </setting-panel-item>
                    <setting-panel-item title="位置" name="position" state="off">
                        <div class="setting-box">
                            <div class="name">旋转角度</div>
                            <input-drag 
                                v-model="params.rotateZ"
                                unit="度"
                                :min-val="0"
                                :max-val="359">
                            </input-drag>
                            <div class="name">左边距</div>
                            <input-drag 
                                v-model="params.left"
                                unit="px"
                                :min-val="-1000"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">上边距</div>
                            <input-drag 
                                v-model="params.top"
                                unit="px"
                                :min-val="-1000"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">宽度</div>
                            <input-drag 
                                v-model="params.width"
                                unit="px"
                                :min-val="50"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">高度</div>
                            <input-drag 
                                v-model="params.height"
                                unit="px"
                                :min-val="36"
                                :max-val="1000">
                            </input-drag>
                        </div>
                    </setting-panel-item>
                </setting-panel>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { debounce } from 'assets/js/util'

import 'assets/css/iconfonts.css'
import 'assets/css/editer.css'

import NavList from 'components/editer/NavList'
import NavPanel from 'components/editer/NavPanel'
import NavPanelItem from 'components/editer/NavPanelItem'
import EditerHeader from 'components/editer/EditerHeader'
import SettingPanel from 'components/editer/SettingPanel'
import SettingPanelItem from 'components/editer/SettingPanelItem'
import ScaleBar from 'components/editer/ScaleBar'
import EditerSidebar from 'components/editer/EditerSidebar'
import VueDrr from 'components/editer/VueDrr'
import DragPanel from 'components/editer/DragPanel'
import { Sketch } from 'vue-color'
import InputDrag from 'components/editer/InputDrag'

export default {
    name: 'app-editer',
    data (){
        return {
            isShowNavPanel: !1, // 默认显示模版对应的面板
            currentNav: '', // 当前选中(操作中)的导航
            params: {
                color: '#000',
                fontFamily: '微软雅黑',
                fontSize: 68,
                lineHeight: 120,
                opacity: 100,
                textAlign: 'center',
                fontWeight: 'bold',
                rotateZ: 0,
                left: 50,
                top: 200,
                width: 540,
                height: 81
            },
            colorOption: {
                isColoPicker: !1,
                pos: { r: 200, t: 200 },
                colors: {
                    hex: '#4A90E2',
                    rgba: { r: 74, g: 144, b: 226, a: 1 }
                }
            }
        }
    },
    computed: {
        ...mapState('editer', ['poster', 'templateList', 'fontFamilyList']),
        ...mapGetters('editer', ['scalePercent', 'elementsList', 'currentIndex']),
        elements(){
            return this.elementsList.map(item => this.createElementStyle(item))
        }
    },
    watch: {
        currentIndex (val){
            if (val == -1) return
            this.vuexToParmas()
        },
        elements: {
            handler(val){
               if (this.currentIndex == -1) return
               this.vuexToParmas()
            },
            deep: true
        },
        params: {
            handler(val){
                if (this.currentIndex == -1) return
                this.paramsToVuex(val)
            },
            deep: true
        }
    },
    methods: {
        ...mapActions('editer', ['createPosterImgs', 'resizePosterElement', 'dirSetPosterElement', 'addNewPosterText', 'createEditingIndex', 'changePosterText']),
        initial(){ // 初始化方法
            
        },
        vuexToParmas(){
            let element = this.findElementByIndex(this.currentIndex)
            // 图片暂时不可编辑
            if (element && !element.url){
                for (let attr in this.params){
                    if (attr == 'lineHeight' || attr == 'opacity'){ // 需要乘以 100
                        this.params[attr] = Number.parseFloat((element[attr] * 100).toFixed(2))
                    } else {
                        this.params[attr] = typeof element[attr] === 'number' ? 
                            Math.floor(element[attr]) : element[attr]
                    }
                }
            }
        },
        paramsToVuex(val){
            let element  = this.findElementByIndex(this.currentIndex)
            // 图片暂时不可编辑
            if (!element.url){
                let __data__ = {}
                for(let attr in val){
                    if (attr == 'lineHeight' || attr == 'opacity'){ // 需要除以 100
                        __data__[attr] = val[attr] / 100
                    } else {
                        __data__[attr] = val[attr]
                    }
                }
                this.dirSetPosterElement({ index: this.currentIndex, ...__data__ })
            }
        },
        deactivatedFn(target){ // 单机空白区域，关闭编辑面板
            if (target.id == 'workspace'){
                this.createEditingIndex(-1)
            }
        },
        elboxHandler(index){ // 单机元素可编辑
            // 图片暂时不可编辑
            let element = this.findElementByIndex(index)
            if (!element.url){
                // 让文本域失去焦点
                Array.from(document.querySelectorAll('.edit-text')).forEach(el => el.blur())
            }
            this.createEditingIndex(index)
        },
        dblClickHandler(index){ // 双击文本可编辑
            // 图片暂时不可编辑
            let element = this.findElementByIndex(index)
            if (!element.url){
                // 让文本域获得焦点
                document.querySelector(`.edit-text[index="${index}"]`).focus()
            }
            this.createEditingIndex(index)
        },
        coloPickerHandler(){ // 处理文字颜色功能
            this.colorOption.pos.t = event.target.getBoundingClientRect().top
            this.colorOption.isColoPicker = !this.colorOption.isColoPicker
        },
        changeTemplateHandler(path){ // 更换模版图片
            this.createPosterImgs({ path })
        },
        toggleNavPanelHandler(res){ // 切换导航面板显示状态
            this.isShowNavPanel = res
        },
        changeTextHandler(index, val){ // 编辑文本操作
            this.changePosterText({ index, text: val })
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
                if (attr == 'lineHeight' || attr == 'opacity'){
                    item[attr] && (inner_style[attr] = item[attr])
                } else {
                    item[attr] && (inner_style[attr] = `${typeof item[attr] == 'number' ? (item[attr] + 'px') : item[attr]}`)
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
        findElementByIndex(index){
            return this.elementsList.find(item => item.zIndex == index)
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
    components: {
        NavList,
        NavPanel,
        NavPanelItem,
        EditerHeader,
        SettingPanel,
        SettingPanelItem,
        ScaleBar,
        EditerSidebar,
        VueDrr,
        DragPanel,
        Sketch,
        InputDrag
    }
}
</script>

<style>
</style>