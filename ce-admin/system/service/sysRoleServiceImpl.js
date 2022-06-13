/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-25 13:20:36
 * @LastEditTime: 2022-03-31 09:48:05
 * @Description: 公告模块
 */
const dbconfig = require("@/config/dbconfig")
const { batchUserRole, deleteUserRoleInfos } = require('@/system/db/sysUserRoleMapper')
const userRoleMapper = require('@/system/db/sysUserRoleMapper')

const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
// const { selectRoleList } = require('@/system/db/sysRoleMapper')
const { formatTime, loginTime } = require('@/utils/validate')
const { numberFun } = require('@/utils/mysql')
const roleMapper = require('@/system/db/sysRoleMapper')
const roleMenuMapper = require('@/system/db/sysRoleMenuMapper')
const roleDeptMapper = require('@/system/db/sysRoleDeptMapper')


const userConstants = require('@/enums/userConstants')


/**
 * 批量选择授权用户角色
 * 
 * @param roleId 角色ID
 * @param userIds 需要授权的用户数据ID
 * @return 结果
 */

let insertAuthUsers = async (row = {}) => {
  let { roleId, userIds } = row
  if (userIds.length == 0) throw Error('数据错误')
  // 新增用户与角色管理
  let userIdArr = userIds.split(',')

  let roleArray = []
  userIdArr.forEach(item => {
    roleArray.push({
      roleId: roleId,
      userId: item
    })
  })

  let insert = batchUserRole(roleArray)
  await dbconfig.sqlConnect(insert.sqlString, insert.value)
}


/**
 * 校验角色是否有数据权限
 * 
 * @param roleId 角色id
 * @param loginUser 登录用户信息
 */
let checkRoleDataScope = async (roleId = '', loginUser = {}) => {
  if (!isUserAdmin(loginUser.userId)) {
    let roleIdConn = roleMapper.selectRoleList({ roleId }, loginUser)
    let roles = await dbconfig.sqlConnect(roleIdConn.sqlString, roleIdConn.value)
    if (roles.length === 0) throw Error("没有权限访问角色数据！");
    return roles
  }
}

/**
 * 批量取消授权用户角色
 * 
 * @param roleId 角色ID
 * @param userIds 需要取消授权的用户数据ID
 * @return 结果
 */
let deleteAuthUsers = async (row) => {
  let { userIds } = row
  if (userIds.length == 0) throw Error('数据错误')
  row.userIds = userIds.split(',')
  let deleteItem = deleteUserRoleInfos(row)
  await dbconfig.sqlConnect(deleteItem.sqlString, deleteItem.value)
}




/**
 * 查询所有角色
 * @param loginUser  登录用户信息
 * 
 * @return 角色列表
 */
let selectRoleAll = async (loginUser = {}) => {
  // let { userId } = loginUser
  let db = roleMapper.selectRoleList({}, loginUser)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value)

  // if (!isUserAdmin(userId)) list = list.filter(r => !isRolesAdmin(r.roleId))
  list.forEach(item => {
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss')
    item.admin = isUserAdmin(item.roleId)
    item.deptCheckStrictly = !!item.deptCheckStrictly
    item.menuCheckStrictly = !!item.menuCheckStrictly
    item.flag = false
  })

  return list
}


/**
 * 根据用户ID查询角色
 * 
 * @param userId 用户ID
 * @param loginUser 登录用户信息
 * @return 角色列表
 */
let selectRolesByUserId = async (userId = '', loginUser) => {
  let userRoles = await dbconfig.sqlConnect(roleMapper.selectRolePermissionByUserId, userId);
  let userRolesIds = userRoles.map(item => item.roleId)
  let roles = await selectRoleAll(loginUser)
  roles.forEach(item => {
    item.flag = userRolesIds.includes(item.roleId)
  })
  return roles
}



/**
 * 根据条件分页查询角色数据总条数
 * 
 * @param role 角色信息
 * @param loginUser 登录用户信息
 * @return 角色数据集合信息
 * @DataScope(deptAlias = "d")
 */

let startPage = async (role = {}, loginUser = {}) => {
  let db = roleMapper.startPage(role, loginUser)
  let [start] = await dbconfig.sqlConnect(db.sqlString, db.value)
  return Number(start.countNum)
}




/**
 * 根据条件分页查询角色数据
 * 
 * @param role 角色信息
 * @param loginUser 登录用户信息
 * @return 角色数据集合信息
 * 
 * @DataScope(deptAlias = "d")
 */
let selectRoleList = async (role = {}, loginUser = {}) => {
  let db = roleMapper.selectRoleList(role, loginUser)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value)
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    item.roleId = Number(item.roleId)
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss')
  }

  return list
}




/**
 * 校验角色名称是否唯一
 * 
 * @param role 角色信息
 * @return 结果
 */
let checkRoleNameUnique = async (role = {}) => {
  let [info] = await dbconfig.sqlConnect(roleMapper.checkRoleNameUnique, role.roleName)
  if (info && info.roleId != role.roleId) return userConstants.NOT_UNIQUE
  return userConstants.UNIQUE;
}


/**
 * 校验角色权限是否唯一
 * 
 * @param role 角色信息
 * @return 结果
 */
let checkRoleKeyUnique = async (role = {}) => {
  let [info] = await dbconfig.sqlConnect(roleMapper.checkRoleKeyUnique, role.roleKey)
  if (info && info.roleId != role.roleId) return userConstants.NOT_UNIQUE
  return userConstants.UNIQUE;
}



/**
 * 新增保存角色信息
 * 
 * @param role 角色信息
 * @return 结果
 */
