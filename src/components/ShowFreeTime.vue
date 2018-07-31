<template>
<div>
    <h5 class="form-part-line" style="margin-left: 0;">选择周</h5>
    <el-form ref="form" label-width="67px" size="small">
        <el-form-item label="选择周">
            <el-date-picker
                size="small"
                v-model="weekDay"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="dateChangeHandle">
            </el-date-picker>
        </el-form-item>
    </el-form>
    <h5 class="form-part-line" style="margin-left: 0;">空闲时间列表</h5>
    <div>
        <el-table size="small" :data="list" stripe border>
            <el-table-column prop="day1" label="星期一"></el-table-column>
            <el-table-column prop="day2" label="星期二"></el-table-column>
            <el-table-column prop="day3" label="星期三"></el-table-column>
            <el-table-column prop="day4" label="星期四"></el-table-column>
            <el-table-column prop="day5" label="星期五"></el-table-column>
            <el-table-column prop="day6" label="星期六"></el-table-column>
            <el-table-column prop="day7" label="星期日"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { getAllFreeTime } from 'api'
import moment from 'moment'

export default {
    name: 'app-show-free-time',
    props: ['recordId'],
    data (){
        return {
            weekDay: null,
            form: {
                date: ''
            },
            list: [],
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
            this.form.date = weekStart.format('YYYY-MM-DD')
            this.getFreeTimeList()
        },
        async getFreeTimeList(){
            const response = await getAllFreeTime({
                staff_id: this.recordId,
                date: this.form.date
            })
            if (response.code == 1){
                this.list = response.data
            } else {
                this.$message.error(response.message)
            }
        }
    }
}
</script>

<style>
</style>