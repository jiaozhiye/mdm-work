<template>
    <div class="mdm-sidebar">
        <ul>
            <el-tooltip class="item" effect="dark" content="撤销(Ctrl+Z)" placement="left">
                <li class="item hint--left hint--rounded" @click.stop="cancelHandler">
                    <i class="icon eqf-back"></i>
                </li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="恢复(Ctrl+Y)" placement="left">
                <li class="item hint--left hint--rounded" @click.stop="recoveryHandler">
                    <i class="icon eqf-rework"></i>
                </li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预览" placement="left">
                <li class="item hint--left hint--rounded" @click.stop="previewHandler">
                    <i class="icon eqf-ppt-l"></i>
                </li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清空画布" placement="left">
                <li class="item hint--left hint--rounded" @click.stop="clearHandler">
                    <i class="icon eqf-clear-l"></i>
                </li>
            </el-tooltip>
        </ul>
        <app-dialog title="作品预览" :visible.sync="dialogVisible" top="0" custom-class="dialog-full-height">
            <poster-preview></poster-preview>
        </app-dialog>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { debounce } from 'assets/js/util'

import AppDialog from 'components/AppDialog'
import PosterPreview from 'components/editer/PosterPreview'

export default {
    name: 'editer-sidebar',
    props: [],
    data(){
        return {
            element: null,
            dialogVisible: !1
        }
    },
    computed: {
        ...mapState('editer', ['poster']),
        ...mapGetters('editer', ['currentStep'])
    },
    methods: {
        ...mapActions('editer', [
            'clearPosterArea', 
            'resetPosterByHistory', 
            'changeHistoryState',
            'createEditingIndex',
            'createPosterScale'
        ]),
        clearHandler(){
            this.clearPosterArea()
            this.createEditingIndex(-1)
        },
        previewHandler(){
            this.adaptHandler()
            this.dialogVisible = !0
        },
        cancelHandler(){
            this.stopExecHistory()
            this.resetPosterByHistory(this.currentStep - 1)
            debounce(this.startExecHistory, 550)()
        },
        recoveryHandler(){
            this.stopExecHistory()
            this.resetPosterByHistory(this.currentStep + 1)
            debounce(this.startExecHistory, 550)()
        },
        stopExecHistory(){
            this.changeHistoryState(!1)
        },
        startExecHistory(){
            this.changeHistoryState(!0)
        },
        adaptHandler(){ // 适配
            this.createPosterScale((this.element.clientHeight - 40) / this.poster.size[1])
        },
        keyboardEventFn(ev){
            if (ev.ctrlKey && ev.keyCode == 90){ // 撤销
                ev.preventDefault()
                this.cancelHandler()
            }
            if (ev.ctrlKey && ev.keyCode == 89){ // 恢复
                ev.preventDefault()
                this.recoveryHandler()
            }
        }
    },
    mounted(){
        this.element = document.getElementById('workspace')
        document.addEventListener('keydown', this.keyboardEventFn, false)
    },
    components: {
        AppDialog,
        PosterPreview
    }
}
</script>

<style scoped>
.mdm-sidebar {
    width: 50px;
    height: 100%;
    border-right: 1px solid #ddd;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, .16);
    background-color: #fff;
}
.mdm-sidebar .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    cursor: pointer;
}
.mdm-sidebar .item .icon {
    font-size: 20px;
    color: #76838f;
    transition: all .3s ease;
}
.mdm-sidebar .item:hover .icon {
    color: #1593ff;
}
</style>