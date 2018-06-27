<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/performance' }">绩效管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>绩效列表</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.store_id" 
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
        <div class="search-title fl">开始日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.start_date"
            type="date"
            placeholder="开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
        </el-date-picker>
        <div class="search-title fl">结束日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.end_date"
            type="date"
            placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-input
            class="fl"
            style="width: 160px"
            size="small"
            placeholder="姓名/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column label="门店名称" min-width="200">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="type" label="奖罚"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="money" label="金额"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        查看
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
    <app-dialog title="查看奖罚信息" :visible.sync="dialog.showVisible">
        <app-show-score :record-id="recordId"></app-show-score>
    </app-dialog>
    <app-dialog title="修改奖罚信息" :visible.sync="dialog.modVisible">
        <app-mod-score :record-id="recordId"></app-mod-score>
    </app-dialog>
</div>
</template>

<script>
import { getStaffScoreList, delStaffScoreRecord } from 'api'

import { mapState, mapActions } from 'vuex'

import AppDialog from 'components/AppDialog.vue'
import AppShowScore from 'components/ShowScore.vue'
import AppModScore from 'components/ModScore.vue'

export default {
    name: 'app-score-list',
    data (){
        return {
            search: {
                store_id: '',
                start_date: '',
                end_date: '',
                keyword: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                showVisible: !1,
                modVisible: !1
            },
            recordId: ''
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'transferInList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createTransferInList']),
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getStaffScoreInfo(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getStaffScoreList({
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
                const response = await delStaffScoreRecord({ id: _id})
                if (response.code == 1){
                    this.getStaffScoreInfo(this.curPageIndex)
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        searchHandle(){
            this.getStaffScoreInfo(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getArticleList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.getStaffScoreInfo(this.curPageIndex)
            }
        }
    },
    created(){
        this.getStaffScoreInfo()
        this.createDeptList()
        this.createTransferInList()
    },
    components: {
        AppDialog,
        AppShowScore,
        AppModScore
    }
}
</script>

<style>
</style>