<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/assessment' }">考核管理</el-breadcrumb-item>
            <el-breadcrumb-item>考题管理</el-breadcrumb-item>
            <el-breadcrumb-item>考题列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">添加考题</el-button>
    </nav>
    <div class="component-top">
        <div class="search-title fl">搜索条件：</div>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="考题名称/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="title" label="标题" min-width="250"></el-table-column>
            <el-table-column prop="datetime" label="日期"></el-table-column>
            <el-table-column prop="creater_name" label="发布人"></el-table-column>
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'modVisible')" type="primary" size="mini">
                        修改
                    </el-button><el-button @click.stop="deleteHandler(scope.row.id)" type="danger" size="mini">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <app-dialog title="添加考题" :visible.sync="dialog.addVisible">
        <app-add-question @reloadEvent="reloadGetData"></app-add-question>
    </app-dialog>
    <app-dialog title="修改考题" :visible.sync="dialog.modVisible">
        <app-mod-question :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-question>
    </app-dialog>
</div>
</template>

<script>
import { getQuestionList, delQuestionRecord } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddQuestion from 'components/AddQuestion.vue'
import AppModQuestion from 'components/ModQuestion.vue'

export default {
    name: 'app-question-list',
    data (){
        return {
            search: {
                keyword: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                addVisible: !1,
                modVisible: !1
            },
            recordId: ''
        }
    },
    methods: {
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getQuestionInfo(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getQuestionList({
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
            this.loading = !1
        },
        deleteHandler(_id){
            this.$confirm(`确认删除此考题吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await delQuestionRecord({ id: _id})
                if (response.code == 1){
                    this.getQuestionInfo(this.curPageIndex)
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        searchHandle(){
            this.getQuestionInfo(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getQuestionInfo(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getQuestionInfo(this.curPageIndex)
            }
        }
    },
    created(){
        this.getQuestionInfo()
    },
    components: {
        AppDialog,
        AppAddQuestion,
        AppModQuestion
    }
}
</script>

<style>
</style>