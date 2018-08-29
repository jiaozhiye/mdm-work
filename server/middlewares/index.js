const path = require('path')
const config = require('../config')
const response = require('./response')
const auth = require('./auth')
const cors = require('@koa/cors')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')

module.exports = app => {
    // 缓存拦截器
    app.use(async (ctx, next) => {
        if (ctx.url === '/favicon.ico') return
        await next()
        ctx.status = 200
        ctx.set('Cache-Control', 'must-revalidation')
        if (ctx.fresh){
            return ctx.status = 304
        }
    })

    // 使用 cors 中间件处理跨域
    app.use(cors({
        origin: config.whitelist[0],
        credentials: true
    }))

    // 使用 session 中间件
    app.keys = ['a newer secret']
    app.use(session(app))

    // 权限中间件
    app.use(auth)

    // 解析请求体
    app.use(bodyParser())

    // 响应处理中间件
    app.use(response)

    // 静态资源服务中间件
    app.use(koaStatic(path.resolve(__dirname, '../', 'uploads')))
}