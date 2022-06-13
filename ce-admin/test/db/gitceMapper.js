
const { handlePage, sqlFunKey } = require('@/utils/mysql')


let selectDeptVo = "SELECT * FROM sys_dept "

let selectDeptList = (rows = {}) => {
    let sqlString = selectDeptVo

    let sqlarr = [
        {
            key: 'deptId',
            sql: ' AND dept_id = ? ',
            isNotZero: true // 条件
        }
    ]

    let sqlRow = sqlFunKey(rows, sqlarr)
    if (sqlRow.value.length > 0) sqlRow += " WHERE "
    sqlString += sqlRow.sqlString

    return {
        sqlString,
        value: sqlRow.value
    }
}

module.exports = {
    selectDeptList
}