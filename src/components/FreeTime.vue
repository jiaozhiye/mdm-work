<template>
<div>
    <h5 class="form-part-line" style="margin-left: 0;">选择空闲时间</h5>
    <el-form ref="form" label-width="67px" size="small">
        <el-form-item label="选择周">
            <el-select v-model="week" placeholder="请选择周" @change="changeHandle">
                <el-option v-for="(item, key) in weekList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="时间段">
            <el-time-picker
                class="fl"
                is-range
                v-model="time"
                value-format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
            </el-time-picker>
            <el-button 
                class="fl" 
                style="margin-left: 10px;"
                icon="el-icon-plus" 
                type="primary" 
                @click="addFreeTimeHandle">
                添加
            </el-button>
        </el-form-item>
    </el-form>
    <h5 class="form-part-line" style="margin-left: 0;">空闲时间列表</h5>
    <div>
        <el-table size="small" :data="list" stripe border>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="free_time" label="闲时"></el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click.stop="removeRecord(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="tr" style="margin-top: 15px;">
        <el-button size="small" @click.stop="closePanle">取消</el-button>
        <el-button size="small" type="primary"
            @click.stop="saveRecord" :loading="btnLoading">保存</el-button>
    </div>
</div>
</template>

<script>
import { addFreeTime, getFreeTime } from 'api'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
    name: 'app-free-time',
    props: ['recordId'],
    data (){
        return {
            week: '0',
            time: [
                moment('07:30:00', 'HH:mm:ss').format('HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss').format('HH:mm:ss')
            ],
            cloneTime: [],
            staff: {}, // 个人信息
            allDataList: [], // 一周所有的数据
            list: []
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['weekList'])
    },
    methods: {
        initialFunc(){
            this.cloneTime = _.cloneDeep(this.time)
        },
        changeHandle(){
            this.list = this.allDataList[this.week]
        },
        async getStaffFreeTime(){
            const response = await getFreeTime({ id: this.recordId })
            if (response.code == 1){
                this.week = response.data.week || this.week
                this.staff = response.data.staff
                this.allDataList = response.data.list.map(arr => arr.map(item => ({ ...this.staff, free_time: item })))
                this.changeHandle()
            } else {
                this.$message.error(response.message)
            }
        },
        addFreeTimeHandle(){
            // console.log(this.time)
            let index = this.list.findIndex(item => item.free_time === this.time.join('-'))
            if (index != -1){
                return this.$message.warning('不能重复添加重复的时间段！')
            }
            let recordRow = _.cloneDeep(this.staff)
            recordRow.free_time = this.time.join('-')
            this.list.push(recordRow)
            this.time = this.cloneTime
        },
        async saveRecord(){
            const response = await addFreeTime({
                id: this.recordId,
                week: this.week,
                times: this.list.map(item => item.free_time).join(',')
            })
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        removeRecord(item){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i] === item){
                    this.list.splice(i--, 1)
                    break
                }
            }
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.initialFunc()
        this.getStaffFreeTime()
    }
}
</script>

<style>
</style>