<template>
    <section>
        <div class="mdm-header">
            <div class="info">
                <span class="size">{{ poster.size[0] }}</span>
                <i class="icon eqf-link"></i>
                <span class="size">{{ poster.size[1] }}</span>
                <i class="icon eqf-layout-l" style="margin-left: 20px;"></i>
                <span>{{ poster.type }}</span>
            </div>
            <ul class="list">
                <li class="item" @click.stop="dialogVisible = true">
                    <i class="icon eqf-setting-l"></i> <span>设置</span>
                </li>
                <li class="item" @click.stop="saveHandler('save')">
                    <i class="icon eqf-save-l"></i> <span>保存</span>
                </li>
                <li class="item" @click.stop="sharHandler">
                    <i class="icon eqf-share-l"></i> <span>分享</span>
                </li>
                <el-button size="small" type="primary" style="margin: 0 20px;"
                    @click.stop="saveHandler('export')">导出</el-button>
            </ul>
        </div>
        <app-dialog title="作品设置" :visible.sync="dialogVisible">
            <set-poster @reloadEvent="reloadData"></set-poster>
        </app-dialog>
    </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { savePoster, uploadPoster } from 'api'
import { convertBase64UrlToBlob } from 'assets/js/util'
import Cookies from 'js-cookie'
import html2canvas from 'html2canvas'
import Canvas2Image from 'assets/js/canvas2image'

import AppDialog from 'components/AppDialog'
import SetPoster from 'components/editer/SetPoster'

export default {
    name: 'editer-header',
    props: [],
    data(){
        return {
            dialogVisible: !1
        }
    },
    computed: {
        ...mapState('editer', ['poster'])
    },
    methods: {
        ...mapActions('stateChange', ['setLeaveRemind']),
        sharHandler(){
            this.$message.success('分享成功')
        },
        exportHandler(_id){
            const shareContent = document.querySelector('.mdm-elements').cloneNode(true)
            // 添加 dom
            shareContent.style.transform = ''
            shareContent.style.position  = 'fixed'
            shareContent.style.zIndex    = -9
            document.body.appendChild(shareContent)
            // setting
            const width  = shareContent.clientWidth // 获取dom 宽度
            const height = shareContent.clientHeight // 获取dom 高度
            const canvas = document.createElement('canvas') // 创建一个canvas节点
            const scale  = 2              // 定义任意放大倍数 支持小数
            canvas.width = width * scale  // 定义canvas 宽度 * 缩放
            canvas.height= height * scale // 定义canvas高度 *缩放
            canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
            // 配置项
            const opts = {
                scale: scale,   // 添加的 scale 参数
                canvas: canvas, // 自定义 canvas
                width: width,   // dom 原始宽度
                height: height, // dom 原始高度
                useCORS: true
            }
            html2canvas(shareContent, opts).then(canvas => {
                // 移除 dom
                document.body.removeChild(shareContent)
                // 关闭抗锯齿
                const context = canvas.getContext('2d')
                context.mozImageSmoothingEnabled    = false
                context.webkitImageSmoothingEnabled = false
                context.msImageSmoothingEnabled     = false
                context.imageSmoothingEnabled       = false
                // 形成图片
                const dataUrl = Canvas2Image.getDataURL(canvas, 'image/png', canvas.width/scale, canvas.height/scale)
                // const dataUrl = canvas.toDataURL('image/png')
                // 上传图片
                this.uploadPosterFile(_id, dataUrl)
            })
        },
        async uploadPosterFile(_id, dataUrl){
            // 通过 FormData 完成ajax的图片上传
            var formData = new FormData()
            // 需要 blob 文件
            formData.append('file', convertBase64UrlToBlob(dataUrl), 'poster.png')
            // id 参数
            formData.append('id', _id)
            const response = await uploadPoster(formData)
            // 模拟手动点击超链接下载
            this.saveFileToLoca(response.data, this.poster.type)
            if (response.code == 1){
                this.$message.success(response.message)
            } else {
                this.$message.error(response.message)
            }
        },
        saveFileToLoca(data, filename){
            const save_link = document.createElement('a')
            save_link.href = data
            save_link.target = '_blank'
            save_link.download = filename
            const event = document.createEvent('MouseEvents')
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            save_link.dispatchEvent(event)
        },
        async saveHandler(dir){
            const response = await savePoster({
                id: !Cookies.get('poster_id') ? '' : Cookies.get('poster_id'),
                name: this.poster.name,
                desc: this.poster.desc,
                size: `${this.poster.size[0]}*${this.poster.size[1]}`,
                type: this.poster.type,
                elements: this.poster.elements
            })
            if (response.code == 1){
                this.setLeaveRemind(!1)
                if (dir !== 'export'){
                    this.$message.success(response.message)
                } else { // 执行导出
                    this.exportHandler(response.data) // id
                }
            } else {
                this.$message.error(response.message)
            }
        },
        reloadData(res){ // 关闭 dialog 面板，重新加载数据
            if (res == 'reload'){
                this.dialogVisible = !1
            }
        }
    },
    components: {
        AppDialog,
        SetPoster
    },
    created(){
        Cookies.remove('poster_id')
    }
}
</script>

<style scoped>
.mdm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 48px;
    color: #4f5d69;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.16);
    z-index: 1;
}
.mdm-header .info {
    font-size: 14px;
    padding-left: 24px;
    display: flex;
    align-items: center;
}
.mdm-header .info .size {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 20px;
    background: #f7f8f9;
    border-radius: 3px;
}
.mdm-header .info .icon {
    font-size: 14px;
    margin: 0 6px;
}
.mdm-header .list {
    display: flex;
    align-items: center;
}
.mdm-header .list .item {
    width: 65px;
    height: 48px;
}
.mdm-header .list .item {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all .3s;
}
.mdm-header .list .item:hover {
    color: #1593ff;
}
</style>