<template>
    <div class="mdm-sidebar">
        <el-tooltip class="item" effect="dark" content="撤销(Ctrl+Z)" placement="left">
            <li class="item hint--left hint--rounded">
                <i class="icon eqf-back"></i>
            </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="恢复(Ctrl+Y)" placement="left">
            <li class="item hint--left hint--rounded">
                <i class="icon eqf-rework"></i>
            </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="预览" placement="left">
            <li class="item hint--left hint--rounded">
                <i class="icon eqf-ppt-l"></i>
            </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清空画布" placement="left">
            <li class="item hint--left hint--rounded">
                <i class="icon eqf-clear-l"></i>
            </li>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'editer-sidebar',
    props: [],
    data(){
        return {}
    }
}
</script>

<style scoped>
.mdm-sidebar {
    width: 50px;
    height: 100%;
    border-right: 1px solid #ddd;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, .16);
    background-color: #fff;
}
.mdm-sidebar .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    cursor: pointer;
}
.mdm-sidebar .item .icon {
    font-size: 20px;
    color: #76838f;
    transition: all .3s ease;
}
.mdm-sidebar .item:hover .icon {
    color: #1593ff;
}
</style>