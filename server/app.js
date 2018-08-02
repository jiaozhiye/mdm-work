const path = require('path')
const Koa = require('koa')
const debug = require('debug')('mdm-server')
const response = require('./middlewares/response')
const request = require('./middlewares/request')
const proxy = require('koa-proxies')
const cors = require('@koa/cors')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const config = require('./config')
const app = new Koa()

// 使用 session 中间件
app.keys = ['a newer secret']
app.use(session(app))

// 使用 cors 中间件处理跨域
app.use(cors())

// 解析请求体
app.use(bodyParser())

// 使用响应处理中间件
app.use(response)

// 使用请求处理中间件
app.use(request)

// 静态资源服务中间件
app.use(koaStatic(path.join(__dirname, 'uploads')))

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 服务代理中间件 -> http://127.0.0.1:2080/hrms/** 请求被代理到 https://59.110.152.54/hrms/** 
app.use(proxy('/hrms', {
    target: 'http://59.110.152.54',
    changeOrigin: true,
    logs: true,
    headers: {
        host: '59.110.152.54',
        referer: 'http://59.110.152.54'
    }
}))

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
