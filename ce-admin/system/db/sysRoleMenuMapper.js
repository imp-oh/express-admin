/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-22 10:14:57
 * @LastEditTime: 2022-03-31 09:43:25
 * @Description: ...每位新修改者自己的信息
 */




let batchRoleMenu = (menuId = [], roleId) => {
  let sqlString = `insert into sys_role_menu(role_id, menu_id) values ${menuId.map(() => " (?,?) ").join(',')}`
  let value = menuId.map(item => `${roleId},${item}`).join(',').split(',')
  return {
    sqlString,
    value
  }
}

let checkMenuExistRole = "select count(1) as countNum  from sys_role_menu where menu_id = ?"



let deleteRoleMenuByRoleId = "delete from sys_role_menu where role_id= ? "


let deleteRoleMenu = (roleArray = []) => {
  let sqlString = "delete from sys_role_menu where role_id in"
  if (roleArray.length !== 0) sqlString += `(${roleArray.map(r => '?').join(',')})`

  return {
    sqlString,
    value: roleArray
  }
}

module.exports = {
  batchRoleMenu, checkMenuExistRole, deleteRoleMenuByRoleId, deleteRoleMenu
}
