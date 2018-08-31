<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/assessment' }">考核管理</el-breadcrumb-item>
            <el-breadcrumb-item>考核管理</el-breadcrumb-item>
            <el-breadcrumb-item>考核列表</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="searchHandle">
        </el-date-picker>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="员工姓名"
            prefix-icon="el-icon-search"
            v-model="search.name"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="datetime" label="考核日期"></el-table-column>
            <el-table-column prop="name" label="员工姓名"></el-table-column>
            <el-table-column prop="hiredate" label="入职时间"></el-table-column>
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
            <el-table-column prop="examiner" label="考核人"></el-table-column>
            <el-table-column label="结果" width="150">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.result_color" size="medium">{{ scope.row.result_text }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
import { getAssessList } from 'api'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-assess-list',
    data (){
        return {
            search: {
                date: '',
                name: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1
        }
    },
    methods: {
        async getAssessInfo(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getAssessList({
                pageNum: curPage,
                pageSize: 10,
                ...this.search
            })
            if (response.code == 1){
                this.list = response.data.list
                this.list.total = response.data.totalRow || 1
                callback && callback()
            } else {
                this.$message.error(response.message)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getAssessInfo(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getAssessInfo(index)
        }
    },
    created(){
        this.getAssessInfo()
    }
}
</script>

<style>
</style>