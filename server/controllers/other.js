const db = require('../models/db')

const login = async (ctx, next) => {
    ctx.state.code = 1
    ctx.state.data = {roles: [], name: "admin", id: "1"}
}

module.exports = {
    login
}