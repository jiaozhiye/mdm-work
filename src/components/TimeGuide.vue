<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>可变工时</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="message-prompt fr"><i class="el-icon-info"></i>注意：输入可变工时的格式为单个数字（1）或区间（1-3）</div>
    </nav>
    <div class="component-top">
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="saveHandle">保存</el-button>
    </div>
    <div class="component-main">
        <table class="guide-list">
            <thead>
                <tr>
                    <th rowspan="2" colspan="1"><i>营业额</i></th>
                    <th colspan="6">前　　厅</th>
                    <th colspan="4">菜　　房</th>
                    <th colspan="4">面　　房</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th width="6.3%">服务员</th>
                    <th width="6.3%">传菜员</th>
                    <th width="6.3%">带位员</th>
                    <th width="6.3%">清理员</th>
                    <th width="6.3%">输单员</th>
                    <th width="6.3%">收银员</th>
                    <th width="6.3%">备料(熏酱)</th>
                    <th width="6.3%">备料(凉拌)</th>
                    <th width="6.3%">拌菜(熏酱)</th>
                    <th width="6.3%">拌菜(凉拌)</th>
                    <th width="6.3%">煮面</th>
                    <th width="6.3%">摆面</th>
                    <th width="6.3%">备料</th>
                    <th width="6.3%">炒面/炸酱</th>
                    <th width="6.3%">酒水/饮料</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item1, key1) in list" :key="key1">
                    <td>{{ timePart[key1] }}</td>
                    <td v-for="(item2, key2) in item1" :key="key2" :data-index="key1 + ',' + key2">
                        <el-input v-model="item2.input" size="mini" clearable @blur="checkInputHandle"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import { addTimeGuide } from 'api'

export default {
    name: 'app-time-guide',
    data (){
        return {
            list: [],
            timePart: [
                '0-500',
                '501-1000',
                '1001-1500',
                '1501-2000',
                '2001-2500',
                '2501-3000',
                '3001-3500',
                '3501-4000',
                '4000以上'
            ]
        }
    },
    methods: {
        initialListHandle(){
            this.timePart.forEach(() => {
                let _arr = []
                for (let i = 0; i < 15; i++){
                    _arr.push({ input: '' })
                }
                this.list.push(_arr)
            })
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
            const response = await addTimeGuide(this.list)
            if (response.code == 1){
                
            } else {
                this.$message.error(response.message)
            }
        }
    },
    created (){
        this.initialListHandle()
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
</style>