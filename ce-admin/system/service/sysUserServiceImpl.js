/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 14:32:06
 * @LastEditTime: 2022-03-31 09:12:10
 * @Description: ...每位新修改者自己的信息
 */

const dbconfig = require("@/config/dbconfig")
let userMapper = require('@/system/db/sysUserMapper')
let userPostMapper = require('@/system/db/sysUserPostMapper')
let userRoleMapper = require('@/system/db/sysUserRoleMapper')
let roleMapper = require('@/system/db/sysRoleMapper')
let postMapper = require('@/system/db/sysPostMapper')

const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const { formatTime } = require('@/utils/validate')
const userConstants = require('@/enums/userConstants')


/**
 * 通过用户名查询用户
 * 
 * @param userName 用户名
 * @return 用户对象信息
 */

let selectUserByUserName = async (userName) => {
  let userRows = await dbconfig.sqlConnect(userMapper.selectUserByUserName, userName, 'yyyy-MM-dd HH:mm:ss')
  return userRows
}




/**
 * 根据条件分页查询用户总条数
 * 
 * @param user 用户信息
 * @param loginUser 登录用户信息
 * @return 用户信息集合信息
 * 
 * @DataScope(deptAlias = "d", userAlias = "u")
 */
let startPage = async (user = {}, loginUser = {}) => {
  let db = userMapper.startPage(user, loginUser)
  let [start] = await dbconfig.sqlConnect(db.sqlString, db.value)
  return Number(start.countNum)
}



/**
 * 根据条件分页查询用户列表
 * 
 * @param user 用户信息
 * @return 用户信息集合信息
 * @DataScope(deptAlias = "d", userAlias = "u")
 */
let selectUserList = async (user = {}, loginUser = {}) => {
  let db = userMapper.selectUserList(user, loginUser)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value)

  list.forEach(item => {
    item.admin = isUserAdmin(item.userId)
    item.status = item.status
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss')
    item.loginDate = formatTime(item.loginDate, 'yyyy-MM-dd HH:mm:ss')
    item.params = {}
    item.userId = Number(item.userId)
    item.deptId = Number(item.deptId)
    item.dept = {
      deptId: item.deptId,
      searchValue: null,
      createBy: item.createBy,
      createTime: item.createTime,
      updateBy: null,
      updateTime: null,
      remark: item.remark,
      params: {},
      parentId: null,
      ancestors: null,
      deptName: item.deptName,
      orderNum: null,
      leader: item.leader,
      phone: null,
      email: item.email,
      status: null,
      delFlag: null,
      parentName: null,
      children: []
    }
    delete item.PASSWORD
    delete item.STATUS
  })

  return list
}


/**
 * 校验用户是否允许操作
 * 
 * @param user 用户信息
 */
let checkUserAllowed = (user = {}) => {
  if (user.userId && isUserAdmin(String(user.userId))) throw { code: 500, msg: "不允许操作超级管理员用户" }
}


/**
 * 校验用户是否有数据权限
 * 
 * @param userId 用户id
 * @param loginUser  用户登录信息
 * 
 */
let checkUserDataScope = async (userId = '', loginUser = {}) => {
  if (!isUserAdmin(String(userId))) {
    let db = userMapper.selectUserList({ userId }, loginUser)
    let users = await dbconfig.sqlConnect(db.sqlString, db.value)
    if (users.length === 0) throw { code: 500, msg: "没有权限访问用户数据!" }
  }
}


/**
 * 修改用户状态
 * 
 * @param user 用户信息
 * @return 结果
 */
let updateUserStatus = async (user = {}) => {
  let db = userMapper.updateUser(user)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}



/**
 * 通过用户ID查询用户
 * 
 * @param userId 用户ID
 * @return 用户对象信息
 */
