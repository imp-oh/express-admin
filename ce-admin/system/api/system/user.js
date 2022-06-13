/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-16 22:10:59
 * @LastEditTime: 2022-03-31 09:18:40
 * @Description: ...每位新修改者自己的信息
 * @RequestMapping("/system/user")
 */

const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const { formatTime, loginTime } = require('@/utils/validate')
const { bcryptEncrypt, rsaDecrypt } = require('@/utils/crypto')

const userService = require('@/system/service/sysUserServiceImpl')
const roleService = require('@/system/service/sysRoleServiceImpl')
const postService = require('@/system/service/sysPostServiceImpl')
const userConstants = require('@/enums/userConstants')




let errorTile = (user_name, title, userId) => { return { msg: `${userId ? '修改' : '新增'}用户'${user_name}'失败，${title}已存在`, code: 500 } }



/**
 * 获取用户列表
 * 
 * @PreAuthorize("@ss.hasPermi('system:user:list')")  
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let { user = {} } = req.loginUser
  let total = await userService.startPage(req.query, user)
  let getList = []
  if (total > 0) getList = await userService.selectUserList(req.query, user)

  res.send({
    rows: getList,
    code: 200,
    msg: "查询成功",
    total: total
  })
}





/**
 * 新增用户
 * @PreAuthorize("@ss.hasPermi('system:user:add')")
 */
let add = async (req, res) => {
  let { user } = req.loginUser
  let { userName, phonenumber, email, password } = req.body
  if (userConstants.NOT_UNIQUE === await userService.checkUserNameUnique(userName)) throw errorTile(userName, '登录账号')
  if (phonenumber && userConstants.NOT_UNIQUE === await userService.checkPhoneUnique(req.body)) throw errorTile(userName, '手机号码')
  if (email && userConstants.NOT_UNIQUE === await userService.checkEmailUnique(req.body)) throw errorTile(userName, '邮箱账号')
  req.body.password = bcryptEncrypt(password)
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await userService.insertUser(req.body)
  res.send({
    code: 200,
    msg: "操作成功",
  })
}



/**
 * 修改用户
 * @PreAuthorize("@ss.hasPermi('system:user:edit')")
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  let { userName, phonenumber, email } = req.body
  userService.checkUserAllowed(req.body)
  if (phonenumber && userConstants.NOT_UNIQUE === await userService.checkPhoneUnique(req.body)) throw errorTile(userName, '手机号码', 1)
  if (email && userConstants.NOT_UNIQUE === await userService.checkEmailUnique(req.body)) throw errorTile(userName, '邮箱账号', 1)
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await userService.updateUser(req.body)

  res.send({
    code: 200,
    msg: "操作成功"
  })
}




/**
 * 根据用户编号获取详细信息
 * 
 * @PreAuthorize hasPermi('system:user:query')
 * @GetMapping(value = { "/", "/{userId}" })
 */
const getInfo = async (req, res) => {
  let { user = {} } = req.loginUser
  let { userId } = req.params
  userId = userId || user.userId

  await userService.checkUserDataScope(userId, user)
  let roles = await roleService.selectRoleAll(user)
  if (!isUserAdmin(req.params.userId)) roles = roles.filter(r => !isRolesAdmin(r.roleId))
  let posts = await postService.selectPostAll()

  let ajax = {
    posts: posts || [],
    roles: roles || [],
    code: 200,
    msg: "操作成功"
  }
  if (req.params.userId) {
    ajax.data = await userService.selectUserById(req.params.userId)
    ajax.data.createTime = formatTime(ajax.data.createTime, 'yyyy-MM-dd HH:mm:ss')
    ajax.data.loginDate = formatTime(ajax.data.loginDate, 'yyyy-MM-dd HH:mm:ss')
    ajax.roleIds = ajax.data.roles.filter(i => i.roleId).map(item => item.roleId)
    ajax.postIds = await postService.selectPostListByUserId(req.params.userId)
  }


  res.send(ajax)
}





/**
 * 状态修改
 * 
 * @PreAuthorize("@ss.hasPermi('system:user:edit')")
 * @PutMapping("/changeStatus")
 */
const changeStatus = async (req, res) => {
  let { userId = '' } = req.body
  let { user } = req.loginUser

  // 表单验证
  await req.rules({
    userId: [{ required: true, message: 'userId 不能为空' }],
    status: [{ required: true, message: 'status 不能为空' }]
  }, req.body)

  await userService.checkUserAllowed(req.body)
  await userService.checkUserDataScope(userId, user)

  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await userService.updateUserStatus(req.body)
  res.send({
    msg: "操作成功",
    code: 200
  })
}



/**
 * 重置密码
 * 
 * @PreAuthorize("@ss.hasPermi('system:user:resetPwd')")
 * @PutMapping("/resetPwd")
 */
const resetPwd = async (req, res) => {
  let { userId, password } = req.body
  let { user } = req.loginUser

  userService.checkUserAllowed(req.body)
  await userService.checkUserDataScope(userId, user)

  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  const passwordDecrypt = rsaDecrypt(password)
  req.body.password = bcryptEncrypt(passwordDecrypt)

  await userService.resetPwd(req.body)

  res.send({
    msg: "操作成功",
    code: 200
  })
}




/**
 * 根据用户编号获取授权角色
 * 
 *  @PreAuthorize("@ss.hasPermi('system:user:query')")
 *  @GetMapping("/authRole/{userId}")
 */
let authRole = async (req, res) => {
  const { user } = req.loginUser
  const { userId } = req.params
  let userRow = await userService.selectUserById(userId);
  let roles = await roleService.selectRolesByUserId(userId, user);
  if (!isUserAdmin(userId)) roles = roles.filter(r => !isRolesAdmin(r.roleId))

  res.send({
    code: 200,
    msg: "操作成功",
    roles,
    user: userRow
  })
}


/**
 * 用户授权角色
 * @PreAuthorize("@ss.hasPermi('system:user:edit')")
 *  @PutMapping("/authRole")
 */
let insertAuthRole = async (req, res) => {
  const { user } = req.loginUser
  const { userId, roleIds = '' } = req.query
  let roleArray = []
  if (roleIds.length !== 0) roleArray = roleIds.split(',')
  await userService.checkUserDataScope(userId, user)
  await userService.insertUserAuth(userId, roleArray);

  res.send({
    code: 200,
    msg: "操作成功"
  })
}





/**
 * 删除用户
 *  @PreAuthorize("@ss.hasPermi('system:user:remove')")
 * @DeleteMapping("/{userIds}")
 */
let remove = async (req, res) => {
  let { user } = req.loginUser
  let { userIds } = req.params
  if (userIds.length === 0) throw { code: 500, msg: "数据列？" }
  const userArray = userIds.split(',')
  if (userArray.includes(user.userId)) throw { code: 500, msg: "当前用户不能删除" }
  await userService.deleteUserByIds(userArray, user)

  res.send({
    code: 200,
    msg: "操作成功"
  })
}



module.exports = {
  remove,
  insertAuthRole,
  authRole,
  edit,
  list,
  add,
  getInfo,
  changeStatus,
  resetPwd
}