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
            v-model="weekDay"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="dateChangeHandle">
        </el-date-picker>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary"
            :loading="btnLoading" @click="saveHandle">保存</el-button>
    </div>
    <div class="component-main">
        <table class="turnover-list" ref="table">
            <thead>
                <tr>
                    <th>时间段</th>
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
import { getDefaultTurnover, addEstimateTurnover } from 'api'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

import TableCell from 'assets/js/table-cell'

export default {
    name: 'app-turnover-list',
    data (){
        return {
            weekDay: null,
            form: {
                date: ''
            },
            list: [],
            tableHeaders: [],
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
    computed: {
        ...mapState('dict', ['weekList']),
        ...mapState('stateChange', ['btnLoading']),
        dayList(){
            return this.weekList.map(item => item.name)
        }
    },
    methods: {
        dateChangeHandle(val){ // 日期控件
            if (!val) return
            const weekOfday = moment(val).format('E') // 计算今天是这周第几天  
            const weekStart = moment(val).subtract(Number(weekOfday) - 1, 'days') // 周一日期  
            // console.log(weekStart.format('YYYY-MM-DD'))
            this.setDateHandler(weekStart)
        },
        initialTHead(){
            this.tableHeaders = _.cloneDeep(this.dayList)
        },
        initialWeek(){
            this.dateChangeHandle(new Date())
        },
        initialListHandle(){
            this.timePart.forEach(() => {
                let _arr = []
                this.dayList.forEach(() => _arr.push({ input: '' }) )
                this.list.push(_arr)
            })
        },
        setDateHandler(weekStart){
            this.weekDay   = weekStart.toDate()
            this.form.date = weekStart.format('MM-DD')
            for (let i = 0; i < this.dayList.length; i++){
                this.$set(this.tableHeaders, i, `${this.dayList[i]} ${moment(new Date(weekStart).getTime() + 3600 * 1000 * 24 * i).format('MM-DD')}`)
            }
        },
        async getTurnoverList(){
            const response = await getDefaultTurnover()
            if (response.code == 1){
                const respLen = this.getArrayTotal(response.data)
                const listLen = this.getArrayTotal(this.list)
                if (respLen !== listLen){
                    this.$message.error('数据有误！')
                } else {
                    this.list = response.data
                }
            } else {
                this.$message.error(response.message)
            }
        },
        async saveHandle(){
            // console.log(JSON.stringify(this.list))
            if (!this.weekDay){
                return this.$message.warning('请选择周，再进行提交！')
            }
            const response = await addEstimateTurnover({
                date: this.form.date,
                list: this.list
            })
            if (response.code == 1){
                this.$message.success(response.message)
            } else {
                this.$message.error(response.message)
            }
        },
        getArrayTotal(arr){
            return arr.reduce((sum, cur) => {
                if ( Array.isArray(sum) ) sum = sum.length
                return sum + cur.length
            })
        }
    },
    created (){
        this.initialTHead()
        this.initialWeek()
        this.initialListHandle()
        this.getTurnoverList()
    },
    mounted(){
        const oTable = new TableCell({
            tbodyWrapper: this.$refs.table.children[1],
            exceptCellIndexs: [0],
            callback(x, y){
                // console.log(x, y)
            }
        })
        oTable.install()
    }
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

.turnover-list tbody > tr:hover {
    background-color: #f5f7fa;
}
.turnover-list tbody > tr > td.ctd {
    background-color: #f5f7fa;
}
</style>