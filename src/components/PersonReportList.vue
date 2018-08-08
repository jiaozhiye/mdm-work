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
        <div class="search-title fl">搜索条件：</div>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="员工工号"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <div style="line-height: 32px; padding-left: 10px;" v-if="staff.name">
            姓名：{{staff.staff_name}}，
            总工时：{{staff.total_work_time}}，
            时薪：{{staff.hour_wage}}，
            总工资：{{staff.total}}
        </div>
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="sb_time" label="上班时间"></el-table-column>
            <el-table-column prop="xb_time" label="下班时间"></el-table-column>
            <el-table-column prop="sb_dk" label="上班打卡"></el-table-column>
            <el-table-column prop="xb_dk" label="下班打卡"></el-table-column>
            <el-table-column prop="work_time" label="工时"></el-table-column>
            <el-table-column prop="total" label="总工资"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getPersonReportList } from 'api'
import moment from 'moment'

export default {
    name: 'person-report-list',
    data (){
        return {
            search: {
                dept: '',
                start_date: '',
                end_date: '',
                keyword: ''
            },
            list: [],
            staff: {}, // 员工信息
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
        ...mapState('dict', ['deptList'])
    },
    methods: {
        async getPersonReportInfo(callback){
            this.loading = !0
            const response = await getPersonReportList({ ...this.search })
            if (response.code == 1){
                this.list = response.data
                this.staff = response.staff
                callback && callback()
            } else {
                this.$message.error(response.data.message)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getPersonReportInfo()
        }
    },
    created(){
        this.getPersonReportInfo()
    }
}
</script>

<style>
</style>