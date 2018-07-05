<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">添加门店</el-button>
    </nav>
    <div class="component-top">
        <div class="search-title fl">搜索条件：</div>
        <el-input
            class="fl"
            style="width: 200px"
            size="small"
            placeholder="门店名称/拼音"
            prefix-icon="el-icon-search"
            v-model="search.name"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column label="门店名称" min-width="200">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="门店地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="门店电话"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        查看
                    </el-button><el-button @click.stop="recordHandler(scope.row.id, 'modVisible')" type="primary" size="mini">
                        修改
                    </el-button><el-button @click.stop="stopItemHandle(scope.row)" size="mini" type="danger">
                        {{ scope.row.status == '1' ? '停用' : '启用' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <app-dialog title="新增门店" :visible.sync="dialog.addVisible">
        <app-add-store @reloadEvent="reloadGetData"></app-add-store>
    </app-dialog>
    <app-dialog title="修改门店信息" :visible.sync="dialog.modVisible">
        <app-mod-store :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-store>
    </app-dialog>
    <app-dialog title="查看门店信息" :visible.sync="dialog.showVisible">
        <app-show-store :record-id="recordId"></app-show-store>
    </app-dialog>
</div>
</template>

<script>
import { getStoreList, stopStore } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddStore from 'components/AddStore.vue'
import AppModStore from 'components/ModStore.vue'
import AppShowStore from 'components/ShowStore.vue'

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
            this.loading = !0
            const response = await getStoreList({ name: this.search.name })
            if (response.code == 1){
                this.list = response.data || []
            } else {
                this.$message.error(response.message)
            }
            this.loading = !1
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
        AppAddStore,
        AppModStore,
        AppShowStore
    }
}
</script>

<style>
</style>