const db = require('./db')
const dateFormat = require('dateformat')

// 递归生成菜单树方法
const createTree = (arr, obj, pid) => {
    for (let i = 0; i < arr.length; i++){
        if (arr[i].pid === pid){
            if (Array.isArray(obj.children)){
                obj.children.push(arr[i])
            } else {
                obj.children = [arr[i]]
            }
            createTree(arr, arr[i], arr[i].id)
        }
    }
}

// 创建当前时间
const createTime = () => dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss')

// 生成分页 limit sql
const generatePageSql = (pageNum, pageSize) => {
    pageNum  = pageNum > 0 ? Number(pageNum) : 1
    pageSize = pageSize > 0 ? Number(pageSize) : 10
    return db.format(` LIMIT ?, ?`, [(pageNum - 1) * pageSize, pageSize])
}

// 根据文件路径获取文件名
const getFileName = filePath => {
    const regExp = /\/\d+_\d{4}\.[a-zA-Z]{3,4}$/
    const result = filePath.toString().match(regExp)
    return Array.isArray(result) ? result[0] : ''
}

module.exports = { createTree, createTime, generatePageSql, getFileName }