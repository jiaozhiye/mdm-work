<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-main" style="padding-top: 10px; padding-right: 50%;">
        <el-form :model="form" ref="form" label-width="100px" size="small">
            <h5 class="form-part-line">基本信息</h5>
            <el-form-item label="姓名：">
                <span class="form-record-show">{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="性别：">
                <span class="form-record-show">{{ form.gender }}</span>
            </el-form-item>
            <el-form-item label="门店：">
                <span class="form-record-show">{{ form.store }}</span>
            </el-form-item>
            <el-form-item label="职务：">
                <span class="form-record-show">{{ form.job }}</span>
            </el-form-item>
            <el-form-item label="电话：">
                <span class="form-record-show">{{ form.phone }}</span>
            </el-form-item>
            <h5 class="form-part-line">帐号信息</h5>
            <el-form-item label="邮箱：">
                <span class="form-record-show">{{ form.email }}</span>
            </el-form-item>
            <el-form-item label="密码：">
                <span class="form-record-show">
                    <span class="personal-setting-password">● ● ● ● ● ● ● ●</span>
                    <el-button type="text" @click=" dialog.modVisible = true ">修改</el-button>
                </span>
            </el-form-item>
        </el-form>
    </div>
    <app-dialog title="修改个人密码" :visible.sync="dialog.modVisible">
        <app-mod-personal @reloadEvent="reloadGetData"></app-mod-personal>
    </app-dialog>
</div>

</template>

<script>
import { getUserAllInfo } from 'api'

import AppDialog from 'components/AppDialog.vue'
import AppModPersonal from 'components/ModPersonal.vue'

export default {
    name: 'app-personal-setting',
    data (){
        return {
            form: {
                name: '',
                gender: '',
                store: '',
                job: '',
                phone: '',
                email: '',
                password: ''
            },
            dialog: {
                modVisible: !1
            }
        }
    },
    methods: {
        async getRecord(){
            const response = await getUserAllInfo()
            if (response.code == 1){
                this.form = response.data 
            } else {
                this.$message.error(response.message)
            }
        },
        reloadGetData(res){
            if (res == 'reload'){
                for (let attr in this.dialog) this.dialog[attr] = !1
            }
        }
    },
    created(){
        this.getRecord()
    },
    components: {
        AppDialog,
        AppModPersonal
    }
}
</script>

<style>
.personal-setting-password {
    display: inline-block;
    width: 200px;
}
</style>