<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="dialog.addVisible = true">录入员工</el-button>
    </nav>
    <div class="component-top">
        <div class="search-title fl">部门：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.dept" 
            clearable 
            @change="searchHandle" 
            placeholder="部门">
            <el-option
                v-for="(item, key) in deptList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">性别：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 80px; margin-right: 10px;"
            v-model="search.gender" 
            clearable 
            @change="searchHandle" 
            placeholder="性别">
            <el-option
                v-for="(item, key) in sexList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">职位：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.job" 
            clearable 
            @change="searchHandle" 
            placeholder="职位">
            <el-option
                v-for="(item, key) in jobList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">岗位：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 120px; margin-right: 10px;"
            v-model="search.kind" 
            clearable 
            @change="searchHandle" 
            placeholder="岗位">
            <el-option
                v-for="(item, key) in kindList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="search-title fl">工作类型：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 80px; margin-right: 10px;"
            v-model="search.type" 
            clearable 
            @change="searchHandle" 
            placeholder="岗位">
            <el-option
                v-for="(item, key) in workTypeList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="姓名/电话号/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table :data="list" stripe border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="门店名称" min-width="200">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
            <el-table-column prop="kind" label="岗位"></el-table-column>
            <el-table-column prop="wage" label="薪资"></el-table-column>
            <el-table-column prop="type" label="工作类型"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        查看
                    </el-button><el-button @click.stop="recordHandler(scope.row.id, 'modVisible')" type="primary" size="mini">
                        修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <el-dialog title="新增员工" :visible.sync="dialog.addVisible" top="0" custom-class="dialog-full-height">
        <app-add-stuff @reloadEvent="reloadGetData"></app-add-stuff>
    </el-dialog>
    <el-dialog title="修改门店信息" :visible.sync="dialog.modVisible">
        <app-mod-store :record-id="dialog.recordId" @reloadEvent="reloadGetData"></app-mod-store>
    </el-dialog>
    <el-dialog title="查看门店信息" :visible.sync="dialog.showVisible">
        <app-show-store :record-id="dialog.recordId"></app-show-store>
    </el-dialog>
</div>
</template>

<script>
import { getStuffInfo } from 'api'

import { mapState, mapActions } from 'vuex'

import AppAddStuff from 'components/AddStuff.vue'
import AppModStore from 'components/ModStore.vue'
import AppShowStore from 'components/ShowStore.vue'

export default {
    name: 'app-staff-list',
    data (){
        return {
            search: {
                dept: '',
                gender: '',
                type: '',
                keyword: ''
            },
            list: [{}],
            loading: !1,
            curPageIndex: 1,
            dialog: {
                addVisible: !1,
                showVisible: !1,
                modVisible: !1,
                recordId: ''
            }
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'jobList', 'kindList', 'sexList', 'workTypeList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createJobList', 'createKindList']),
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.dialog.recordId = _id
        },
        async getStuffList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            // this.loading = !0
            const response = await getStuffInfo({
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
            // this.loading = !1
        },
        searchHandle(){
            this.getStuffList(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getArticleList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.dialog.addVisible = !1
                this.dialog.modVisible = !1
                this.getStuffList(this.curPageIndex)
            }
        }
    },
    created(){
        this.getStuffList()
        this.createDeptList()
        this.createJobList()
        this.createKindList()
    },
    components: {
        AppAddStuff,
        AppModStore,
        AppShowStore
    }
}
</script>

<style>
</style>