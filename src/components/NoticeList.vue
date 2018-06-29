<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/notice' }">消息管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知列表</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.dept" 
            clearable 
            @change="searchHandle" 
            placeholder="门店">
            <el-option
                v-for="(item, key) in deptList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.date" 
            type="date" 
            placeholder="选择日期" 
            value-format="yyyy-MM-dd" 
            @change="searchHandle">
        </el-date-picker>
        <div class="search-title fl">状态：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.status" 
            clearable 
            @change="searchHandle" 
            placeholder="状态">
            <el-option
                v-for="(item, key) in noticStateList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">类型：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.type" 
            clearable 
            @change="searchHandle" 
            placeholder="类型">
            <el-option
                v-for="(item, key) in noticTypeList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="content" label="内容简介" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type_text" label="消息类型"></el-table-column>
            <el-table-column prop="sender_name" label="发送者"></el-table-column>
            <el-table-column prop="datetime" label="日期"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, scope.row.type)" size="mini">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <app-dialog title="查看通知" :visible.sync="dialog.showVisible">
        <component v-bind:is="currentComponent" :record-id="recordId" @reloadEvent="reloadGetData"></component>
    </app-dialog>
</div>
</template>

<script>
import { getNoticeInfo } from 'api'

import { mapState, mapActions } from 'vuex'

import AppDialog from 'components/AppDialog.vue'
import AppNoticeOut from 'components/NoticeOut.vue'
import AppNoticeIn from 'components/NoticeIn.vue'
import AppNoticeQuit from 'components/NoticeQuit.vue'

export default {
    name: 'app-notice-list',
    data (){
        return {
            search: {
                dept: '',
                date: '',
                status: '',
                type: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                showVisible: !1
            },
            recordId: '',
            currentComponent: ''
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'noticStateList', 'noticTypeList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createNoticeStateList', 'createNoticTypeList']),
        recordHandler(_id, _type){
            switch (_type.toString()){
                case '1':
                    this.currentComponent = 'app-notice-out'
                    break;
                case '2':
                    this.currentComponent = 'app-notice-in'
                    break;
                case '3':
                    this.currentComponent = 'app-notice-quit'
                    break;
            }
            this.dialog.showVisible = !0
            this.recordId = _id
        },
        async getNoticeList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            // this.loading = !0
            const response = await getNoticeInfo({
                pageNum: curPage,
                pageSize: 10,
                ...this.search
            })
            if (response.code == 1){
                this.list = response.data.list
                this.list.total = response.data.totalRow || 1
                callback && callback()
            } else {
                this.$message.error(response.data.message)
            }
            // this.loading = !1
        },
        searchHandle(){
            this.getNoticeList(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getArticleList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getNoticeList(this.curPageIndex)
            }
        }
    },
    created(){
        this.getNoticeList()
        this.createDeptList()
        this.createNoticeStateList()
        this.createNoticTypeList()
    },
    components: {
        AppDialog,
        AppNoticeOut,
        AppNoticeIn,
        AppNoticeQuit
    }
}
</script>

<style>
</style>