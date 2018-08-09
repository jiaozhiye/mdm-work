const db = require('../models/db')
const util = require('../models/utils')
const cuid = require('cuid')
const normalize = require('normalize-path')
const path = require('path')

/**
 * 保存海报信息
 * /hrms/poster/save
 */
const save = async (ctx, next) => {
    // console.log(ctx.request.body)
    let rows
    let uuid
    if (ctx.request.body.id != ''){ // 说明是 update
        uuid = ctx.request.body.id
        try {
            rows = await db.query(`update posters set name=?, description=?, elements=?, modify_time=? where id=?`, [
                ctx.request.body.name,
                ctx.request.body.desc,
                JSON.stringify(ctx.request.body.elements),
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

/**
 * 上传导出图片
 * /hrms/poster/upload
 */
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

/**
 * 上传模版图片
 * /hrms/poster/template
 */
const template = async (ctx, next) => {
    // console.log(ctx.req.files)
    if (ctx.req.files.file){
        const __path__ = normalize(ctx.req.files.file.path.match(/template[^\s]+/)[0])
        let uuid = cuid()
        let rows
        try {
            rows = await db.query(`insert into img_template values (?, ?, ?, ?, ?, ?, ?, ?)`, [
                uuid, 
                '0',
                '手机海报模版',
                __path__,
                '10',
                util.createTime(),
                util.createTime(),
                '0'
            ])
        } catch (err) {
            console.log(err)
        }
        if (rows.affectedRows){
            ctx.state.code = 1
            ctx.state.message = '上传成功' 
            ctx.state.data = {
                id: uuid,
                img_url: `${ctx.origin}/${__path__}`
            }
        } else {
            ctx.state.code = 0
            ctx.state.message = '上传失败' 
            ctx.state.data = {}
        }
    } else {
        ctx.body = { code: 0, message: '上传失败', data: '' }
    }
}

/**
 * 获取海报信息
 * /hrms/poster/getone
 */
const getone = async (ctx, next) => {
    try {
        const rows = await db.query('select id, name, description as `desc`, size, type, elements from posters where id=?', [ctx.query.id])
        if (rows.length){
            ctx.state.code = 1
            ctx.state.message = ''
            ctx.state.data = rows[0]
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * 获取海报列表
 * /hrms/poster/getlist
 */
const getlist = async (ctx, next) => {
    try {
        const rows = await db.query(`select id, img_path img_url from img_template where deleted=? order by create_time desc`, ['0'])
        for (let i = 0; i < rows.length; i++){
            rows[i].img_url = `${ctx.origin}/${rows[i].img_url}`
        }
        ctx.state.code = 1
        ctx.state.data = rows
    } catch (err) {
        console.log(err)
    }
}

/**
 * 删除模版
 * /hrms/poster/del_template
 */
const del_template = async (ctx, next) => {
    try {
        const rows = await db.query(`update img_template set deleted=? where id=?`, ['1', ctx.query.id])
        if (rows.affectedRows){
            ctx.state.code = 1
            ctx.state.message = '删除成功'
        } else {
            ctx.state.message = '删除失败'
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * 获取海报分页列表
 * /hrms/poster/pagelist
 */
const pagelist = async (ctx, next) => {
    let pageSize = ctx.query.pageSize > 0 ? Number(ctx.query.pageSize) : 10
    let sqlStr = ``

    // 根据标题查询
    if (ctx.query.keyword !== ''){
        sqlStr += db.format(` AND t1.name LIKE ?`, [`%${ctx.query.keyword}%`])
    }

    const entitys = []

    // 分页sql
    const pagination = {
        sql: `
            SELECT
                t1.id, t1.name, t1.size, t1.type, t1.img_path img_url, t1.modify_time 
            FROM
                posters t1
            WHERE
                t1.deleted='0'
                ${sqlStr}
            ORDER BY
                t1.modify_time DESC
                ${util.generatePageSql(ctx.query.pageNum, pageSize)}
        `,
        params: []
    }

    // 获取总数sql
    const total = {
        sql: `
            SELECT
                count(*) total
            FROM
                posters t1
            WHERE
                t1.deleted='0'
            ${sqlStr}
        `,
        params: []
    }

    entitys.push(pagination)
    entitys.push(total)

    const sqls = entitys.map(item => item.sql).join(';')
    const params = []

    try {
        const rows = await db.query(sqls, params)
        //console.log(rows)
        for (let i = 0; i < rows[0].length; i++){
            rows[0][i].img_url = `${ctx.origin}/${rows[0][i].img_url}`
        }
        ctx.state.code = 1
        ctx.state.message = ''
        ctx.state.data = {
            list: rows[0],
            totalRow: rows[1][0].total,
            totalPage: Math.ceil(rows[1][0].total / pageSize)
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * 删除海报
 * /hrms/poster/del_poster
 */
const del_poster = async (ctx, next) => {
    try {
        const rows = await db.query(`update posters set deleted=? where id=?`, ['1', ctx.query.id])
        if (rows.affectedRows){
            ctx.state.code = 1
            ctx.state.message = '删除成功'
        } else {
            ctx.state.message = '删除失败'
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    save,
    upload,
    template,
    getone,
    getlist,
    del_template,
    pagelist,
    del_poster
}
