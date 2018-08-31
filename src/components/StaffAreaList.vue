<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>区域管理</el-breadcrumb-item>
            <el-breadcrumb-item>区域编辑</el-breadcrumb-item>
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
        <div class="search-title fl">日期：</div>
        <el-date-picker
            class="fl" 
            size="small"
            style="width: 180px; margin-right: 10px;"
            v-model="search.start_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="searchHandle">
        </el-date-picker>
    </div>
    <div class="component-main">
        <el-table size="small" :data="list" stripe border v-loading="loading">
            <el-table-column prop="name" label="区域名称" width="200"></el-table-column>
            <el-table-column label="员工">
                <template slot-scope="scope">
                    <em v-for="(item, key) in scope.row.workers" :key="key" :style="{'color': item.color}">{{ item.name }},</em>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                    <el-button @click.stop="recordHandler(scope.row, 'editVisible')" type="primary" size="mini">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <app-dialog title="编辑员工" :visible.sync="dialog.editVisible">
        <app-edit-area-staff :record-id="recordId" :ids="workerIds" :dept="search.dept" :date="search.start_date" @reloadEvent="reloadGetData"></app-edit-area-staff>
    </app-dialog>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getStoreAreaList } from 'api'
import moment from 'moment'

import AppDialog from 'components/AppDialog.vue'
import AppEditAreaStaff from 'components/EditAreaStaff.vue'

export default {
    name: 'staff-area-list',
    data (){
        return {
            search: {
                dept: '',
                start_date: moment().format('YYYY-MM-DD')
            },
            list: [],
            loading: !1,
            dialog: {
                editVisible: !1
            },
            recordId: '',
            workerIds: [],
            pickerOptions: {
                disabledDate: time => {
                    return time.getTime() < moment().subtract('days', 1)
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
        recordHandler(row, _type){
            this.dialog[_type] = !0
            this.recordId = row.id
            this.workerIds = row.workers.map(item => item.id)
        },
        async getStaffAreaInfo(callback){
            this.loading = !0
            const response = await getStoreAreaList({ ...this.search })
            if (response.code == 1){
                this.list = response.data || []
                callback && callback()
            } else {
                this.$message.error(response.data.message)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getStaffAreaInfo()
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
                this.searchHandle()
            }
        }
    },
    created(){
        this.initial()
        this.getStaffAreaInfo()
        this.createDeptList()
    },
    components: {
        AppDialog,
        AppEditAreaStaff
    }
}
</script>

<style>
</style>