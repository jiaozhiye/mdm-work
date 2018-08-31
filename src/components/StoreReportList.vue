<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/work_time' }">工资管理</el-breadcrumb-item>
            <el-breadcrumb-item>工资报表</el-breadcrumb-item>
            <el-breadcrumb-item>单店报表</el-breadcrumb-item>
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
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column label="门店名称" min-width="200">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="staff_name" label="姓名"></el-table-column>
            <el-table-column prop="total_work_time" label="总工时"></el-table-column>
            <el-table-column prop="hour_wage" label="时薪"></el-table-column>
            <el-table-column prop="total" label="总工资"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getStoreReportList } from 'api'
import moment from 'moment'

export default {
    name: 'store-report-list',
    data (){
        return {
            search: {
                dept: '',
                start_date: '',
                end_date: ''
            },
            list: [],
            loading: !1,
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
        async getStoreReportInfo(callback){
            this.loading = !0
            const response = await getStoreReportList({ ...this.search })
            if (response.code == 1){
                this.list = response.data
                callback && callback()
            } else {
                this.$message.error(response.message)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getStoreReportInfo()
        }
    },
    created(){
        this.initial()
        this.getStoreReportInfo()
        this.createDeptList()
    }
}
</script>

<style>
</style>