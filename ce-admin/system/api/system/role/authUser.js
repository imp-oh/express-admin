/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-25 10:30:36
 * @LastEditTime: 2022-03-31 09:25:32
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const { formatTime, loginTime } = require('@/utils/validate')
const { selectAllocatedList, selectAllocatedListTotal, selectUnallocatedList, selectUnallocatedListTotal } = require('@/system/db/sysUserMapper')
const userService = require('@/system/service/sysUserServiceImpl')
const { deleteUserRoleInfo } = require('@/system/db/sysUserRoleMapper')
const { checkRoleDataScope, insertAuthUsers, deleteAuthUsers } = require('@/system/service/sysRoleServiceImpl')
const roleService = require('@/system/service/sysRoleServiceImpl')

/**
 * 查询已分配用户角色列表
 * @PreAuthorize("@ss.hasPermi('system:role:list')")
 * @GetMapping("/authUser/allocatedList")
 */

let allocatedList = async (req, res) => {
  let { user } = req.loginUser
  let total = await userService.selectAllocatedListTotal(req.query, user)
  let rows = []
  if (total > 0) rows = await userService.selectAllocatedList(req.query, user);


  res.send({
    code: 200,
    rows: rows || [],
    msg: "查询成功",
    total: total
  })
}




/**
 * 查询未分配用户角色列表
 */
let unallocatedList = async (req, res) => {
  let { user } = req.loginUser
  let totalConn = selectUnallocatedListTotal(req.query, user)
  let [totalItem] = await dbconfig.sqlConnect(totalConn.sqlString, totalConn.value)
  let listConn = selectUnallocatedList(req.query, user)
  let rows = await dbconfig.sqlConnect(listConn.sqlString, listConn.value)
  rows.forEach(item => {
    item.admin = isUserAdmin(item.userId)
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss');
    item.dept = {
      deptId: item.deptId
    }
  })
  res.send({
    code: 200,
    rows: rows || [],
    msg: "查询成功",
    total: Number(totalItem.total || 0)
  })
}


/**
 * 批量选择用户授权
 * @PreAuthorize("@ss.hasPermi('system:role:edit')")
 * @PutMapping("/authUser/selectAll")
 */
let selectAll = async (req, res) => {
  let { user } = req.loginUser
  let { roleId } = req.query

  await roleService.checkRoleDataScope(roleId, user);
  await roleService.insertAuthUsers(req.query)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}



/**
 * 取消授权用户
 * @PreAuthorize("@ss.hasPermi('system:role:edit')")
 * @PutMapping("/authUser/cancel")
 */
let cancel = async (req, res) => {
  await roleService.deleteAuthUser(req.body)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}


/**
  * 批量取消授权用户
  * @PreAuthorize("@ss.hasPermi('system:role:edit')")
  * @PutMapping("/authUser/cancelAll")
  */
let cancelAll = async (req, res) => {
  // await deleteAuthUsers(req.query)
  await roleService.deleteAuthUsers(req.query)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}


module.exports = {
  allocatedList,
  unallocatedList,
  selectAll,
  cancel,
  cancelAll
}