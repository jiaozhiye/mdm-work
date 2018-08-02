/**
 * ajax 服务路由集合
 */
const Router = require('koa-router')
const controllers = require('../controllers')
const router = new Router({ prefix: '/hrms' })

// 路由列表
router.post('/login', controllers.other.login)
router.get('/mgr/menu', controllers.other.menu)
router.get('/poster/test1', controllers.poster.test1)

module.exports = router
