const db = require('../models/db')

const test1 = async (ctx, next) => {
    console.log(ctx.headers.query)
    ctx.state.code = 1
    ctx.state.data = 'test1 - state'
    // ctx.body = {code: 1, data: 'test1'}
}

const test2 = async (ctx, next) => {
    ctx.state.data = 'test3'
    ctx.body = {code: 1, data: 'test2'}
}

module.exports = {
    test1,
    test2
}
