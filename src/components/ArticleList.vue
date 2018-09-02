<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/train' }">培训管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">添加文章</el-button>
    </nav>
    <div class="component-top">
        <div class="search-title fl">所属分类：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.class_id" 
            clearable 
            @change="searchHandle" 
            placeholder="分类">
            <el-option
                v-for="(item, key) in classifyList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="文章标题"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="title" label="文章标题" min-width="200"></el-table-column>
            <el-table-column prop="datetime" label="日期"></el-table-column>
            <el-table-column prop="creater_name" label="发布人"></el-table-column>
            <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        预览
                    </el-button><el-button @click.stop="recordHandler(scope.row.id, 'modVisible')" type="primary" size="mini">
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
    <app-dialog title="添加文章" :visible.sync="dialog.addVisible">
        <app-add-article @reloadEvent="reloadGetData"></app-add-article>
    </app-dialog>
    <app-dialog title="查看文章" :visible.sync="dialog.showVisible" top="0" custom-class="dialog-full-height">
        <app-show-article :record-id="recordId"></app-show-article>
    </app-dialog>
    <app-dialog title="修改文章" :visible.sync="dialog.modVisible" top="0" custom-class="dialog-full-height">
        <app-mod-article :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-article>
    </app-dialog>
</div>
</template>

<script>
import { getArticleList, delArticleRecord } from 'api'

import { mapState, mapActions } from 'vuex'

import AppDialog from 'components/AppDialog.vue'
import AppAddArticle from 'components/AddArticle2.vue'
import AppShowArticle from 'components/ShowArticle2.vue'
import AppModArticle from 'components/ModArticle2.vue'

export default {
    name: 'app-article-list',
    data (){
        return {
            search: {
                class_id: '',
                keyword: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                addVisible: !1,
                showVisible: !1,
                modVisible: !1
            },
            recordId: ''
        }
    },
    computed: {
        ...mapState('dict', ['classifyList'])
    },
    methods: {
        ...mapActions('dict', ['createClassifyList']),
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getArticleInfo(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getArticleList({
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
            this.$confirm(`确认删除吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await delArticleRecord({ id: _id})
                if (response.code == 1){
                    this.getArticleInfo(this.curPageIndex)
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        searchHandle(){
            this.getArticleInfo(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getArticleInfo(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getArticleInfo(this.curPageIndex)
            }
        }
    },
    created(){
        this.getArticleInfo()
        this.createClassifyList()
    },
    components: {
        AppDialog,
        AppAddArticle,
        AppShowArticle,
        AppModArticle
    }
}
</script>

<style>
</style>