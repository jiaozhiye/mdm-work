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
    <div class="component-main" style="padding-top: 10px;">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
            <el-table-column prop="sort" label="分类排序"></el-table-column>
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'modVisible')" size="mini">
                        修改
                    </el-button><el-button @click.stop="deleteHandler(scope.row.id)" type="danger" size="mini">
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
        <app-mod-class :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-class>
    </app-dialog>
</div>
</template>

<script>
import { getTrainClassList, delTrainClassRecord } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddClass from 'components/AddClass.vue'
import AppModClass from 'components/ModClass.vue'

export default {
    name: 'app-store-list',
    data (){
        return {
            list: [],
            loading: !1,
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
        async getRecordList(){
            this.loading = !0
            const response = await getTrainClassList()
            if (response.code == 1){
                this.list = response.data || []
            } else {
                this.$message.error(response.message)
            }
            this.loading = !1
        },
        deleteHandler(_id){
            this.$confirm(`确认删除次分类吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await delTrainClassRecord({ id: _id})
                if (response.code == 1){
                    this.getRecordList()
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
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
        AppModClass
    }
}
</script>

<style>
</style>