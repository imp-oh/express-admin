/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-22 11:31:43
 * @LastEditTime: 2022-03-31 09:41:21
 * @Description: ...每位新修改者自己的信息
 */

let countUserRoleByRoleId = "select count(1) as countNum from sys_user_role where role_id= ? "


let batchUserRole = (roleArray = []) => {
  let sqlString = `insert into sys_user_role(user_id, role_id) values ` + roleArray.map(() => ' (?,?) ').join(',')
  let value = roleArray.map(item => `${item.userId},${item.roleId}`).join(',').split(',')
  return {
    sqlString,
    value
  }
}


let deleteUserRoleInfo = "delete from sys_user_role where user_id= ? and role_id= ?"

let deleteUserRoleInfos = (row) => {
  let { roleId, userIds } = row
  let sqlString = `delete from sys_user_role where role_id= ? and user_id in (${userIds.map(item => '?').join(',')})`
  userIds.unshift(roleId)
  return {
    sqlString,
    value: userIds
  }
}


let deleteUserRoleByUserId = "delete from sys_user_role where user_id=? "


let deleteUserRole = (userIds = []) => {
  let sqlString = `delete from sys_user_role where user_id in (${userIds.map(item => '?').join(',')})`
  return {
    sqlString,
    value: userIds
  }
}

module.exports = {
  deleteUserRole,
  deleteUserRoleByUserId,
  countUserRoleByRoleId,
  batchUserRole,
  deleteUserRoleInfo,
  deleteUserRoleInfos
}
