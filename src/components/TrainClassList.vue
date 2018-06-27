<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/train' }">培训管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">新建分类</el-button>
    </nav>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
            <el-table-column prop="sort" label="分类排序"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        修改
                    </el-button><el-button @click.stop="" type="danger" size="mini">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <app-dialog title="新建分类" :visible.sync="dialog.addVisible">
        <app-add-class @reloadEvent="reloadGetData"></app-add-class>
    </app-dialog>
    <app-dialog title="修改分类" :visible.sync="dialog.modVisible">
        <app-mod-store :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-store>
    </app-dialog>
</div>
</template>

<script>
import { getStoreList, stopStore } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddClass from 'components/AddClass.vue'
import AppModStore from 'components/ModStore.vue'

export default {
    name: 'app-store-list',
    data (){
        return {
            search: {
                name: ''
            },
            list: [],
            loading: !1,
            dialog: {
                addVisible: !1,
                showVisible: !1,
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
        async getRecordList(){
            const response = await getStoreList({ name: this.search.name })
            if (response.code == 1){
                this.list = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        stopItemHandle(item){
            this.$confirm(`确认${item.status == '1' ? '停用' : '启用'}此门店吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await stopStore({
                    id: item.id,
                    status: item.status == '1' ? '0' : '1' // 1 -> 启用    0 -> 停用
                })
                if (response.code == 1){
                    this.getRecordList()
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        searchHandle(){
            this.getRecordList()
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getRecordList()
            }
        }
    },
    created(){
        this.getRecordList()
    },
    components: {
        AppDialog,
        AppAddClass,
        AppModStore
    }
}
</script>

<style>
</style>