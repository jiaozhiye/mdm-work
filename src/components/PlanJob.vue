<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/scheduling' }">排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>排班管理</el-breadcrumb-item>
            <el-breadcrumb-item>排班表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="message-prompt fr"><i class="el-icon-info"></i>注意：点击编辑按钮可手动排班，表格上的红色圆点说明没排满</div>
    </nav>
    <div class="component-top">
        <div class="search-title fl">门店：</div>
        <el-select 
            class="fl" 
            size="small"
            style="width: 160px; margin-right: 10px;"
            v-model="search.dept" 
            clearable 
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
            style="width: 160px; margin-right: 10px;"
            v-model="planDate"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="dateChangeHandle">
        </el-date-picker>
        <el-dropdown 
            class="fl" 
            style="margin-right: 10px;" 
            size="small" 
            placement="bottom-start" 
            split-button>
            排班
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                    v-for="(item, key) in dayList" 
                    :key="key"
                    :disabled="planWorkState"
                    @click.native="searchHandle(key)">
                    {{ item }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button class="fl" size="small" :disabled="buttonStatus" @click.stop="showChartHandle">图表</el-button>
        <ul class="fr">
            <el-button class="fl" size="small" :disabled="buttonStatus" @click.stop="editHandle">
                {{ isEdit ? '完成编辑' : '编辑' }}
            </el-button>
            <el-button class="fl" size="small" type="primary" 
                :disabled="buttonStatus" 
                :loading="btnLoading" 
                @click="saveHandle">保存</el-button>
        </ul>
        <div class="search-title fl" style="margin-left: 10px;">
            当前日期：<span style="color: #409eff;">{{ this.dayList[this.search.day] }}</span>
        </div>
    </div>
    <div class="component-main">
        <table class="plan-list" ref="table">
            <thead>
                <tr>
                    <th rowspan="2" colspan="1"><i>排班表</i></th>
                    <th 
                        v-for="(item, key) in tHeadData.big" 
                        :key="key"
                        :colspan="item.col_num">
                        {{ item.name }}
                    </th>
                </tr>
                <tr>
                    <th width="6.3%" 
                        v-for="(item, key) in tHeadData.small" 
                        :key="key">
                        {{ item.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item1, key1) in list" :key="key1">
                    <td class="thead-y">{{ timePart[key1] }}</td>
                    <td v-for="(item2, key2) in item1" :key="key2" :data-index="key1 + ',' + key2">
                        <strong v-if="item2.point" class="cell-point"></strong>
                        <em v-for="(item3, key3) in item2" :key="key3" :style="{'color': item3.color}">{{ item3.name }},</em>
                        <span v-if="isEdit">
                            <i class="handle-cell-btn el-icon-plus" @click.stop="addWorkerHandle(item2, [key1, key2])"></i>
                            <i class="handle-cell-btn el-icon-delete" @click.stop="removeWorkerHandle([key1, key2])"></i>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <app-dialog title="添加该时间段的员工" :visible.sync="dialog.addVisible">
        <div>
            <el-checkbox-group v-model="checkes.checkList" >
                <el-checkbox v-for="(item, key) in checkes.showList" :key="key" 
                    :label="item.id"
                    :disabled="checkes.existList.indexOf(item.id) !== -1">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
            <div class="tr" style="margin-top: 10px;">
                <el-button size="small" @click="closeDialogPanel">取 消</el-button>
                <el-button size="small" type="primary" @click="execAddWorderHandle">确 定</el-button>
            </div>
        </div>
    </app-dialog>
    <app-dialog title="删除该时间段的员工" :visible.sync="dialog.delVisible">
        <div>
            <el-checkbox-group v-model="checkes.checkList" size="small">
                <el-checkbox v-for="(item, key) in checkes.showList" :key="key" :label="item.id">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
            <div class="tr" style="margin-top: 10px;">
                <el-button size="small" @click="closeDialogPanel">取 消</el-button>
                <el-button size="small" type="primary" @click="execRemoveWorkerHandle">确 定</el-button>
            </div>
        </div>
    </app-dialog>
    <app-dialog title="查看排班图表" :visible.sync="dialog.showVisible">
        <salary-chart 
            :data-list="chart.data"
            :title="chart.title"
            :subtitle="chart.subtitle"
            :xAxisList="chart.xAxisList">
        </salary-chart>
    </app-dialog>
</div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

import { mapState, mapActions } from 'vuex'
import { getPlanStaffInfo, getCellStaffInfo, savePlanStaff } from 'api'

import TableCell from 'assets/js/table-cell'

import AppDialog from 'components/AppDialog.vue'
import SalaryChart from './SalaryChart.vue'

export default {
    name: 'app-plan-job',
    data (){
        return {
            planDate: null,
            search: {
                dept: '',
                date: [],
                day: ''
            },
            workers: [], // 员工数组
            list: [],
            cloneList: [],
            dayList: [], // 星期列表
            timePart: [],
            tHeadData: { // 表头数据
                big: [],
                small: []
            },
            cellPromptList: [], // 单元格未排满提示数组
            isEdit: false,     // 是否可编辑
            dialog: {
                addVisible: false,
                delVisible: false,
                showVisible: false
            },
            checkes: {
                showList: [],  // 列表的数组数据
                checkList: [], // 选中的数组
                existList: [], // 单元格中已经存在的职工数组
                cellPos: []    // 单元格对应的索引
            },
            chart: { // 图表数据
                data: [],
                title: '',
                subtitle: '',
                xAxisList: []
            }, 
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
        ...mapState('dict', ['planTheadList', 'deptList', 'weekList']),
        ...mapState('stateChange', ['btnLoading']),
        weeksArr(){
            return this.weekList.map(item => item.name)
        },
        planWorkState(){
            return !(this.search.dept && this.planDate)
        },
        buttonStatus(){
            return !this.workers.length
        }
    },
    watch: {
        planTheadList(val){
            this.initialTHeadHandle(this.planTheadList)
            this.initialListHandle()
        }
    },
    methods: {
        ...mapActions('dict', ['createPlanTheadList', 'createDeptList']),
        initialTHeadHandle(arr){ // 初始化表头数据
            arr.forEach(item => {
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
        initialListHandle(){ // 初始化 list 数据
            this.timePart.forEach(() => {
                let _arr = []
                for (let i = 0; i < this.tHeadData.small.length; i++){
                    _arr.push([])
                }
                this.list.push(_arr)
            })
            this.cloneList = _.cloneDeep(this.list)
        },
        initialDayListHandle(){ // 初始化星期
            this.dayList = _.cloneDeep(this.weeksArr)
        },
        dateChangeHandle(val){ // 日期控件
            if (!val) return
            const weekOfday = moment(val).format('E') // 计算今天是这周第几天  
            const weekStart = moment(val).subtract(Number(weekOfday) - 1, 'days') // 周一日期  
            // console.log(weekStart.format('YYYY-MM-DD'))
            for (let i = 0; i < this.weeksArr.length; i++){
                this.$set(this.dayList, i, `${this.weeksArr[i]} ${moment(new Date(weekStart).getTime() + 3600 * 1000 * 24 * i).format('MM-DD')}`)
            }
            // 设置搜索条件
            this.search.date = [weekStart.format('YYYY-MM-DD'), weekStart.add('days', 6).format('YYYY-MM-DD')]
        },
        searchHandle(day_key){ // 搜索功能
            this.search.day = day_key.toString()
            this.getDataList(() => this.coreHandler())
        },
        createTimePart(){ // 创建时间段的方法
            let start_time = moment('7:30', 'HH:mm')
            for (let i = 0; i < 66; i++){
                let start = moment(start_time).add(i*15, 'minutes')
                let end   = moment(start).add(15, 'minutes')
                this.timePart[i] = `${start.format('HH:mm')}-${end.format('HH:mm')}`
            }
            start_time = null
        },
        editHandle (){ // 编辑按钮
            this.isEdit = !this.isEdit
        },
        async saveHandle (){ // 保存按钮
            this.isEdit = !1
            const response = await savePlanStaff({
                dept: this.search.dept,
                date: this.search.date[0],
                workers: this.workers
            })
            if (response.code == 1){
                this.$message.success(response.message)
            } else {
                this.$message.error(response.message)
            }
        },
        async addWorkerHandle (workerList, cellPos){ // 显示在该时间段添加员工面板
            this.dialog.addVisible = !0
            this.checkes.existList = workerList.map(item => item.id)
            this.checkes.cellPos   = cellPos
            const response = await getCellStaffInfo({ x: cellPos[0], y: cellPos[1] })
            if (response.code == 1){
                this.checkes.showList = response.data
            }
        },
        execAddWorderHandle (){ // 执行员工添加操作
            // console.log(this.checkes.checkList)
            this.checkes.checkList.forEach(id => {
                let obj   = this.checkes.showList.find(item => item.id === id)
                let index = this.workers.findIndex(item => item.id === id)
                if (index === -1){ // 新员工
                    this.workers.push({
                        id,
                        name: obj.name,
                        color: obj.color,
                        work: [ { pos: this.checkes.cellPos, kind: obj.kind, salary: obj.salary } ]
                    })
                } else { // 已存在员工
                    this.workers[index].work.push({ pos: this.checkes.cellPos, kind: obj.kind, salary: obj.salary })
                }
            })
            // 关闭面板
            this.closeDialogPanel()
            // 重新渲染列表
            this.coreHandler()
        },
        removeWorkerHandle (cellPos){ // 显示删除员工面板
            if (this.list[cellPos[0]][cellPos[1]].length == 0){
                return this.$message.warning('该单元格中没有员工，不能执行删除操作！')
            }
            this.dialog.delVisible = !0
            this.checkes.showList = _.cloneDeep(this.list[cellPos[0]][cellPos[1]])
            this.checkes.cellPos = cellPos
        },
        execRemoveWorkerHandle(){ // 执行员工的从单元格删除
            // console.log(this.checkes.checkList)
            this.checkes.checkList.forEach(id => {
                // 移除工作者元素上时间段
                this.removeElement(this.workers.find(item => item.id === id).work, this.checkes.cellPos)
            })
            // 关闭面板
            this.closeDialogPanel()
            // 重新渲染列表
            this.coreHandler()
        },
        showChartHandle(type){ // 查看图表，打开面板
            this.computeSalaryHandle()
            this.dialog.showVisible = !0
        },
        computeSalaryHandle (){ // 计算员工工资 for Highchart
            let salarys = [] // 工资的数组
            let times   = [] // 工时数组
            this.workers.forEach(item => {
                let sum = 0
                item.work.forEach(obj => sum += Number.parseFloat(obj.salary))
                salarys.push(sum)
                times.push(0.25 * item.work.length)
            })
            this.chart = {
                data: [{
                    name: '工资',
                    data: salarys,
                    color: 'rgba(126,86,134,.9)',
                    pointPadding: 0.4,
                    pointPlacement: -0.2,
                    tooltip: {
						valuePrefix: '￥',
						valueSuffix: ' 元'
				    }
                }, {
                    name: '工时',
                    data: times,
                    color: 'rgba(248,161,63,1)',
                    pointPadding: 0.4,
                    pointPlacement: 0.2,
                    tooltip: {
						valuePrefix: '',
						valueSuffix: ' 小时'
				    }
                }],
                title: '员工日工资/工时曲线',
                subtitle: '',
                xAxisList: this.workers.map(item => item.name)
            }
        },
        coreHandler (){ // 核心渲染算法
            this.list = _.cloneDeep(this.cloneList)
            this.workers.forEach(obj => {
                obj.work.forEach(item => {
                    if (Array.isArray(item.pos) && item.pos.length === 2){
                        this.list[item.pos[0]][item.pos[1]].push({
                            id: obj.id,
                            name: obj.name,
                            color: obj.color,
                            salary: item.salary,
                            kind: item.kind
                        })
                    }
                })
            })
            this.cellPromptList.forEach(item => {
                if (this.list[item.pos[0]][item.pos[1]].length < item.maxNum){ // 说明没排满
                    this.list[item.pos[0]][item.pos[1]].point = !0
                }
            })
        },
        removeElement(arr, item){
            for (let i = 0; i < arr.length; i++){
                if (_.isEqual(item, arr[i].pos)){
                    arr.splice(i--, 1)
                    break
                }
            }
        },
        closeDialogPanel(){
            for (let attr in this.dialog) this.dialog[attr] = !1
            setTimeout(() => {for (let attr in this.checkes) this.checkes[attr] = []}, 300)
        },
        async getDataList(callback){
            const response = await getPlanStaffInfo(this.search)
            if (response.code == 1){
                this.workers = response.data || []
                this.cellPromptList = response.problemData || []
                callback && callback()
            } else {
                this.$message.error(response.message)
            }
        }
    },
    created (){
        this.createTimePart()
        this.createDeptList()
        this.initialDayListHandle()
        if (this.planTheadList.length > 0){
            this.initialTHeadHandle(this.planTheadList)
            this.initialListHandle()
        }
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
    },
    components: {
        AppDialog,
        SalaryChart
    }
}

// const workers = [
//     {
//         id: '1',
//         name: '张三',
//         color: '#FF5722',
//         work: [
//             { pos: [0, 1], kind: '岗位', salary: 5 },
//             { pos: [0, 3], kind: '岗位', salary: 6 },
//             { pos: [1, 2], kind: '岗位', salary: 5 },
//             { pos: [2, 4], kind: '岗位', salary: 4 },
//             { pos: [3, 0], kind: '岗位', salary: 5 },
//             { pos: [1, 6], kind: '岗位', salary: 7 }
//         ]
//     },
//     {
//         id: '2',
//         name: '李四',
//         color: '#448AFF',
//         work: [
//             { pos: [0, 3], kind: '岗位', salary: 5 },
//             { pos: [0, 5], kind: '岗位', salary: 6 },
//             { pos: [1, 2], kind: '岗位', salary: 5 },
//             { pos: [1, 4], kind: '岗位', salary: 4 },
//             { pos: [3, 5], kind: '岗位', salary: 5 },
//             { pos: [3, 6], kind: '岗位', salary: 7 }
//         ]
//     },
//     {
//         id: '3',
//         name: '王五',
//         color: '#AFB42B',
//         work: [
//             { pos: [1, 2], kind: '岗位', salary: 5 },
//             { pos: [2, 1], kind: '岗位', salary: 4 },
//             { pos: [2, 2], kind: '岗位', salary: 5 },
//             { pos: [3, 2], kind: '岗位', salary: 7 }
//         ]
//     }
// ]

</script>

<style>
.plan-list {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}
.plan-list thead th {
    padding: 10px 0;
    border: 1px solid #ddd;
    background-color: #f5f7fa;
}
.plan-list thead th > i {
    position: relative;
    top: 20px;
}
.plan-list tbody tr {
    margin-top: -1px;
}
.plan-list tbody td.thead-y {
    background-color: #f5f7fa;
}
.plan-list tbody td {
    padding: 5px;
    vertical-align: middle;
    border: 1px solid #ddd;
    position: relative;
}
.plan-list tbody td > strong.cell-point {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    right: 2px;
    top: 2px;
    z-index: 1;
}

.plan-list tbody > tr:hover {
    background-color: #f5f7fa;
}
.plan-list tbody > tr > td.ctd {
    background-color: #f5f7fa;
}

/* 固定表头 */
.plan-list tbody {
    width: calc(100% + 8px);
    display: block;
    height: calc(100vh - 255px);
    overflow-y: scroll;
    overflow-x: hidden;
}
.plan-list thead,
.plan-list tbody tr {
    display: table;
    width: calc(100% - 1px);
    table-layout: fixed;
}

/* 单元格中的 新增 删除 按钮 */
.plan-list tbody td .handle-cell-btn {
    /* display: none; */
    visibility: hidden;
    pointer-events: none;
    cursor: pointer;
}
.plan-list tbody td .handle-cell-btn:first-of-type {
    padding: 2px 0 2px 2px;
}
.plan-list tbody td .handle-cell-btn:last-of-type {
    padding: 2px 2px 2px 0;
}
.plan-list tbody td:hover .handle-cell-btn {
    /* display: block; */
    visibility: visible;
    pointer-events: auto;
}
</style>