/**
 * @Author: jzy
 * @Date: 2016/10/17
 * @Last Modified by: jzy
 * @Last Modified time: 2016/10/17
 */
const mysql = require('mysql')
const database = require('./database')

database.connection.connectionLimit = 10
module.exports = mysql.createPool(database.connection)
