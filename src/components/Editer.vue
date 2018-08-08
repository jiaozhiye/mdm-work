<template>
    <section class="editer-main" ref="editer" @contextmenu.stop.prevent>
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
                    <div class="content">
                        <ul>
                            <li v-for="item in uploadList" :key="item.id" 
                                :style="{backgroundImage: `url(${item.img_url})`}">
                                <span class="icon hint--left hint--rounded" @click.stop="deleteTemplateHandler(item.id)">
                                    <i class="eqf-delete-l"></i>
                                </span>
                            </li>
                            <div class="mdm-list-status-infinite">
                                <span class="text">没有更多了</span>
                            </div>
                        </ul>
                    </div>
                    <div class="tc">
                        <el-upload
                            ref="upload"
                            :action="uploadUrl"
                            :limit="10"
                            :with-credentials="true"
                            :show-file-list="false"
                            :auto-upload="false"
                            :on-success="handleAvatarSuccess">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        </el-upload>
                    </div>
                </div>
            </nav-panel-item>
        </nav-panel>
        <div class="mdm-right">
            <editer-header></editer-header>
            <div class="content">
                <div class="workspace" id="workspace">
                    <div class="mdm-editor" :style="{width:`${poster.size[0]*poster.scale}px`,height:`${poster.size[1]*poster.scale}px`}">
                        <div class="mdm-background" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}"></div>
                        <div class="mdm-range mdm-mask"><div class="shadow"></div></div>
                        <div class="mdm-elements" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}">
                            <div v-for="(item, key) in elements" :key="key" :style="item.outer_style">
                                <textarea class="edit-text" 
                                    v-if="!item.url" 
                                    :index="item.zIndex" 
                                    :style="item.inner_style" 
                                    :value="item.content"
                                    @input.stop="modifyTextHandler(item.zIndex, $event.target.value)">
                                </textarea>
                                <img v-else :src="item.url" :style="item.inner_style">
                            </div>
                        </div>
                        <div class="mdm-element-boxs" id="element-boxs">
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
                                @dragging="handleDragging" 
                                @resizing="handleResizing" 
                                @rotating="handleRotating"
                                @deactivated="deactivatedFn"
                                @click.native.stop="elboxHandler(item.zIndex)"
                                @dblclick.native.stop="dblClickHandler(item.zIndex)">
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
                            <setting-color v-model="texts.color"></setting-color>
                            <div class="name">字体</div>
                            <div class="mdm-base-input">
                                <el-select v-model="texts.fontFamily" placeholder="默认字体" size="mini">
                                    <el-option
                                        v-for="item in fontFamilyList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        <span :style="{fontFamily: item.value}">{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="name">文字大小</div>
                            <input-drag 
                                v-model="texts.fontSize"
                                unit="px"
                                :min-val="12"
                                :max-val="200">
                            </input-drag>
                            <div class="name">行高</div>
                            <input-drag 
                                v-model="texts.lineHeight"
                                unit="%"
                                :min-val="100"
                                :max-val="200">
                            </input-drag>
                            <div class="name">透明度</div>
                            <input-drag 
                                v-model="texts.opacity"
                                unit="%"
                                :min-val="0"
                                :max-val="100">
                            </input-drag>
                            <div class="name">字间距</div>
                            <input-drag 
                                v-model="texts.letterSpacing"
                                unit="px"
                                :min-val="0"
                                :max-val="100">
                            </input-drag>
                            <text-align v-model="texts.textAlign"></text-align>
                        </div>
                    </setting-panel-item>
                    <setting-panel-item title="位置" name="position" state="off">
                        <div class="setting-box">
                            <div class="name">旋转角度</div>
                            <input-drag 
                                v-model="texts.rotateZ"
                                unit="度"
                                :min-val="0"
                                :max-val="359">
                            </input-drag>
                            <div class="name">左边距</div>
                            <input-drag 
                                v-model="texts.left"
                                unit="px"
                                :min-val="-1000"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">上边距</div>
                            <input-drag 
                                v-model="texts.top"
                                unit="px"
                                :min-val="-1000"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">宽度</div>
                            <input-drag 
                                v-model="texts.width"
                                unit="px"
                                :min-val="50"
                                :max-val="1000">
                            </input-drag>
                            <div class="name">高度</div>
                            <input-drag 
                                v-model="texts.height"
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
import { uploadUrl } from 'api'
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
import SettingColor from 'components/editer/SettingColor'
import InputDrag from 'components/editer/InputDrag'
import TextAlign from 'components/editer/TextAlign'

