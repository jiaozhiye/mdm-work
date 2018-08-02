const { mysql: config } = require('../config')

module.exports = {
    connection: {
        'host': config.host,
        'port': config.port,
        'user': config.user,
        'password': config.pass,
        'database': config.db,
        'charset': config.char,
        'multipleStatements': true
    }
}