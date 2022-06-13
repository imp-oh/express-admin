const dbconfig = require('@/config/dbconfig')
const gitceMapper = require('../db/gitceMapper')


/** 查询部门list */
const selectDeptList = async (dept = {}) => {
    let db = gitceMapper.selectDeptList(dept)
    let rows = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss') // 第3个参数，不添加时间不会格式化
    return rows || []
}

/** 查询部门总条数 */
const selectTotal = async (dept = {}) => {
    let body = JSON.parse(JSON.stringify(dept))
    delete body.pageNum
    delete body.pageSize
    let db = gitceMapper.selectDeptList(body)
    let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
    let [info] = await dbconfig.sqlConnect(sqlString, db.value)
    return Number(info.countNum)
}



module.exports = {
    selectDeptList,
    selectTotal
}