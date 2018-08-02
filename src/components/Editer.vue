<template>
    <section class="editer-main" ref="editer">
        <div class="mdm-nav">
            <ul class="list">
                <li class="logo" :class="{ left: isShowNavPanel }" @click=" isShowNavPanel = !isShowNavPanel ">
                    <i class="icon eqf-arrow-right"></i>
                </li>
                <li class="item" :class="{ active: item.active }" v-for="item in navList" :key="item.id"
                    @click="tabPandelHandler(item)">
                    <i class="icon" :class="item.icon"></i> <span>{{ item.name }}</span>
                </li>            
                <li class="slide"></li>
            </ul>
        </div>
        <div class="mdm-nav-panel" :class="{ show: isShowNavPanel }">
            <div class="panel">
                <nav-panel-item v-model="currentNav" name="template" title="模版库">
                    <div class="list">
                        <ul>
                            <li v-for="item in templateList" :key="item.id"
                                :tracker_data="item.img_url"
                                :style="{ backgroundImage: `url(${item.img_url})` }">
                            </li>
                        </ul>
                    </div>
                </nav-panel-item>
                <nav-panel-item v-model="currentNav" name="text" title="文字">
                    <div class="mdm-nav-text">
                        <div class="title">点击添加标题</div>
                        <div class="content">点击添加正文</div>
                    </div>
                </nav-panel-item>
                <nav-panel-item v-model="currentNav" name="upload" title="上传图片">
                    <div class="mdm-nav-upload">
                        
                    </div>
                </nav-panel-item>
            </div>
        </div>
        <div class="mdm-right">
            <div class="mdm-header">
                <div class="info">
                    <span class="size">{{ poster.size[0] }}</span>
                    <i class="icon eqf-link"></i>
                    <span class="size">{{ poster.size[1] }}</span>
                    <i class="icon eqf-layout-l" style="margin-left: 20px;"></i>
                    <span>{{ poster.type }}</span>
                </div>
                <ul class="list">
                    <li class="item" @click="dialogVisible = true">
                        <i class="icon eqf-setting-l"></i> <span>设置</span>
                    </li>
                    <li class="item" @click="saveHandler">
                        <i class="icon eqf-save-l"></i> <span>保存</span>
                    </li>
                    <el-button size="small" type="primary" style="margin: 0 20px;">导出</el-button>
                </ul>
            </div>
            <div class="content">
                <div class="workspace" id="workspace">
                    <div class="mdm-editor" :style="{width:`${poster.size[0]*poster.scale}px`,height:`${poster.size[1]*poster.scale}px`}">
                        <div class="mdm-range mdm-mask"><div class="shadow"></div></div>
                        <div class="mdm-elements" :style="{width:`${poster.size[0]}px`,height:`${poster.size[1]}px`,transform:`scale(${poster.scale})`}">
                            <div v-for="(item, key) in elements" :key="key" :style="item.outer_style">
                                <img v-if="!!item.url" :src="item.url" :style="item.inner_style">
                                <div v-else :style="item.inner_style">{{ item.content }}</div>
                            </div>
                        </div>
                        <div class="mdm-element-boxs"></div>
                    </div>
                    <app-scale-bar></app-scale-bar>
                </div>
                <ul class="sidebar">
                    <el-tooltip class="item" effect="dark" content="撤销(Ctrl+Z)" placement="left">
                        <li class="item hint--left hint--rounded">
                            <i class="icon eqf-back"></i>
                        </li>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="恢复(Ctrl+Y)" placement="left">
                        <li class="item hint--left hint--rounded">
                            <i class="icon eqf-rework"></i>
                        </li>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="预览" placement="left">
                        <li class="item hint--left hint--rounded">
                            <i class="icon eqf-ppt-l"></i>
                        </li>
                    </el-tooltip>
                </ul>
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
        <app-dialog title="作品设置" :visible.sync="dialogVisible">
            <app-set-poster @reloadEvent="reloadData"></app-set-poster>
        </app-dialog>
    </section>
</template>

<script>
import 'assets/css/iconfonts.css'
import 'assets/css/editer.css'

import { mapState, mapActions, mapGetters } from 'vuex'

import NavPanelItem from 'components/NavPanelItem'
import EditerPanel from 'components/EditerPanel'
import EditerPanelItem from 'components/EditerPanelItem'
import AppDialog from 'components/AppDialog'
import AppSetPoster from 'components/SetPoster'
import AppScaleBar from 'components/ScaleBar'

export default {
    name: 'app-editer',
    data (){
        return {
            isShowNavPanel: !1, // 默认显示模版对应的面板
            currentNav: '', // 当前选中(操作中)的导航
            dialogVisible: !1
        }
    },
    computed: {
        ...mapState('editer', ['poster', 'navList', 'templateList']),
        ...mapGetters('editer', ['scalePercent', 'elementsList']),
        elements(){
            return this.elementsList.map(item => this.createElementStyleText(item))
        }
    },
    methods: {
        initial(){ // 初始化方法
            this.currentNav = this.navList.find(item => item.active).value
        },
        tabPandelHandler(item){ // 面板选项卡切换
            // 显示面板
            this.isShowNavPanel = !0
            // 切换选中样式
            this.navList.forEach(item => item.active = !1)
            item.active = !0
            // 切换内容
            this.currentNav = item.value
        },
        createElementStyleText(obj){ // 生成元素的style对象
            let item = _.cloneDeep(obj)
            // 外层div的css样式
            let outer_style_arr = ['position', 'left', 'top', 'rotateZ', 'zIndex']
            let outer_style = {}
            let inner_style_arr = ['width', 'height', 'url', 'content', 'color', 'backgroundColor', 'fontSize', 'lineHeight', 'padding', 'textAlign', 'fontWeight']
            let inner_style = {}
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
                    case 'url':
                        break;
                    case 'lineHeight':
                        inner_style[attr] = item[attr]
                        break;
                    default:
                        if (item[attr]){
                            inner_style[attr] = `${typeof item[attr] == 'number' ? (item[attr] + 'px') : item[attr]}`
                        }
                        break;
                }
            })
            item.outer_style = outer_style
            item.inner_style = inner_style
            return item
        },
        saveHandler(){ // 保存

        },
        disableRightClick(){ // 禁用右键
            this.$refs.editer.addEventListener('contextmenu', ev => ev.preventDefault(), false)
        },
        reloadData(res){ // 关闭dialog面板，重新加载数据
            if (res == 'reload'){
                this.dialogVisible = !1
            }
        }
    },
    created(){
        this.initial()
    },
    mounted(){
        this.disableRightClick()
    },
    components: {
        NavPanelItem,
        EditerPanel,
        EditerPanelItem,
        AppDialog,
        AppSetPoster,
        AppScaleBar
    }
}
</script>

<style>

</style>