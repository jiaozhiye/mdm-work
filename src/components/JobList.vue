<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>组织机构</el-breadcrumb-item>
            <el-breadcrumb-item>职务管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">新增职务</el-button>
    </nav>
    <div class="component-main" style="padding-top: 10px;">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="name" label="职务名称" width="200"></el-table-column>
            <el-table-column prop="staffs_count" label="人数" width="100"></el-table-column>
            <el-table-column prop="staffs" label="人员"></el-table-column>
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
    <app-dialog title="新增职务" :visible.sync="dialog.addVisible">
        <app-add-job @reloadEvent="reloadGetData"></app-add-job>
    </app-dialog>
    <app-dialog title="修改职务" :visible.sync="dialog.modVisible">
        <app-mod-job :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-job>
    </app-dialog>
</div>
</template>

<script>
import { getJobList, delJobRecord } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddJob from 'components/AddJob.vue'
import AppModJob from 'components/ModJob.vue'

export default {
    name: 'app-job-list',
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
            const response = await getJobList()
            if (response.code == 1){
                this.list = response.data || []
            } else {
                this.$message.error(response.message)
            }
            this.loading = !1
        },
        deleteHandler(_id){
            this.$confirm(`确认删除吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await delJobRecord({ id: _id })
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
        AppAddJob,
        AppModJob
    }
}
</script>

<style>
</style>