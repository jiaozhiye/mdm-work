const db = require('../models/db')

const login = async (ctx, next) => {
    ctx.state.code = 1
    ctx.state.data = {roles: [], name: '管理员', id: '1'}
}

const menu = async (ctx, next) => {
    ctx.state.code = 1
    ctx.state.data = []
}

module.exports = {
    login,
    menu
}