export default {
    name: 'app-editer',
    data (){
        return {
            isShowNavPanel: !1, // 默认显示模版对应的面板
            currentNav: '', // 当前选中(操作中)的导航
            uploadUrl,
            texts: {
                color: '',
                fontFamily: '',
                fontSize: 0,
                lineHeight: 0,
                opacity: 0,
                letterSpacing: 0,
                textAlign: '',
                fontWeight: '',
                rotateZ: 0,
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        }
    },
    computed: {
        ...mapState('editer', [
            'poster', 
            'templateList', 
            'fontFamilyList', 
            'outer_style_arr', 
            'inner_style_arr', 
            'box_style_arr',
            'uploadList'
        ]),
        ...mapGetters('editer', ['elementsList', 'currentIndex', 'isChangeHistorys']),
        elements(){
            return this.elementsList.map(item => this.createElementStyle(item))
        }
    },
    watch: {
        currentIndex (val){
            if (val == -1) return
            this.vuexToTexts()
        },
        elements: {
            handler(val){
                // 添加操作历史 - 函数防抖实现，防抖间隔 0.5s
                debounce(this.addHistoryHandle, 500)(val)
                // 设置离开页面提醒
                val.length ? this.setLeaveRemind(!0) : this.setLeaveRemind(!1)
                if (this.currentIndex == -1) return
                this.vuexToTexts()
            },
            deep: true
        },
        texts: {
            handler(val){
                if (this.currentIndex == -1) return
                this.textsToVuex(val)
            },
            deep: true
        }
    },
    methods: {
        ...mapActions('editer', [
            'createPosterImgs', 
            'resizePosterElement', 
            'dirSetPosterElement', 
            'addNewPosterText', 
            'createEditingIndex', 
            'changePosterText', 
            'createHistory',
            'requestTemplateList',
            'createUploadTemplate',
            'removeTemplateRecord',
            'requestPosterRecord'
        ]),
        ...mapActions('stateChange', ['setLeaveRemind']),
        initial(){ // 初始化方法
            this.requestPosterRecord(this.$route.query.id)
            this.requestTemplateList()
        },
        vuexToTexts(){
            let element = this.findElementByIndex(this.currentIndex)
            // 图片暂时不可编辑
            if (element && element.content){
                for (let attr in this.texts){
                    if (attr == 'lineHeight' || attr == 'opacity'){ // 需要乘以 100
                        this.texts[attr] = Number.parseFloat((element[attr] * 100).toFixed(2))
                    } else {
                        this.texts[attr] = typeof element[attr] === 'number' ? 
                            Math.floor(element[attr]) : element[attr]
                    }
                }
            }
        },
        textsToVuex(val){
            let element  = this.findElementByIndex(this.currentIndex)
            // 图片暂时不可编辑
            if (element && element.content){
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
        addHistoryHandle(els){
            if (this.isChangeHistorys){ // 当 isChangeHistorys 为真，才可改变 historys
                this.createHistory(_.cloneDeep(this.elementsList))
            }
        },
        deactivatedFn(target){ // 单机空白区域，关闭编辑面板
            if (target.id == 'workspace' || target.id == 'element-boxs'){
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
        changeTemplateHandler(path){ // 更换模版图片
            this.createPosterImgs({ path })
        },
        toggleNavPanelHandler(res){ // 切换导航面板显示状态
            this.isShowNavPanel = res
        },
        modifyTextHandler(index, val){ // 编辑文本操作
            this.changePosterText({ index, text: val })
        },
        handleAvatarSuccess(res, file){ // res -> response
            console.log(res);
            (res.code == 1) && this.createUploadTemplate({ id: res.data.id, img_url: res.data.img_url })
        },
        submitUpload(){ // 模版图片上传
            this.$refs.upload.submit()
        },
        deleteTemplateHandler(_id){
            this.removeTemplateRecord(_id)
        },
        createElementStyle(obj){ // 生成元素的style对象
            let item = {...obj}
            // 外层div的css样式
            let outer_style = {}
            // 内层元素(img/div)的样式
            let inner_style = {}
            // 操作元素的盒子(div)的样式
            let box_style = {}
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
            this.box_style_arr.forEach(attr => {
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
        SettingColor,
        InputDrag,
        TextAlign
    }
}
</script>

<style>
</style>