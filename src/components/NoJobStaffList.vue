<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>不在职员工列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown class="fr" style="margin-left: 10px;" size="small" placement="bottom-start" split-button type="primary">
            操作
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.stop.native="recoverHandler">恢复在职</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
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
            multiple
            collapse-tags
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
            style="width: 90px; margin-right: 10px;"
            v-model="search.type" 
            clearable 
            @change="searchHandle" 
            placeholder="类型">
            <el-option
                v-for="(item, key) in workTypeList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input
            class="fl"
            style="width: 160px"
            size="small"
            placeholder="姓名/电话号/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading" @selection-change="handleSelectionChange">
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
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row.id, 'showVisible')" size="mini">
                        查看
                    </el-button><el-button @click.stop="recordHandler(scope.row.id, 'show2Visible')" type="success" size="mini">
                        离职信息
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <app-dialog title="显示员工信息" :visible.sync="dialog.showVisible" top="0" custom-class="dialog-full-height">
        <app-show-staff :record-id="recordId" type="offjob"></app-show-staff>
    </app-dialog>
    <app-dialog title="员工离职信息" :visible.sync="dialog.show2Visible">
        <app-show2-staff :record-id="recordId"></app-show2-staff>
    </app-dialog>
</div>
</template>

<script>
import { getNoJobStaffInfo, recoverStaffOnJob } from 'api'

import { mapState, mapActions } from 'vuex'

import AppDialog from 'components/AppDialog.vue'
import AppShowStaff from 'components/ShowStaff.vue'
import AppShow2Staff from 'components/Show2Staff.vue'

export default {
    name: 'app-nojobstaff-list',
    data (){
        return {
            search: {
                dept: '',
                gender: '',
                job: '',
                kind: [],
                type: '',
                keyword: ''
            },
            list: [],
            loading: !1,
            curPageIndex: 1,
            multipleSelection: [], // 选中记录的数组
            dialog: {
                showVisible: !1,
                show2Visible: !1
            },
            recordId: ''
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'jobList', 'kindList', 'sexList', 'workTypeList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createJobList', 'createKindList', 'createWorkTypeList']),
        recordHandler(_id, _type){
            this.dialog[_type] = !0
            this.recordId = _id
        },
        async getStuffList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getNoJobStaffInfo({
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
        batchHandler(_type, ids){
            if (!Array.isArray(ids)){
                ids = this.multipleSelection.map(item => item.id)
                if (ids.length == 0){
                    return this.$message.warning('请勾列表记录！')
                }
            }
            // console.log(_type, ids)
            this.recordHandler(ids.join(','), `${_type}Visible`)
        },
        recoverHandler(){
            const ids = this.multipleSelection.map(item => item.id)
            if (ids.length == 0){
                return this.$message.warning('请勾列表记录！')
            }
            this.$confirm(`确认恢复员工在职吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await recoverStaffOnJob({ ids: ids.join(',')})
                if (response.code == 1){
                    this.getStuffList(this.curPageIndex)
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        searchHandle(){
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
        this.getStuffList()
        this.createDeptList()
        this.createJobList()
        this.createKindList()
        this.createWorkTypeList()
    },
    components: {
        AppDialog,
        AppShowStaff,
        AppShow2Staff
    }
}
</script>

<style>
</style>