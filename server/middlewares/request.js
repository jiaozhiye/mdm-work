const config = require('../config')

/**
 * 请求处理模块 - 跨域 session 校验
 */
module.exports = async (ctx, next) => {
    if (!ctx.session.isLogin){ // 没有登录
       // ...
    }

    await next()
}