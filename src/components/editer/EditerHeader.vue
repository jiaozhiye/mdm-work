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
                <li class="item" @click.stop="saveHandler">
                    <i class="icon eqf-save-l"></i> <span>保存</span>
                </li>
                <li class="item" @click.stop="sharHandler">
                    <i class="icon eqf-share-l"></i> <span>分享</span>
                </li>
                <el-button size="small" type="primary" style="margin: 0 20px;"
                    @click.stop="exportHandler">导出</el-button>
            </ul>
        </div>
        <app-dialog title="作品设置" :visible.sync="dialogVisible">
            <set-poster @reloadEvent="reloadData"></set-poster>
        </app-dialog>
    </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

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

        },
        exportHandler(){

        },
        saveHandler(){
            this.setLeaveRemind(!1)
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