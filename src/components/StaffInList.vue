<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>调入员工列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown class="fr" style="margin-left: 10px;" size="small" placement="bottom-start" split-button type="primary">
            操作
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.stop.native=" dialog.addVisible = true ">调入员工</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </nav>
    <div class="component-top">
        <div class="search-title fl">调出门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.out_store_id" 
            @change="searchHandle" 
            placeholder="调出门店">
            <el-option
                v-for="(item, key) in fromDeptList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">调入门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.in_store_id" 
            @change="searchHandle" 
            placeholder="调入门店">
            <el-option
                v-for="(item, key) in deptList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">开始日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.start_date"
            type="date"
            placeholder="开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="searchHandle">
        </el-date-picker>
        <div class="search-title fl">结束日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.end_date"
            type="date"
            placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="searchHandle">
        </el-date-picker>
        <div class="search-title fl">类型：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 100px; margin-right: 10px;"
            v-model="search.type" 
            clearable 
            @change="searchHandle" 
            placeholder="类型">
            <el-option
                v-for="(item, key) in transferInList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input
            class="fl"
            style="width: 150px"
            size="small"
            placeholder="姓名/电话/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
        <el-button class="fl" style="margin-left: 10px;" size="small"
            @click.stop="searchHandle('all')">
            全部
        </el-button>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column label="调出门店" min-width="150">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.out_store_color}">{{ scope.row.out_store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="调入门店" min-width="150">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.in_store_color}">{{ scope.row.in_store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column label="操作" width="100">
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
    <app-dialog title="调入员工" :visible.sync="dialog.addVisible">
        <app-transfer-in @reloadEvent="reloadGetData"></app-transfer-in>
    </app-dialog>
    <app-dialog title="查看调入信息" :visible.sync="dialog.showVisible">
        <app-show-staff-in :record-id="recordId"></app-show-staff-in>
    </app-dialog>
</div>
</template>

<script>
import { getStaffInList } from 'api'

import { mapState, mapActions, mapGetters } from 'vuex'
import moment from 'moment'

import AppDialog from 'components/AppDialog.vue'
import AppTransferIn from 'components/TransferIn.vue'
import AppShowStaffIn from 'components/ShowStaffIn.vue'

export default {
    name: 'app-staff-in-list',
    data (){
        return {
            search: {
                out_store_id: '',
                in_store_id: '',
                start_date: '',
                end_date: '',
                type: '',
                keyword: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                addVisible: !1,
                showVisible: !1
            },
            recordId: '',
            pickerOptions: {
                disabledDate: time => {
                    if (this.search.start_date !== ''){
                        return time.getTime() < moment(this.search.start_date)
                    }
                }
            }
        }
    },
    computed: {
        ...mapGetters('app', ['deptId']),
        ...mapState('dict', ['deptList', 'fromDeptList', 'transferInList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createFromDeptList', 'createTransferInList']),
        initial(){
            if (this.deptId != ''){
                this.search.in_store_id = this.deptId
                this.searchHandle()
            }
        },
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getStuffList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getStaffInList({
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
        searchHandle(dir){
            if (dir === 'all'){
                for (let attr in this.search){
                    if (attr == 'in_store_id'){
                        this.search[attr] = this.deptId
                        continue
                    }
                    this.search[attr] = ''
                }
            }
            if (moment(this.search.end_date) < moment(this.search.start_date)){
                this.$message.warning('结束日期不能小于开始日期')
                return this.search.end_date = ''
            }
            this.getStuffList(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getStuffList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getStuffList(this.curPageIndex)
            }
        }
    },
    created(){
        this.initial()
        this.getStuffList()
        this.createDeptList()
        this.createFromDeptList()
        this.createTransferInList()
    },
    components: {
        AppDialog,
        AppTransferIn,
        AppShowStaffIn
    }
}
</script>

<style>
</style>