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
            <el-table-column v-for="(item, key) in tableHeaders" :key="key" 
                :prop="`day${key+1}`" 
                :label="tableHeaders[key]">
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getAllFreeTime } from 'api'
import moment from 'moment'

export default {
    name: 'app-show-free-time',
    props: ['recordId'],
    computed: {
        ...mapState('dict', ['weekList']),
        dayList(){
            return this.weekList.map(item => item.name)
        }
    },
    data (){
        return {
            weekDay: null,
            form: {
                date: ''
            },
            tableHeaders: [],
            list: [],
            pickerOptions: {
                firstDayOfWeek: 1,
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
        initial(){
            this.tableHeaders = _.cloneDeep(this.dayList)
            this.dateChangeHandle(moment().add(7, 'days'))
        },
        dateChangeHandle(val){ // 日期控件
            if (!val) return
            const weekOfday = moment(val).format('E') // 计算今天是这周第几天  
            const weekStart = moment(val).subtract(Number(weekOfday) - 1, 'days') // 周一日期
            this.setDateHandler(weekStart)
            this.getFreeTimeList()
        },
        setDateHandler(weekStart){
            this.weekDay   = weekStart.toDate()
            this.form.date = weekStart.format('YYYY-MM-DD')
            for (let i = 0; i < this.dayList.length; i++){
                this.$set(this.tableHeaders, i, `${this.dayList[i]} ${moment(new Date(weekStart).getTime() + 3600 * 1000 * 24 * i).format('MM-DD')}`)
            }
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
    },
    created(){
        this.initial()
    }
}
</script>

<style>
</style>