<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="职务名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入职务名称"></el-input>
        </el-form-item>
        <el-form-item label="职务描述" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="3" clearable placeholder="请输入职务描述..."></el-input>
        </el-form-item>
        <el-form-item label="权限分配">
            <el-tree
                ref="tree"
                :data="tree"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="checkedKeys"
                @check-change="getCheckedKeys">
            </el-tree>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modJobRecord, getJobTree, getJobRecord } from 'api'
import { mapState, mapActions } from 'vuex'

import axios from 'axios'

export default {
    name: 'app-add-job',
    props: ['recordId'],
    data (){
        return {
            tree: [],
            checkedKeys: [], // 树结构选中的ID数组
            form: {
                name: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入职务名称', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        getAllData(){
            axios.all([getJobTree(), getJobRecord({ id: this.recordId })]).then(axios.spread((trees, record) => {
                if (trees.code == 1){
                    this.tree = trees.data
                }
                if (record.code == 1){
                    this.form = record.job
                    this.checkedKeys = record.menuList
                }
            })).catch (error => {
                console.log(error)
            })
        },
        async saveRecord(){
            const response = await modJobRecord({
                ...this.form,
                menuIds: this.checkedKeys.join(',')
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
        getCheckedKeys(){
            let _arr1 = this.$refs.tree.getHalfCheckedKeys()
            let _arr2 = this.$refs.tree.getCheckedKeys()
            this.checkedKeys = [..._arr1, ..._arr2]
            // console.log(this.checkedKeys)
        },
        resetForm(){
            this.$refs['form'].resetFields()
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.getAllData()
    }
}
</script>

<style>
</style>