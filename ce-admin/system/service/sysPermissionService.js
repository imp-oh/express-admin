/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 15:17:41
 * @LastEditTime: 2022-03-28 16:39:49
 * @Description: ...每位新修改者自己的信息
 */
const { isUserAdmin } = require('@/utils/permissions')
const menuService = require('./sysMenuServiceImpl')

/**
 * 获取菜单数据权限
 * 
 * @param user 用户信息
 * @return 菜单权限信息
 */

let getMenuPermission = async (user) => {
  let perms = []
  if (isUserAdmin(user.userId)) {
    perms.push("*:*:*")
  } else {
    perms = await menuService.selectMenuPermsByUserId(user.userId)
  }
  return perms
}



/**
 * 获取角色数据权限
 * 
 * @param user 用户信息
 * @return 角色权限信息
 */
let getRolePermission = (user = {}) => {
  let { roles = [], userId } = user
  return isUserAdmin(userId) ? ['admin'] : roles.map(item => item.roleKey)
}

module.exports = {
  getMenuPermission,
  getRolePermission
}

