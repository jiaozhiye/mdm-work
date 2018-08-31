<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>区域管理</el-breadcrumb-item>
            <el-breadcrumb-item>区域初始化</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.dept" 
            @change="searchHandle" 
            placeholder="门店">
            <el-option
                v-for="(item, key) in deptList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">新增区域</el-button>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="name" label="区域名称" width="200"></el-table-column>
            <el-table-column label="岗位">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.kind }}</p>
                        <div slot="reference" class="text_overflow_cut">
                            {{ scope.row.kind }}
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
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
    <app-dialog title="新增区域" :visible.sync="dialog.addVisible">
        <app-add-area :dept="search.dept" @reloadEvent="reloadGetData"></app-add-area>
    </app-dialog>
    <app-dialog title="修改区域" :visible.sync="dialog.modVisible">
        <app-mod-area :record-id="recordId" @reloadEvent="reloadGetData"></app-mod-area>
    </app-dialog>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getAreaList, delAreaRecord } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppAddArea from 'components/AddArea.vue'
import AppModArea from 'components/ModArea.vue'

export default {
    name: 'app-area-list',
    data (){
        return {
            search: {
                dept: ''
            },
            list: [],
            loading: !1,
            dialog: {
                addVisible: !1,
                modVisible: !1
            },
            recordId: ''
        }
    },
    computed: {
        ...mapGetters('app', ['deptId']),
        ...mapState('dict', ['deptList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList']),
        initial(){
            if (this.deptId != ''){
                this.search.dept = this.deptId
                this.searchHandle()
            }
        },
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getRecordList(){
            this.loading = !0
            const response = await getAreaList({ ...this.search })
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
                const response = await delAreaRecord({ id: _id })
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
        this.initial()
        this.createDeptList()
        this.getRecordList()
    },
    components: {
        AppDialog,
        AppAddArea,
        AppModArea
    }
}
</script>

<style>
</style>