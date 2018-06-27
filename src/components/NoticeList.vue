<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知列表</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
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
            style="width: 120px; margin-right: 10px;"
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
            style="width: 80px; margin-right: 10px;"
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
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="门店名称" min-width="200">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
            <el-table-column prop="kind" label="岗位"></el-table-column>
            <el-table-column prop="wage" label="薪资"></el-table-column>
            <el-table-column prop="type" label="工作类型"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <app-dialog title="处理申请" :visible.sync="dialog.showVisible">
        <app-show-store :record-id="dialog.recordId"></app-show-store>
    </app-dialog>
</div>
</template>

<script>
import { getStuffInfo } from 'api'

import { mapState, mapActions } from 'vuex'

import AppDialog from 'components/AppDialog.vue'
import AppTransferIn from 'components/TransferIn.vue'

export default {
    name: 'app-notice-list',
    data (){
        return {
            search: {
                dept: '',
                date: '',
                status: ''
            },
            list: [{}],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                showVisible: !1,
                recordId: ''
            }
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'noticStateList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createNoticeStateList']),
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.dialog.recordId = _id
        },
        async getNoticeList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            // this.loading = !0
            const response = await getStuffInfo({
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
                this.dialog.showVisible = !1
                this.getNoticeList(this.curPageIndex)
            }
        }
    },
    created(){
        this.getNoticeList()
        this.createDeptList()
        this.createNoticeStateList()
    },
    components: {
        AppDialog,
        AppTransferIn
    }
}
</script>

<style>
</style>