let insertRole = async (role = {}) => {
  role.menuCheckStrictly = numberFun(role.menuCheckStrictly)
  role.deptCheckStrictly = numberFun(role.deptCheckStrictly)
  // 新增角色信息
  let db = roleMapper.insertRole(role)
  let insert = await dbconfig.sqlConnect(db.sqlString, db.value)
  await insertRoleMenu(role, insert.insertId);
}


/**
 * 新增角色菜单信息
 * 
 * @param role 角色对象
 * @param roleId 角色id
 */
let insertRoleMenu = async (role = {}, roleId) => {
  let { menuIds = [] } = role
  let rows = 1;
  if (menuIds.length === 0) return rows
  // 新增用户与角色管理
  let db = roleMenuMapper.batchRoleMenu(menuIds, roleId)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  return affectedRows
}



/**
 * 通过角色ID查询角色
 * 
 * @param roleId 角色ID
 * @return 角色对象信息
 */
let selectRoleById = async (roleId = '') => {
  let [info] = await dbconfig.sqlConnect(roleMapper.selectRoleById, roleId)
  info.menuCheckStrictly = !!info.menuCheckStrictly
  info.deptCheckStrictly = !!info.deptCheckStrictly
  info.createTime = formatTime(info.createTime, 'yyyy-MM-dd HH:mm:ss')
  return info
}



/**
  * 校验角色是否允许操作
  * 
  * @param role 角色信息
  */
let checkRoleAllowed = (role = {}) => {
  let { roleId = '' } = role
  if (roleId && isRolesAdmin(roleId)) throw { code: 500, msg: "不允许操作超级管理员角色" }
}


/**
 * 修改保存角色信息
 * 
 * @param role 角色信息
 * @return 结果
 */
let updateRole = async (role = {}) => {
  role.menuCheckStrictly = numberFun(role.menuCheckStrictly)
  role.deptCheckStrictly = numberFun(role.deptCheckStrictly)
  // 修改角色信息
  let db = roleMapper.updateRole(role)
  await dbconfig.sqlConnect(db.sqlString, db.value)

  // 删除角色与菜单关联
  await dbconfig.sqlConnect(roleMenuMapper.deleteRoleMenuByRoleId, role.roleId)
  return await insertRoleMenu(role, role.roleId);
}


/**
 * 修改角色状态
 * 
 * @param role 角色信息
 * @return 结果
 */

let updateRoleStatus = async (role = {}) => {
  let db = roleMapper.updateRole(role)
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 新增角色部门信息(数据权限)
 *
 * @param role 角色对象
 */
let insertRoleDept = async (role = {}) => {
  let { deptIds = [] } = role
  let rows = 1;
  if (deptIds.length === 0) return rows

  // 新增用户与角色管理
  let db = roleDeptMapper.batchRoleDept(role)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  return affectedRows
}



/**
 * 修改数据权限信息
 * 
 * @param role 角色信息
 * @return 结果
 */
let authDataScope = async (role = {}) => {
  // 修改角色信息
  let dbUpdata = roleMapper.updateRole(role)
  await dbconfig.sqlConnect(dbUpdata.sqlString, dbUpdata.value)

  // 删除角色与部门关联
  await dbconfig.sqlConnect(roleDeptMapper.deleteRoleDeptByRoleId, role.roleId)

  // 新增角色和部门信息（数据权限）
  return await insertRoleDept(role);
}



/**
 * 取消授权用户角色
 * 
 * @param userRole 用户和角色关联信息
 * @return 结果
 */
let deleteAuthUser = async (userRole = {}) => {
  let { userId, roleId } = userRole
  await dbconfig.sqlConnect(userRoleMapper.deleteUserRoleInfo, [userId, roleId])
}


/**
 * 通过角色ID查询角色使用数量
 * 
 * @param roleId 角色ID
 * @return 结果
 */
let countUserRoleByRoleId = async (roleId = '') => {
  let [info] = await dbconfig.sqlConnect(userRoleMapper.countUserRoleByRoleId, roleId)
  return Number(info.countNum)
}




/**
 * 批量删除角色信息
 * 
 * @param roleIds 需要删除的角色ID
 * @param loginUser 用户登录信息
 * @return 结果
 */
let deleteRoleByIds = async (roleIds = [], loginUser = {}) => {
  for (let i = 0; i < roleIds.length; i++) {
    let roleId = roleIds[i]
    await checkRoleAllowed({ roleId })
    await checkRoleDataScope(roleId, loginUser)
    let role = await selectRoleById(roleId)
    if (await countUserRoleByRoleId(roleId) > 0) throw { code: 500, msg: `${role.roleName}已分配,不能删除` }
  }
  // 删除角色与菜单关联
  let dbMenu = roleMenuMapper.deleteRoleMenu(roleIds)
  await dbconfig.sqlConnect(dbMenu.sqlString, dbMenu.value);

  // 删除角色与部门关联
  let dbDept = roleDeptMapper.deleteRoleDept(roleIds)
  await dbconfig.sqlConnect(dbDept.sqlString, dbDept.value);

  let dbRole = roleMapper.deleteRoleByIds(roleIds)
  return  await dbconfig.sqlConnect(dbRole.sqlString, dbRole.value);

}

module.exports = {
  deleteRoleByIds,
  deleteAuthUser,
  authDataScope,
  updateRoleStatus,
  updateRole,
  checkRoleAllowed,
  selectRoleById,
  insertRole,
  checkRoleKeyUnique,
  checkRoleNameUnique,
  selectRoleList,
  startPage,
  selectRolesByUserId,
  selectRoleAll,
  insertAuthUsers,
  checkRoleDataScope,
  deleteAuthUsers
}