<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="上岗日期" prop="work_date">
            <el-date-picker
                v-model="form.work_date"
                type="date"
                placeholder="选择上岗日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选择类别">
                <el-option
                    v-for="(item, key) in transferInList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="来源门店" prop="from_store">
            <el-select v-model="form.from_store" clearable placeholder="请选择来源门店">
                <el-option
                    v-for="(item, key) in fromDeptList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="3" clearable placeholder="请输入说明..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { staffApplyIn } from 'api'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
    name: 'app-transfer-in',
    props: ['recordId'],
    data (){
        return {
            form: {
                work_date: moment().format('YYYY-MM-DD'),
                type: '',
                from_store: '',
                desc: ''
            },
            rules: {
                work_date: [
                    { required: true, message: '请选择上岗日期', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                from_store: [
                    { required: true, message: '请选择来源门店', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请输入说明', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['fromDeptList', 'transferInList'])
    },
    methods: {
        ...mapActions('dict', ['createFromDeptList', 'createTransferInList']),
        async saveRecord(){
            const response = await staffApplyIn(this.form)
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(){
            this.$refs['form'].validate(valid => {
                if (valid){
                    this.saveRecord()
                } else {
                    console.log('error submit!')
                }
            })
        },
        resetForm(){
            this.$refs['form'].resetFields()
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.createFromDeptList()
        this.createTransferInList()
    }
}
</script>

<style>
</style>