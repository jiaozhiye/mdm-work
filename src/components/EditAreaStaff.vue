<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="员工列表">
            <el-checkbox-group v-model="form.workers">
                <el-checkbox v-for="(item, key) in workerList" :key="key" :label="item.value">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { addAreaStaff, getAreaStaff } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-edit-area-staff',
    props: ['recordId', 'ids', 'dept', 'date'],
    data (){
        return {
            form: {
                workers: this.ids
            },
            workerList: []
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
        async saveRecord(){
            const response = await addAreaStaff({
                id: this.recordId,
                ...this.form
            })
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
        this.getFormInfo(async () => getAreaStaff({ id: this.recordId, dept: this.dept, date: this.date }), 'workerList')
    }
}
</script>

<style>
</style>