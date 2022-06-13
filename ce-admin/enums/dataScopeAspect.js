/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-23 13:28:49
 * @LastEditTime: 2022-03-23 16:16:43
 * @Description: ...每位新修改者自己的信息
 */

const { isUserAdmin } = require('@/utils/permissions')
const mysql = require('mysql')

const DATA_SCOPE_ALL = "1",  // 全部数据权限
  DATA_SCOPE_CUSTOM = "2",  // 自定数据权限
  DATA_SCOPE_DEPT = "3", // 部门数据权限
  DATA_SCOPE_DEPT_AND_CHILD = "4", // 部门及以下数据权限
  DATA_SCOPE_SELF = "5", // 仅本人数据权限
  DATA_SCOPE = "dataScope"; // 数据权限过滤关键字


let handleDataScope = (row) => {
  let { deptAlias, userAlias, loginUser } = row
  if (!loginUser.userId) return ''
  // 如果是超级管理员，则不过滤数据
  if (isUserAdmin(loginUser.userId)) return ''
  return dataScopeFilter(row)
}


/**
 *  注意前面一个空格 
 * @param {*} row 
 * @returns 
 */
let dataScopeFilter = (row) => {
  let { deptAlias, userAlias, loginUser } = row
  let sqlString = ""
  for (var i in loginUser.roles) {
    let item = loginUser.roles[i]
    if (DATA_SCOPE_ALL === item.dataScope) {
      sqlString = ""
      break
    } else if (DATA_SCOPE_CUSTOM === item.dataScope) {
      sqlString += ` OR ${deptAlias}.dept_id IN ( SELECT dept_id FROM sys_role_dept WHERE role_id = ${mysql.escape(item.roleId)} ) `
    } else if (DATA_SCOPE_DEPT === item.dataScope) {
      sqlString += ` OR ${deptAlias}.dept_id = ${mysql.escape(loginUser.deptId)} `
    } else if (DATA_SCOPE_DEPT_AND_CHILD === item.dataScope) {
      sqlString += ` OR ${deptAlias}.dept_id IN ( SELECT dept_id FROM sys_dept WHERE dept_id = ${mysql.escape(loginUser.deptId)} or find_in_set( ${mysql.escape(loginUser.deptId)} , ancestors ) )`
    } else if (DATA_SCOPE_SELF === item.dataScope) {
      if (userAlias) {
        sqlString += ` OR ${userAlias}.user_id = ${mysql.escape(loginUser.userId)} `
      } else {
        // 数据权限为仅本人且没有userAlias别名不查询任何数据
        sqlString += " OR 1=0 "
      }
    }
  }

  if (sqlString.length !== 0) {
    sqlString = ` AND (${sqlString.substring(4)}) `
  }
  return sqlString
}


module.exports = {
  handleDataScope
}