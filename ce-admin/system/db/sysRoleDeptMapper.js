/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-22 15:03:27
 * @LastEditTime: 2022-03-31 09:45:27
 * @Description: ...每位新修改者自己的信息
 */


let deleteRoleDeptByRoleId = "delete from sys_role_dept where role_id=?"


let deleteRoleDept = (roleArray = []) => {
  let sqlString = "delete from sys_role_dept where role_id in"
  if (roleArray.length !== 0) sqlString += `(${roleArray.map(r => '?').join(',')})`
  return {
    sqlString,
    value: roleArray
  }
}



let batchRoleDept = (roles = {}) => {
  let { roleId, deptIds = [] } = roles
  let sqlString = "insert into sys_role_dept(role_id, dept_id) values " + deptIds.map(item => '(?,?)').join(',')
  return {
    sqlString,
    value: deptIds.map(item => `${roleId},${item}`).join(',').split(',')
  }
}



module.exports = {
  deleteRoleDept, deleteRoleDeptByRoleId, batchRoleDept
}