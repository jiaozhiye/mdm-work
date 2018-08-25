<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="姓名">
            <span class="form-record-show">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="离职日期">
            <span class="form-record-show">{{ form.leavedate }}</span>
        </el-form-item>
        <el-form-item label="离职原因">
            <span class="form-record-show">{{ form.desc }}</span>
        </el-form-item>
        <el-form-item label="操作人">
            <span class="form-record-show">{{ form.modifier_id }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getOffJobStaffRecord } from 'api'

export default {
    name: 'app-show2-staff',
    props: ['recordId'],
    data (){
        return {
            form: {
                name: '',
                hiredate: ''
            }
        }
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        }
    },
    created(){
        this.getFormInfo(async () => getOffJobStaffRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>