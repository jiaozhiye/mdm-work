<template>
    <section class="wrapper">
        <div class="flex-container">
            <div class="worker">
                <h4 class="title">职工列表</h4>
                <el-tree
                    ref="tree"
                    :data="tree"
                    node-key="id"
                    show-checkbox
                    default-expand-all
                    highlight-current
                    @check="checkHandle">
                </el-tree>
            </div>
            <div class="table-box">
                <div class="topper">
                    <el-date-picker
                        class="fl"
                        v-model="planDate"
                        type="week"
                        format="yyyy 第 WW 周"
                        placeholder="选择周"
                        :picker-options="pickerOptions"
                        @change="dateChangeHandle">
                    </el-date-picker>
                    <el-button class="fl" style="margin-left: 10px;" @click.stop="planByTimeHandle">按时长排班</el-button>
                    <el-button class="fl" style="margin-left: 10px;" @click.stop="planBySalaryHandle">按工资排班</el-button>
                    <ul class="fr">
                        <el-button @click.stop="editHandle">编辑</el-button>
                        <el-button type="primary" @click.stop="saveHandle">保存</el-button>
                    </ul>
                </div>
                <table class="plan-list">
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
                                <el-tag
                                    v-for="(item3, key3) in item2"
                                    :key="key3"
                                    :closable="isEdit"
                                    :type=" item3.color "
                                    @close="removeWorkerHandle(item3, [key1, key2])">
                                    {{ item3.name }}
                                </el-tag>
                                <el-button class="addWorkerBtn" v-if="isEdit" size="small" @click.stop="addWorkerHandle(item2, [key1, key2])">新增</el-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <section class="chart-container">
            <salary-chart 
                :data-list="chart.data"
                :title="chart.title"
                :subtitle="chart.subtitle"
                :yAxisName="chart.yAxisName">
            </salary-chart>
        </section>
        <el-dialog title="添加员工" :visible.sync="dialogVisible">
            <el-checkbox-group v-model="checkes.checkList">
                <el-checkbox v-for="(item, key) in tree"
                    :key="key" 
                    :label="item.label"
                    :disabled="checkes.existList.indexOf(item.id) !== -1">
                </el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirmHandle">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

import SalaryChart from './SalaryChart.vue'

