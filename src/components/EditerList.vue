<template>
<div>
    <nav class="app-location-wrapper">
        <el-breadcrumb class="fl" separator="/"> 
            <el-breadcrumb-item :to="{ path: '/editer' }">海报管理</el-breadcrumb-item>
            <el-breadcrumb-item>海报制作</el-breadcrumb-item>
            <el-breadcrumb-item>海报列表</el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
    <div class="component-top">
        <div class="search-title fl">搜索条件：</div>
        <el-input
            class="fl"
            style="width: 180px"
            size="small"
            placeholder="海报姓名/拼音"
            prefix-icon="el-icon-search"
            v-model="search.keyword"
            @keyup.enter.native="searchHandle"
            clearable>
        </el-input>
    </div>
    <div class="component-main">
        <div class="poster-list">
            <ul class="clearFix">
                <li v-for="item in list" :key="item.id">
                    <div class="cover">
                        <div class="cover-blur" :style="{backgroundImage: `url(${item.img_url})`}"></div>
                        <div class="cover-img"><img :src="item.img_url"></div>
                    </div>
                    <div class="detail">
                        <div class="name text_overflow_cut">{{ item.name || '无标题' }}</div>
                        <div class="size">{{`${item.type}(${item.size})`}}</div>
                        <div class="more">
                            <a class="mdm-btn blue" href="javascript:;" @click.stop="editPosterHandler(item.id)">
                                <i class="icon icon eqf-copy-l"></i>
                                <span class="text">编辑</span>
                            </a>
                            <a class="mdm-btn red" href="javascript:;" @click.stop="delPosterHandler(item.id)">
                                <i class="icon eqf-delete-l"></i>
                                <span class="text">删除</span>
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
            <dl v-if="!list.length">暂无数据</dl>
        </div>
        <el-pagination class="pagination" background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
import 'assets/css/iconfonts.css'
import { getPosterPageList, removePoster } from 'api'

export default {
    name: 'editer-list',
    data (){
        return {
            search: {
                keyword: ''
            },
            list: [],
            curPageIndex: 1,
            loading: !1
        }
    },
    methods: {
        editPosterHandler(_id){
            this.$router.push({path: `/editer/create`, query: { id: _id }})
        },
        async delPosterHandler(_id){
            this.$confirm(`确认删除此海报吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const response = await removePoster({ id: _id })
                if (response.code == 1){
                    this.getPosterList(this.curPageIndex)
                    this.$message.success(response.message)
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {})
        },
        async getPosterList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            this.loading = !0
            const response = await getPosterPageList({
                pageNum: curPage,
                pageSize: 10,
                ...this.search
            })
            if (response.code == 1){
                this.list = response.data.list
                this.list.total = response.data.totalRow || 1
                callback && callback()
            } else {
                this.$message.error(response.data.message)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getPosterList(1)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getPosterList(index)
        }
    },
    created(){
        this.getPosterList(1)
    }
}
</script>

<style scoped>
.poster-list dl {
    line-height: 80px;
    text-align: center;
}
.poster-list ul li {
    width: 224px;
    height: 324px;
    margin: 15px 10px 0;
    display: inline-block;
    vertical-align: top;
    border-radius: 4px;
    overflow: hidden;
    transition: all .3s ease;
}
.poster-list ul li:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
    transform: translateY(-10px);
}
.poster-list ul li .cover {
    position: relative;
    height: 224px;
    overflow: hidden;
}
.poster-list ul li .cover .cover-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    background: center/cover;
    filter: blur(10px);
}
.poster-list ul li .cover .cover-img {
    position: absolute;
    width: 100%;
    height: 100%;
}
.poster-list ul li .cover .cover-img img {
    display: block;
    margin: 0 auto;
    max-width: 224px;
    max-height: 224px;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
}
.poster-list ul li .detail {
    background: #f0f3f4;
    transition: all 0.3s ease;
}
.poster-list ul li:hover .detail {
    transform: translate3d(0, -60px, 0);
}
.poster-list ul li .detail .name {
    height: 64px;
    padding: 0 12px;
    font-size: 16px;
    line-height: 64px;
    border-bottom: 1px solid #ddd;
    color: #111;
}
.poster-list ul li .detail .size {
    height: 36px;
    padding: 0 12px;
    line-height: 36px;
    font-size: 12px;
    color: #666;
}
.poster-list ul li .detail .more {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
}
.poster-list ul li .detail .more .mdm-btn:not(:first-child) {
    margin-left: 6px;
}
.poster-list ul li .detail .more .mdm-btn {
    width: 32px;
    height: 32px;
    color: #666;
    border: 1px solid #ccd5db;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    padding: 0 12px;
    border-radius: 3px;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.3s ease;
}
.poster-list ul li .detail .more .mdm-btn .icon {
    margin-left: -3px;
}
.poster-list ul li .detail .more .mdm-btn .text {
    margin-left: 12px;
    white-space: nowrap;
}
.poster-list ul li .detail .more .mdm-btn:hover {
    width: 70px;
}
.poster-list ul li .detail .more .mdm-btn.blue:hover {
    color: #fff;
    background: #198ae7;
    border: 1px solid #1593ff;
}
.poster-list ul li .detail .more .mdm-btn.red:hover {
    color: #fff;
    background: #ff004d;
    border: 1px solid #ff2a6a;
}
</style>