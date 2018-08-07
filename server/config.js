const CONF = {
    // 域名
    host: '127.0.0.1',
    // 端口号
    port: '2080',

    // 允许请求白名单
    whitelist: [
        'http://127.0.0.1:8080'
    ],

    /**
     * MySQL 配置
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        db: 'mdm_editer',
        user: 'root',
        pass: 'root',
        char: 'utf8'
    }

}

module.exports = CONF