export default {
    name: 'app-plan-job',
    data (){
        return {
            planDate: '',
            tree: [
                {
                    id: '1',
                    label: '张三',
                    color: 'success',
                    salary: 50,
                    work: [
                        [0, 1],
                        [0, 3],
                        [1, 2],
                        [2, 4],
                        [3, 0],
                        [1, 6]
                    ]
                },
                {
                    id: '2',
                    label: '李四',
                    color: 'danger',
                    salary: 40,
                    work: [
                        [0, 3],
                        [0, 5],
                        [1, 2],
                        [1, 4],
                        [3, 5],
                        [3, 6]
                    ]
                },
                {
                    id: '3',
                    label: '王五',
                    color: '',
                    salary: 60,
                    work: [
                        [1, 2],
                        [2, 1],
                        [2, 2],
                        [3, 2]
                    ]
                }
            ],
            checkedNodes: [],  // 树结构选中元素的数组
            list: [
                [
                    [], [], [], [], [], [], []
                ],
                [
                    [], [], [], [], [], [], []
                ],
                [
                    [], [], [], [], [], [], []
                ],
                [
                    [], [], [], [], [], [], []
                ]
            ],
            cloneList: null,   // 克隆 list 原始数据
            timePart: [
                '8:00 - 10:00',
                '10:00 - 12:00',
                '13:00 - 15:00',
                '15:00 - 17:00'
            ],
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
            isEdit: false,     // 是否可编辑
            dialogVisible: false,
            checkes: {
                checkList: [], // 选中的数组
                existList: [], // 单元格中已经存在的职工数组
                cellArr: []    // 单元格对应的索引
            },
            chart: { // 图标数据
                data: [],
                title: '',
                subtitle: '',
                yAxisName: ''
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
        planByTimeHandle(){ // 按工作时长排班
            this.tree[0].work = [[0, 1], [0, 3], [1, 2], [2, 4], [3, 0], [1, 6]]
            this.tree[1].work = [[0, 3], [0, 5], [1, 2], [1, 4], [3, 5], [3, 6]]
            this.tree[2].work = [[1, 2], [2, 1], [2, 2], [3, 2]]
            this.$refs.tree.setCheckedNodes(this.tree)
            this.checkHandle()
            this.computeWorkTimeHandle()
        },
        planBySalaryHandle(){ // 按员工工资排班
            this.tree[0].work = [[0, 0], [0, 2], [1, 1], [1, 3], [2, 3], [2, 5], [2, 6]]
            this.tree[1].work = [[0, 0], [0, 1], [1, 0], [1, 3], [2, 2], [2, 5], [3, 4]]
            this.tree[2].work = [[0, 3], [0, 6], [1, 5], [2, 0], [2, 5], [3, 1], [3, 4]]
            this.$refs.tree.setCheckedNodes(this.tree)
            this.checkHandle()
            this.computeSalaryHandle()
        },
        checkHandle (){ // 树结构选中操作
            this.checkedNodes = this.$refs.tree.getCheckedNodes()
            this.coreHandler()
        },
        editHandle (){ // 编辑按钮
            this.isEdit = !0
        },
        saveHandle (){ // 保存按钮
            this.isEdit = !1
        },
        addWorkerHandle (workerList, cellArr){ // 在该时间段添加员工
            this.dialogVisible = !0
            this.checkes.checkList = []
            this.checkes.existList = workerList.map(item => item.id)
            this.checkes.cellArr   = cellArr
        },
        dialogConfirmHandle (){ // 弹出对话框的确认操作
            this.dialogVisible = !1
            // console.log(this.checkes.checkList)
            this.tree.forEach(item => {
                if (this.checkes.checkList.findIndex(val => val === item.label) !== -1){
                    item.work.push(this.checkes.cellArr)
                }
            })
            this.coreHandler()
        },
        removeWorkerHandle (tag, arr){ // 删除该时间段的员工
            // console.log(tag, arr)
            this.removeElement(this.list[arr[0]][arr[1]], tag)
            // 移除工作者元素上时间段
            this.removeElement(this.tree.find(item => item.id === tag.id).work, arr)
        },
        computeSalaryHandle (){ // 计算员工工资 for Highchart
            let _arr = this.checkedNodes.map(item => {
                let salarys = [] // 工资的数组
                for (let i = 0; i < 7; i++){
                    let count = 0
                    item.work.forEach(arr => {
                        if (arr[1] === i) count++
                    })
                    salarys[i] = count * Number(item.salary)
                }
                return { name: item.label, data: salarys }
            })
            // console.log(_arr)
            this.chart = {
                data: _arr,
                title: '工资曲线',
                subtitle: '',
                yAxisName: '日工资'
            }
        },
        computeWorkTimeHandle (){ // 计算工作时长 for Highchart
            let _arr = this.checkedNodes.map(item => {
                let timeLens = [] // 工作时长的数组
                for (let i = 0; i < 7; i++){
                    let count = 0
                    item.work.forEach(arr => {
                        if (arr[1] === i) count++
                    })
                    timeLens[i] = count * 2
                }
                return { name: item.label, data: timeLens }
            })
            // console.log(_arr)
            this.chart = {
                data: _arr,
                title: '工作时长曲线',
                subtitle: '',
                yAxisName: '小时'
            }
        },
        coreHandler (){ // 核心渲染算法
            let _arr = _.cloneDeep(this.cloneList)
            this.checkedNodes.forEach(item => {
                item.work.forEach(arr => {
                    if (Array.isArray(arr) && arr.length === 2){
                        _arr[arr[0]][arr[1]].push({ id: item.id, name: item.label, color: item.color });
                    }
                })
            })
            this.list = _arr
        },
        removeElement(arr, item){
            for (let i = 0; i < arr.length; i++){
                if (_.isEqual(item, arr[i])){
                    arr.splice(i--, 1)
                    break
                }
            }
        }
    },
    created (){
        this.cloneList = _.cloneDeep(this.list)
        this.cloneHeaders = _.cloneDeep(this.tableHeaders)
    },
    components: {
        SalaryChart
    }
}
</script>

<style>
.wrapper {
    padding-top: 20px;
}

.flex-container {
    display: flex;
}
.flex-container .worker {
    width: 200px;
    min-height: 400px;
    margin-right: 20px;
}
.flex-container .worker > .title {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    font-size: 16px;
    color: #409eff;
    background: #ecf5ff;
    margin-bottom: 10px;
}
.flex-container .table-box {
    flex: 1;
}
.flex-container .table-box > .topper {
    height: 40px;
    margin-bottom: 15px;
}

.chart-container {
    margin-left: 220px;
    padding-top: 20px;
}

.plan-list {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
    border-spacing: 0;
}
.plan-list thead th {
    padding: 10px 0;
    border: 1px solid #ddd;
}
.plan-list thead th:not(:nth-of-type(1)) {
    width: 13%;
}
.plan-list tbody td {
    height: 80px;
    padding: 5px;
    vertical-align: middle;
    border: 1px solid #ddd;
}

.plan-list tbody td .el-tag,
.plan-list tbody td .el-button {
    margin: 2px;
}
.plan-list tbody td .addWorkerBtn {
    /* display: none; */
    opacity: 0;
    transition: all .4s ease;
}
.plan-list tbody td:hover .addWorkerBtn {
    /* display: block; */
    opacity: 1;
}
</style>