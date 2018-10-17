const Koa = require('koa')
const debug = require('debug')('debug:log')
const config = require('./config')
const middleware = require('./middlewares')
const router = require('./routes')
const proxy = require('koa-proxies')
const app = new Koa()

// 挂载中间件
middleware(app)

// 引入路由分发
app.use(router.routes())

// 服务代理中间件 -> http://127.0.0.1:2080/hrms/** 请求被代理到 https://59.110.152.54:8082/hrms/** 
app.use(proxy('/hrms', {
    target: 'http://59.110.152.54:8082',
    changeOrigin: true,
    logs: true,
    headers: {
        host: '59.110.152.54',
        referer: 'http://59.110.152.54:8082',
        cookie: 'JSESSIONID=3C33FF57B149C921783ACB409C4E4070.jvm1' // 为了处理服务端session校验
    }
}))

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
