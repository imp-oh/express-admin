/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-20 20:07:44
 * @LastEditTime: 2022-03-31 09:48:29
 * @Description: ...每位新修改者自己的信息
 */



const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const { formatTime, loginTime } = require('@/utils/validate')

const roleService = require('@/system/service/sysRoleServiceImpl')
const userConstants = require('@/enums/userConstants')
const permissionService = require('@/system/service/sysPermissionService')
const tokenService = require('@/system/service/tokenService')
const userService = require('@/system/service/sysUserServiceImpl')
const userDetailsService = require('@/system/service/userDetailsServiceImpl')


let errorTile = (name, title, userId) => { return { msg: `${userId ? '修改' : '新增'}角色'${name}'失败，${title}已存在`, code: 500 } }




/**
 * 角色列表
 * @PreAuthorize("@ss.hasPermi('system:role:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let { user } = req.loginUser

  let total = await roleService.startPage(req.query, user)
  let rows = []
  if (total) rows = await roleService.selectRoleList(req.query, user)

  res.send({
    code: 200,
    msg: "操作成功",
    rows,
    total
  })
}






/**
 * 添加角色
 * 
 * @PreAuthorize("@ss.hasPermi('system:role:add')")
 */
const add = async (req, res) => {
  let { user = {} } = req.loginUser
  let { roleName } = req.body
  if (userConstants.NOT_UNIQUE === await roleService.checkRoleNameUnique(req.body)) throw errorTile(roleName, "角色名称")
  if (userConstants.NOT_UNIQUE === await roleService.checkRoleKeyUnique(req.body)) throw errorTile(roleName, "角色权限")

  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await roleService.insertRole(req.body)

  res.send({
    code: 200,
    msg: "操作成功"
  })
}






/**
 * 修改保存角色
 * @PreAuthorize("@ss.hasPermi('system:role:edit')")
 */
const edit = async (req, res) => {
  let { user = {} } = req.loginUser
  let { roleName, roleId } = req.body

  roleService.checkRoleAllowed(req.body)
  roleService.checkRoleDataScope(roleId, user)
  if (userConstants.NOT_UNIQUE === await roleService.checkRoleNameUnique(req.body)) throw errorTile(roleName, "角色名称", 1)
  if (userConstants.NOT_UNIQUE === await roleService.checkRoleKeyUnique(req.body)) throw errorTile(roleName, "角色权限", 1)

  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

  if (await roleService.updateRole(req.body) > 0 && !isUserAdmin(user.userId)) {
    // 更新用户缓存
    req.loginUser.permissions = await permissionService.getMenuPermission(user) // 获取新的用户权限，并更新缓存
    let userList = await userService.selectUserByUserName(user.userName)
    let userRow = userDetailsService.setUser(userList)
    user.roles = userRow.roles
    tokenService.setLoginUser(req.loginUser)
  }

  res.send({
    code: 200,
    msg: "操作成功"
  })
}







/**
 * 根据角色编号获取详细信息
 * 
 * @PreAuthorize("@ss.hasPermi('system:role:query')")
 * @GetMapping(value = "/{roleId}")
 */
let getInfo = async (req, res) => {
  let { user } = req.loginUser
  const { roleId } = req.params
  await roleService.checkRoleDataScope(roleId, user);
  let userItem = await roleService.selectRoleById(roleId)
  res.send({
    code: 200,
    data: userItem,
    msg: "操作成功"
  })
}







/**
 * 状态修改
 * @PreAuthorize("@ss.hasPermi('system:role:edit')")
 * @PutMapping("/changeStatus")
 */
let changeStatus = async (req, res) => {
  let { roleId } = req.body
  let { user } = req.loginUser

  await roleService.checkRoleAllowed(req.body);
  await roleService.checkRoleDataScope(roleId, user);


  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await roleService.updateRoleStatus(req.body)


  res.send({
    code: 200,
    msg: "操作成功",
  })
}










/**
 * 删除角色
 * @PreAuthorize("@ss.hasPermi('system:role:remove')")
 * @DeleteMapping("/{roleIds}")
 */
const remove = async (req, res) => {
  let { user } = req.loginUser
  let { roleIds = '' } = req.params
  let roleArray = roleIds.length !== 0 ? roleIds.split(',') : []
  await roleService.deleteRoleByIds(roleArray, user)

  res.send({
    code: 200,
    msg: "操作成功"
  })
}




/**
 * 修改保存数据权限
 * @PreAuthorize("@ss.hasPermi('system:role:edit')")
 * @PutMapping("/dataScope")
 */

let dataScope = async (req, res) => {
  const { user } = req.loginUser
  const { roleId } = req.body

  roleService.checkRoleAllowed(req.body)
  roleService.checkRoleDataScope(roleId, user)

  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  req.body.updateBy = user.userName
  await roleService.authDataScope(req.body)

  res.send({
    code: 200,
    msg: "操作成功"
  })
}








module.exports = {
  add,
  edit,
  list,
  changeStatus,
  getInfo,
  remove,
  dataScope
}