<template>
<div>
    <div style="padding-bottom: 10px;">
        来源门店：<span style="margin-right: 20px;">{{ dataInfo.out_store_name }}</span>
        调入日期：<span style="margin-right: 20px;">{{ dataInfo.date }}</span>
        类别：<span>{{ dataInfo.type_text }}</span>
    </div>
    <div class="component-main">
        <el-table :data="dataInfo.staffList" stripe border size="mini">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
            <el-table-column prop="kind" label="岗位"></el-table-column>
            <el-table-column prop="money" label="薪资"></el-table-column>
            <el-table-column prop="work_type" label="工作类型"></el-table-column>
        </el-table>
    </div>
    <div class="transfer-desc-box">
        <p>说明：{{ dataInfo.remark }}</p>
    </div>
    <el-form :model="form" ref="form" label-width="70px" size="small">
        <el-form-item label="拒绝原因">
            <el-input v-model="form.desc" type="textarea" :rows="3" 
                :disabled="dataInfo.status == '2' || dataInfo.status == '3'" 
                clearable placeholder="请输入拒绝原因...">
            </el-input>
        </el-form-item>
        <el-form-item v-if=" dataInfo.status != '2' && dataInfo.status != '3' ">
            <el-button type="primary" @click="submitForm('form', 'agree')" :loading="btnLoading">同意</el-button>
            <el-button type="danger" plain @click="submitForm('form', 'refuse')" :loading="btnLoading">拒绝</el-button>
        </el-form-item>
        <el-form-item v-else>
            <el-tag type="danger" v-if="dataInfo.status == '2'">已拒绝</el-tag>
            <el-tag type="success" v-if="dataInfo.status == '3'">已同意</el-tag>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getNoticeMoveInById, execApplyInNotice } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-notice-in',
    props: ['recordId'],
    data (){
        return {
            dataInfo: {},
            form: {
                desc: ''
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(status_num){
            const response = await execApplyInNotice({
                id: this.dataInfo.id,
                status2: status_num,
                ...this.form
            })
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(formName, _type){
            this.$refs[formName].validate(valid => {
                if (valid){
                    if (_type === 'refuse'){
                        this.$confirm(`确认拒绝此次调入吗?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            if (this.form.desc === ''){
                                return this.$message.warning('拒绝原因不能为空！')
                            }
                            this.saveRecord('0')
                        }).catch(() => {})
                    } else {
                        this.saveRecord('1')
                    }
                } else {
                    console.log('error submit!')
                }
            })
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.getFormInfo(async () => getNoticeMoveInById({ id: this.recordId }), 'dataInfo')
    }
}
</script>

<style>
.transfer-desc-box {
    padding: 15px 0 20px;
    line-height: 22px;
    font-size: 12px;
}
</style>