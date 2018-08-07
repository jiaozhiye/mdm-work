/**
 * ajax 服务路由集合
 */
const Router = require('koa-router')
const controllers = require('../controllers')
const router = new Router({ prefix: '/hrms' })
const koaForm = require('formidable-upload-koa')
const path = require('path')

// koaForm 配置项
const opt_poster = {
    uploadDir: path.join(__dirname, '..', 'uploads/product'),
    keepExtensions: true
}
const opt_template = {
    uploadDir: path.join(__dirname, '..', 'uploads/template'),
    keepExtensions: true
}

// 路由列表
router.post('/login', controllers.other.login)
router.get('/mgr/menu', controllers.other.menu)
router.post('/poster/save', controllers.poster.save)
router.post('/poster/upload', koaForm(opt_poster), controllers.poster.upload)
router.post('/poster/template', koaForm(opt_template), controllers.poster.template)
router.get('/poster/getone', controllers.poster.getone)
router.get('/poster/getlist', controllers.poster.getlist)
router.get('/poster/delete', controllers.poster.del)

module.exports = router
