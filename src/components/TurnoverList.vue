<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>预估营业额</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="message-prompt fr"><i class="el-icon-info"></i>在列表中输入每个时间段的预估营业额</div>
    </nav>
    <div class="component-top">
        <div class="search-title fl">选择周：</div>
        <el-date-picker
            class="fl"
            size="small"
            v-model="form.date"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            :picker-options="pickerOptions"
            @change="dateChangeHandle">
        </el-date-picker>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="saveHandle">保存</el-button>
    </div>
    <div class="component-main">
        <table class="turnover-list">
            <thead>
                <tr>
                    <th>排班时间段</th>
                    <th v-for="(item, key) in tableHeaders" :key="key">{{ item }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item1, key1) in list" :key="key1">
                    <td>{{ timePart[key1] }}</td>
                    <td v-for="(item2, key2) in item1" :key="key2" :data-index="key1 + ',' + key2">
                        <el-input type="number" v-model="item2.input" size="mini"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import { addEstimateTurnover } from 'api'
import moment from 'moment'

export default {
    name: 'app-turnover-list',
    data (){
        return {
            form: {
                date: ''
            },
            list: [],
            tableHeaders: [
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
                '星期日'
            ],
            cloneHeaders: [],  // 克隆 tableHeaders 原始数据
            timePart: [
                '8:00 - 9:00',
                '9:00 - 10:00',
                '10:00 - 11:00',
                '11:00 - 12:00',
                '12:00 - 13:00',
                '13:00 - 14:00',
                '14:00 - 15:00',
                '15:00 - 16:00',
                '16:00 - 17:00',
                '17:00 - 18:00',
                '18:00 - 19:00',
                '19:00 - 20:00',
                '20:00 - 21:00',
                '21:00 - 22:00'
            ],
            pickerOptions: {
                firstDayOfWeek: 1,
                disabledDate(time){
                    return time.getTime() < moment().subtract(1, 'days')
                },
                shortcuts: [{
                    text: '本周',
                    onClick(picker){
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '下一周',
                    onClick(picker){
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            }
        }
    },
    methods: {
        dateChangeHandle(val){ // 日期控件
            if (!val) return
            const weekOfday = moment(val).format('E') // 计算今天是这周第几天  
            const weekStart = moment(val).subtract(Number(weekOfday) - 1, 'days') // 周一日期  
            // console.log(weekStart.format('YYYY-MM-DD'))
            let _arr = []
            for (let i = 0; i < this.tableHeaders.length; i++){
                _arr[i] = this.cloneHeaders[i] + ' ' + moment(new Date(weekStart).getTime() + 3600 * 1000 * 24 * i).format('MM-DD')
            }
            this.tableHeaders = _arr
        },
        initialListHandle(){
            this.timePart.forEach(() => {
                let _arr = []
                this.tableHeaders.forEach(() => _arr.push({ input: '' }) )
                this.list.push(_arr)
            })
        },
        async saveHandle(){
            const response = await addEstimateTurnover(this.list)
            if (response.code == 1){
                
            } else {
                this.$message.error(response.message)
            }
        }
    },
    created (){
        this.cloneHeaders = _.cloneDeep(this.tableHeaders)
        this.initialListHandle()
    },
}
</script>

<style>
.turnover-list {
    width: 100%;
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 10px;
}
.turnover-list thead th {
    padding: 10px 0;
    border: 1px solid #dcdfe6;
    background-color: #f5f7fa;
}
.turnover-list thead th:not(:nth-of-type(1)) {
    width: 13%;
}
.turnover-list tbody td {
    height: 32px;
    padding: 5px;
    vertical-align: middle;
    border: 1px solid #dcdfe6;
}
</style>