/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-17 19:04:24
 * @LastEditTime: 2022-03-31 10:51:21
 * @Description: ...每位新修改者自己的信息
 */


const { treeDept } = require('@/utils/util')
const { formatTime } = require('@/utils/validate')
const deptService = require('@/system/service/sysDeptServiceImpl')
const userConstants = require('@/enums/userConstants')





/**
 * 获取部门列表
 * @PreAuthorize("@ss.hasPermi('system:dept:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let { user } = req.loginUser
  let depts = await deptService.selectDeptList(res.query, user);
  res.send({
    data: depts || [],
    code: 200,
    msg: '操作成功'
  })
}





/**
 * 新增部门
 * @PreAuthorize("@ss.hasPermi('system:dept:add')")
 */
let add = async (req, res) => {
  let { user } = req.loginUser

  await deptService.checkDeptNameUnique(req.body)
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await deptService.insertDept(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}






/**
  * 修改部门
  * @PreAuthorize("@ss.hasPermi('system:dept:edit')")
  */
let edit = async (req, res) => {
  let { deptId, parentId, status } = req.body
  let { user } = req.loginUser

  await deptService.checkDeptDataScope(deptId, user)
  await deptService.checkDeptNameUnique(req.body)
  if (parentId == deptId) throw { code: 500, msg: "修改部门'" + menuName + "'失败，上级部门不能是自己" }
  if (userConstants.DEPT_DISABLE == status && await deptService.selectNormalChildrenDeptById(deptId)) throw { code: 500, msg: "该部门包含未停用的子部门" }
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

  await deptService.updateDept(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}






/**
 * 获取部门下拉树列表
 * 
 * @GetMapping("/treeselect")
 */
let treeselect = async (req, res) => {
  let { user } = req.loginUser
  let all = await deptService.selectDeptList(req.query, user)
  let data = treeDept(0, all, { id: "deptId", label: "deptName" })
  res.send({
    data: data || [],
    code: 200,
    msg: '操作成功'
  })
}


/**
 * 加载对应角色部门列表树
 * @GetMapping(value = "/roleDeptTreeselect/{roleId}")
 */
let roleDeptTreeselect = async (req, res) => {
  let { roleId } = req.params
  let { user } = req.loginUser
  let depts = await deptService.selectDeptList({}, user);
  let checkedKeys = await deptService.selectDeptListByRoleId(roleId);

  res.send({
    code: 200,
    msg: '操作成功',
    depts: treeDept(0, depts, { id: "deptId", label: "deptName" }),
    checkedKeys: checkedKeys.map(item => item.deptId)
  })
}





/**
 * 根据部门编号获取详细信息
 * @PreAuthorize("@ss.hasPermi('system:dept:query')")
 * @GetMapping(value = "/{deptId}")
 */
let getInfo = async (req, res) => {
  let { deptId } = req.params
  let { user } = req.loginUser

  await deptService.checkDeptDataScope(deptId, user)
  let data = await deptService.selectDeptById(deptId)

  res.send({
    code: 200,
    msg: '操作成功',
    data: data || {}
  })
}





/**
 * 删除部门
 * @PreAuthorize("@ss.hasPermi('system:dept:remove')")
 * @DeleteMapping("/{deptId}")
 */
let remove = async (req, res) => {
  let { deptId } = req.params
  let { user } = req.loginUser

  if (await deptService.hasChildByDeptId(deptId)) throw { code: 500, msg: "存在下级部门,不允许删除" }
  if (await deptService.checkDeptExistUser(deptId)) throw { code: 500, msg: "部门存在用户,不允许删除" }
  await deptService.checkDeptDataScope(deptId,user);

  await deptService.deleteDeptById(deptId)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

module.exports = {
  treeselect, roleDeptTreeselect, list, add, getInfo, edit, remove
}