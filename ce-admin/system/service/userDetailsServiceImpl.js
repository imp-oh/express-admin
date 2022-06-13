/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 14:23:13
 * @LastEditTime: 2022-03-30 13:44:09
 * @Description: 用户验证处理
 */
const userService = require('./sysUserServiceImpl')
const userStatus = require('@/enums/userStatus')
const permissionService = require('./sysPermissionService')
const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')

let error500 = (msg = "", code = 500) => {
  throw { code, msg, }
}


/**
 * 查询用户校验
 * @param {*} username 
 */
let loadUserByUsername = async (username) => {
  let userList = await userService.selectUserByUserName(username)
  let user = setUser(userList)
  if (!user) error500("登录用户：" + username + " 不存在")
  if (userStatus.DELETED === user.delFlag) error500("对不起，您的账号：" + username + " 已被删除")
  if (userStatus.DISABLE === user.delFlag) error500("对不起，您的账号：" + username + " 已停用");
  return await createLoginUser(user)
}


let setUser = (userList = []) => {
  if (userList.length === 0) return 
  let [user] = userList
  let roles = []
  userList.forEach(item => {
    roles.push({
      admin: isRolesAdmin(item.roleId),
      dataScope: item.dataScope,
      deptCheckStrictly: !!item.deptCheckStrictly,
      menuCheckStrictly: !!item.menuCheckStrictly,
      flag: false, //用户是否存在此角色标识 默认不存在
      roleId: item.roleId,
      roleKey: item.roleKey,
      roleName: item.roleName,
      roleSort: item.roleSort,
      status: item.roleStatus
    })
  })
  user.roles = roles

  return user
}


let createLoginUser = async (user) => {
  let permissions = await permissionService.getMenuPermission(user)
  user.admin = isUserAdmin(user.userId)
  user.dept = {
    children: [],
    deptId: user.deptId,
    deptName: user.deptName,
    leader: user.leader,
    orderNum: user.orderNum,
    parentId: user.parentId,
    status: user.deptStatus,
  }

  return { user, permissions }
}

module.exports = {
  setUser,
  loadUserByUsername,
}