let selectUserById = async (userId) => {
  let sysUser = await dbconfig.sqlConnect(userMapper.selectUserById, userId)
  let [user = {}] = sysUser
  let roles = []
  sysUser.forEach(item => {
    delete item.password
    roles.push({
      "createBy": item.createBy,
      "remark": item.remark,
      "roleId": item.roleId,
      "roleName": item.roleName,
      "roleKey": item.roleKey,
      "roleSort": item.roleSort,
      "dataScope": item.dataScope,
      "status": item.roleStatus,
      "delFlag": item.delFlag,
      "flag": false,
      "admin": isRolesAdmin(item.roleId)
    })
  })
  user.roles = roles
  user.dept = {
    status: user.deptStatus,
    deptId: Number(user.deptId),
    parentId: Number(user.parentId),
    deptName: user.deptName,
    orderNum: user.orderNum,
    leader: user.leader,
  }

  user.postIds = null
  user.roleIds = null
  return user
}


/**
 * 校验用户名称是否唯一
 * 
 * @param userName 用户名称
 * @return 结果
 */
let checkUserNameUnique = async (userName) => {
  let [count] = await dbconfig.sqlConnect(userMapper.checkUserNameUnique, userName)
  return count.countNum
}


/**
 * 校验手机号码是否唯一
 *
 * @param user 用户信息
 * @return
 */
let checkPhoneUnique = async (user = {}) => {
  let [info] = await dbconfig.sqlConnect(userMapper.checkPhoneUnique, user.phonenumber)
  if (info && info.userId != user.userId) return userConstants.NOT_UNIQUE;
  return userConstants.UNIQUE;
}


/**
 * 校验email是否唯一
 *
 * @param user 用户信息
 * @return
 */
let checkEmailUnique = async (user = {}) => {
  let [info] = await dbconfig.sqlConnect(userMapper.checkEmailUnique, user.email)
  if (info && info.userId != user.userId) return userConstants.NOT_UNIQUE;
  return userConstants.UNIQUE;
}



/**
 * 新增保存用户信息
 * 
 * @param user 用户信息
 * @return 结果
 */
let insertUser = async (user = {}) => {
  // 新增用户信息
  let db = userMapper.insertUser(user);
  let insert = await dbconfig.sqlConnect(db.sqlString, db.value)

  // 新增用户岗位关联
  await insertUserPost(user, insert.insertId);

  // // 新增用户与角色管理
  await insertUserRole(user, insert.insertId);

}



/**
 * 新增用户岗位信息
 * 
 * @param user 用户对象
 * @param userId 新增用户ID
 */
let insertUserPost = async (user = {}, userId) => {
  let { postIds = [] } = user
  if (postIds.length === 0) return
  let db = userPostMapper.batchUserPost(postIds, userId);
  await dbconfig.sqlConnect(db.sqlString, db.value)
}



/**
 * 新增用户角色信息
 * 
 * @param user 用户对象
 * @param userId 新增用户ID
 */
let insertUserRole = async (user = {}, userId) => {
  let { roleIds = [] } = user
  if (roleIds.length === 0) return

  let roleArray = []
  roleIds.forEach(item => {
    roleArray.push({
      roleId: item,
      userId
    })
  })

  let db = userRoleMapper.batchUserRole(roleArray);
  await dbconfig.sqlConnect(db.sqlString, db.value)

}




/**
 * 修改保存用户信息
 * 
 * @param user 用户信息
 * @return 结果
 */
let updateUser = async (user = {}) => {
  let { userId } = user
  // 删除用户与角色关联
  await dbconfig.sqlConnect(userRoleMapper.deleteUserRoleByUserId, userId)
  // 新增用户与角色管理
  insertUserRole(user, userId);
  // 删除用户与岗位关联
  await dbconfig.sqlConnect(userPostMapper.deleteUserPostByUserId, userId)
  // // 新增用户与岗位管理
  insertUserPost(user, userId);

  let db = userMapper.updateUser(user)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}




/**
 * 用户授权角色
 * 
 * @param userId 用户ID
 * @param roleIds 角色组
 */
let insertUserAuth = async (userId = '', roleIds = []) => {
  await dbconfig.sqlConnect(userRoleMapper.deleteUserRoleByUserId, userId)
  insertUserRole({ roleIds }, userId);
}


/**
 * 重置用户密码
 * 
 * @param user 用户信息
 * @return 结果
 */
