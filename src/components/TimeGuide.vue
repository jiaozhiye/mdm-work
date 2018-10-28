<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>可变工时</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="message-prompt fr"><i class="el-icon-info"></i>注意：输入数据的格式为单个数字（1）或区间（1-3）</div>
    </nav>
    <div class="component-top">
        <el-button class="fr" size="small" type="primary"
            :loading="btnLoading" @click="saveHandle">保存</el-button>
        <el-button class="fr" style="margin-right: 10px;" size="small"
            :loading="btnLoading" @click="addRecordHandle">新增</el-button>
    </div>
    <div class="component-main">
        <table class="guide-list" ref="table">
            <thead>
                <tr>
                    <th 
                        v-for="(item, key) in tHeadData.big" 
                        :key="key"
                        :colspan="item.col_num">
                        {{ item.name }}
                    </th>
                </tr>
                <tr>
                    <th width="5%" 
                        v-for="(item, key) in tHeadData.small" 
                        :key="key">
                        {{ item.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item1, key1) in list" :key="key1">
                    <td v-for="(item2, key2) in item1" :key="key2" :data-index="key1 + ',' + key2">
                        <el-input v-model="item2.input" size="mini" @blur="checkInputHandle"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import { getDefaultTime, addTimeGuide } from 'api'
import { mapState, mapActions } from 'vuex'

import TableCell from 'assets/js/table-cell'

export default {
    name: 'app-time-guide',
    data (){
        return {
            list: [],
            tHeadData: {
                big: [],
                small: []
            },
            fixedThead: [
                {
                    key: -2,
                    name: '',
                    children: [{
                        key: -2,
                        name: '营业额'
                    }]
                },
                {
                    key: -1,
                    name: '',
                    children: [{
                        key: -1,
                        name: '顾客数'
                    }]
                }
            ]
        }
    },
    computed: {
        ...mapState('dict', ['planTheadList']),
        ...mapState('stateChange', ['btnLoading']),
    },
    watch: {
        planTheadList(val){
            this.initialTHeadHandle(this.planTheadList)
            this.initialListHandle()
        }
    },
    methods: {
        ...mapActions('dict', ['createPlanTheadList']),
        initialTHeadHandle(arr){
            this.fixedThead.concat(arr).forEach(item => {
                // 处理一级表头
                this.tHeadData.big.push({
                    name: item.name,
                    key: item.key,
                    col_num: item.children.length || 1
                })
                // 处理二级表头
                this.tHeadData.small = this.tHeadData.small.concat(item.children)
            })
            this.tHeadData.small.sort((a, b) => a.key - b.key)
        },
        initialListHandle(){
            this.createRecord()
        },
        addRecordHandle(){
            this.createRecord()
        },
        checkInputHandle(event){
            const regExp = /^\d|(\d-\d)$/
            const val = event.target.value.trim()
            if (regExp.test(val) || val == ''){
                event.target.classList.remove('danger')
            } else {
                event.target.classList.add('danger')
            }
        },
        async saveHandle(){
            // console.log(JSON.stringify(this.list))
            const response = await addTimeGuide(this.list)
            if (response.code == 1){
                this.$message.success(response.message)
            } else {
                this.$message.error(response.message)
            }
        },
        async getTimeGuideList(){
            const response = await getDefaultTime()
            if (response.code == 1){
                // const respLen = this.getArrayTotal(response.data)
                // const listLen = this.getArrayTotal(this.list)
                // if (respLen !== listLen){
                //     this.$message.error('数据有误！')
                // } else {
                   this.list = response.data
                // }
            } else {
                this.$message.error(response.message)
            }
        },
        createRecord(){
            let _arr = []
            for (let i = 0; i < this.tHeadData.small.length; i++){
                _arr.push({ input: '' })
            }
            this.list.push(_arr)
        },
        getArrayTotal(arr){
            if (!arr.length) return 0
            return arr.reduce((sum, cur) => {
                if ( Array.isArray(sum) ) sum = sum.length
                return sum + cur.length
            })
        }
    },
    created (){
        this.getTimeGuideList()
        if (this.planTheadList.length > 0){
            this.initialTHeadHandle(this.planTheadList)
            this.initialListHandle()
        }
    },
    mounted(){
        const oTable = new TableCell({
            tbodyWrapper: this.$refs.table.children[1],
            exceptCellIndexs: [],
            callback(x, y){
                // console.log(x, y)
            }
        })
        oTable.install()
    }
}
</script>

<style>
.guide-list {
    width: 100%;
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 10px;
}
.guide-list thead th {
    padding: 10px 0;
    border: 1px solid #dcdfe6;
    background-color: #f5f7fa;
}
.guide-list thead th > i {
    position: relative;
    top: 20px;
}

.guide-list tbody td {
    height: 32px;
    padding: 5px;
    vertical-align: middle;
    border: 1px solid #dcdfe6;
}
.guide-list tbody td .danger {
    border-color: red;
}

.guide-list tbody > tr:hover {
    background-color: #f5f7fa;
}
.guide-list tbody > tr > td.ctd {
    background-color: #f5f7fa;
}
</style>