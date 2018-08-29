const debug = require('debug')('debug:log')
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 权限处理模块
 */
module.exports = async (ctx, next) => {
    // if (config.auth.blackList.some(item => ctx.path.indexOf(item) != -1)){
    //     let token = ctx.headers['x-access-token'] || (ctx.request.body && ctx.request.body.token) || ctx.query.token
    //     try {
    //         jwt.verify(token, config.auth.admin_secret)
    //     } catch (e) {
    //         if ('TokenExpiredError' === e.name){
    //             ctx.state.message = 'token已过期, 请重新登录!'
    //             ctx.throw(401, 'token expired')
    //         }
    //         ctx.state.message = 'token验证失败, 请重新登录!'
    //         ctx.throw(401, 'invalid token')
    //     }
    //     debug('鉴权成功')
    // }
    await next()
}