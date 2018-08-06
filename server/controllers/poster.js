const db = require('../models/db')
const util = require('../models/utils')
const cuid = require('cuid')
const normalize = require('normalize-path')
const path = require('path')

// /hrms/poster/save -> 保存
const save = async (ctx, next) => {
    // console.log(ctx.request.body)
    let rows
    let uuid
    if (ctx.request.body.id != ''){ // 说明是 update
        uuid = ctx.request.body.id
        try {
            rows = await db.query(`update posters set name=?, description=?, elements=?, img_path=?, modify_time=? where id=?`, [
                ctx.request.body.name,
                ctx.request.body.desc,
                JSON.stringify(ctx.request.body.elements),
                '',
                util.createTime(),
                uuid
            ])
        } catch (err) {
            console.log(err)
        }
    } else { // 新增
        uuid = cuid()
        try {
            rows = await db.query(`INSERT INTO posters VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                uuid,
                ctx.request.body.name,
                ctx.request.body.desc,
                ctx.request.body.size,
                ctx.request.body.type,
                JSON.stringify(ctx.request.body.elements),
                '',
                '10',
                util.createTime(),
                util.createTime(),
                '0'
            ])
        } catch (err) {
            console.log(err)
        }
    }
    if (rows.affectedRows){
        ctx.cookies.set('poster_id', uuid, { domain: ctx.hostname, httpOnly: false })
        ctx.state.code = 1
        ctx.state.message = '保存成功' 
        ctx.state.data = uuid
    } else {
        ctx.state.code = 0
        ctx.state.message = '保存失败' 
        ctx.state.data = ''
    }
}

// /hrms/poster/upload -> 上传导出图片
const upload = async (ctx, next) => {
    // ctx.body = { ...ctx.req.files, ...ctx.req.fields }
    if (ctx.req.files.file){
        const __path__ = normalize(ctx.req.files.file.path.match(/product[^\s]+/)[0])
        const rows = await db.query(`update posters set img_path=? where id=?`, [__path__, ctx.req.fields.id])
        ctx.body = { code: 1, message: '上传成功', data: `${ctx.origin}/${__path__}` }
    } else {
        ctx.body = { code: 0, message: '上传失败', data: '' }
    }
}

// /hrms/poster/template -> 上传模版图片
const template = async (ctx, next) => {
    // ctx.body = { ...ctx.req.files, ...ctx.req.fields }
    if (ctx.req.files.file){
        const __path__ = normalize(ctx.req.files.file.path.match(/template[^\s]+/)[0])
        // const rows = await db.query(`update posters set img_path=? where id=?`, [__path__, ctx.req.fields.id])
        ctx.body = { code: 1, message: '上传成功', data: `${ctx.origin}/${__path__}` }
    } else {
        ctx.body = { code: 0, message: '上传失败', data: '' }
    }
}

// /hrms/poster/getone -> 获取海报信息
const getone = async (ctx, next) => {
    
}

// /hrms/poster/getlist -> 获取海报列表
const getlist = async (ctx, next) => {
    
}

module.exports = {
    save,
    upload,
    template,
    getone,
    getlist
}