let resetPwd = async (user = {}) => {
  let db = userMapper.updateUser(user);
  await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 批量删除用户信息
 * 
 * @param userIds 需要删除的用户ID
 * @param loginUser 用户登录信息
 * @return 结果
 */
let deleteUserByIds = async (userIds = [], loginUser = {}) => {
  for (var i in userIds) {
    let userId = userIds[i]
    checkUserAllowed({ userId })
    await checkUserDataScope(userId, loginUser)
  }
  // 删除用户与角色关联
  let dbRole = userRoleMapper.deleteUserRole(userIds)
  await dbconfig.sqlConnect(dbRole.sqlString, dbRole.value)

  // 删除用户与岗位关联
  let dbPost = userPostMapper.deleteUserPost(userIds)
  await dbconfig.sqlConnect(dbPost.sqlString, dbPost.value)

  let dbUser = userMapper.deleteUserByIds(userIds)
  await dbconfig.sqlConnect(dbUser.sqlString, dbUser.value)
}


/**
 * 根据条件分页查询已分配用户角色列表
 * 
 * @param user 用户信息
 * @param loginUser 用户登录信息
 * @return 用户信息集合信息
 * 
 * @DataScope(deptAlias = "d", userAlias = "u")
 */
let selectAllocatedList = async (user = {}, loginUser = {}) => {
  let db = userMapper.selectAllocatedList(user, loginUser);
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 根据条件分页查询用户总条数
 * 
 * @param user 用户信息
 * @param loginUser 登录用户信息
 * @return 用户信息集合信息
 * 
 * @DataScope(deptAlias = "d", userAlias = "u")
 */
let selectAllocatedListTotal = async (user = {}, loginUser = {}) => {
  let db = userMapper.selectAllocatedListTotal(user, loginUser)
  let [start] = await dbconfig.sqlConnect(db.sqlString, db.value)
  return Number(start.countNum)
}


/**
 * 查询用户所属角色组
 * 
 * @param userName 用户名
 * @return 结果
 */
let selectUserRoleGroup = async (userName = '') => {
  let list = await dbconfig.sqlConnect(roleMapper.selectRolesByUserName, userName)
  let roleList = list.map(item => item.roleName)
  return roleList.join(',')
}


/**
 * 查询用户所属岗位组
 * 
 * @param userName 用户名
 * @return 结果
 */
let selectUserPostGroup = async (userName) => {
  let list = await dbconfig.sqlConnect(postMapper.selectPostsByUserName, userName)
  let postList = list.map(item => item.postName)
  return postList.join(',')
}


/**
 * 修改用户基本信息
 * 
 * @param user 用户信息
 * @return 结果
 */
let updateUserProfile = async (user = {}) => {
  let db = userMapper.updateUser(user);
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  return affectedRows
}

/**
 * 重置用户密码
 * 
 * @param userName 用户名
 * @param password 密码
 * @return 结果
 */
let resetUserPwd = async (userName, password) => {
  let { affectedRows } = await dbconfig.sqlConnect(userMapper.resetUserPwd, [password, userName]);
  return affectedRows
}


/**
 * 修改用户头像
 * 
 * @param userName 用户名
 * @param avatar 头像地址
 * @return 结果
 */
let updateUserAvatar = async (userName, avatar) => {
  let { affectedRows } = await dbconfig.sqlConnect(userMapper.updateUserAvatar, [avatar, userName])
  return affectedRows > 0
}

module.exports = {
  updateUserAvatar,
  resetUserPwd,
  updateUserProfile,
  selectUserPostGroup,
  selectUserRoleGroup,
  selectAllocatedListTotal,
  selectAllocatedList,
  deleteUserByIds,
  resetPwd,
  insertUserAuth,
  updateUser,
  insertUser,
  checkEmailUnique,
  checkPhoneUnique,
  checkUserNameUnique,
  selectUserById,
  updateUserStatus,
  checkUserDataScope,
  checkUserAllowed,
  selectUserList,
  startPage,
  selectUserByUserName
}