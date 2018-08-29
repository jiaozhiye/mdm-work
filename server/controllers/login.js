const db = require('../models/db')
const jwt = require('jsonwebtoken')
const config = require('../config')
const debug = require('debug')('debug:log')

const login = async (ctx, next) => {
    // debug(ctx.request.body)
    let { username, password } = ctx.request.body
    try {
        let [ data ] = [{id: '1', name: username, pwd: password}]
        if (!data){
            return ctx.state.message = '用户名不存在！'
        }
        if (password !== data.pwd){
            return ctx.state.message = '密码错误, 请重新输入！'
        }
        let payload = {
            id: data.id,
            name: data.name
        }
        // token签名 有效期为24小时
        let token = jwt.sign(payload, config.auth.admin_secret, { expiresIn: '24h' })
        // 返回数据
        ctx.body = {
            code: 1,
            message: '登录成功!',
            data: {
                id: data.id,
                name: data.name,
                roles: []
            },
            token
        }
    } catch (e) {
        ctx.state.message = e.toString()
        ctx.throw(e)
    }
}

const info = async (ctx, next) => {
    let token = ctx.headers['x-access-token'] || (ctx.request.body && ctx.request.body.token) || ctx.query.token
    try {
        let tokenInfo = jwt.verify(token, config.auth.admin_secret)
        // 返回数据
        ctx.state.code = 1
        ctx.state.message = '鉴权成功!'
        ctx.state.data = tokenInfo
    } catch (e) {
        if ('TokenExpiredError' === e.name){
            ctx.state.message = 'token已过期, 请重新登录!'
            ctx.throw(401, 'token expired')
        }
        ctx.state.message = 'token验证失败, 请重新登录!'
        ctx.throw(401, 'invalid token')
    }
}

module.exports = {
    login,
    info
}
