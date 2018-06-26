<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
            <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择生日"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="住址">
            <el-input v-model="form.address" type="textarea" :rows="2" clearable placeholder="请输入住址"></el-input>
        </el-form-item>
        <el-form-item label="工号">
            <el-input v-model="form.emp_num" clearable placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="入职日期">
            <el-date-picker
                v-model="form.hiredate"
                type="date"
                placeholder="选择入职时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="所在门店">
            <el-select v-model="form.dept" clearable placeholder="请选门店">
                <el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="职位">
            <el-select v-model="form.job" clearable placeholder="请选职位">
                <el-option v-for="(item, key) in jobList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="岗位">
            <el-checkbox-group v-model="form.kind">
                <el-checkbox v-for="(item, key) in kindListNoAll" :key="key" :label="item.value">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="在职状态">
            <el-select v-model="form.status" clearable placeholder="请选在职状态">
                <el-option v-for="(item, key) in jobStatusList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="身份证号">
            <el-input v-model="form.id_num" clearable placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="工作类型">
            <el-select v-model="form.type" clearable placeholder="请选工作类型">
                <el-option v-for="(item, key) in workTypeList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="时薪">
            <el-input type="number" v-model="form.hour_wage" placeholder="保留两位小数"></el-input>
        </el-form-item>
        <el-form-item label="月薪">
            <el-input type="number" v-model="form.month_wage" placeholder="保留两位小数"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
            <el-input v-model="form.bank" clearable placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="银行卡">
            <el-input v-model="form.bank_card_num" clearable placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('form')" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { addStuffInfo } from 'api'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
    name: 'app-add-stuff',
    data (){
        return {
            form: {
                name: '',
                gender: '0',
                birthday: '1990-01-01',
                phone: '',
                address: '',
                emp_num: '',
                hiredate: moment().format('YYYY-MM-DD'),
                dept: '',
                job: '',
                kind: [],
                status: '',
                id_num: '',
                type: '',
                hour_wage: '',
                month_wage: '',
                bank: '',
                bank_card_num: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'jobList', 'kindList', 'workTypeList', 'jobStatusList']),
        ...mapState('stateChange', ['btnLoading']),
        kindListNoAll(){
            return this.kindList.slice(1)
        }
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createJobList', 'createKindList', 'createJobStatusList']),
        async saveRecord(){
            const response = await addStuffInfo(this.form)
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if (valid){
                    this.saveRecord()
                } else {
                    console.log('error submit!')
                }
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields()
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.createDeptList()
        this.createJobList()
        this.createKindList()
        this.createJobStatusList()
    }
}
</script>

<style>
</style>