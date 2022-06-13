/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-26 20:17:32
 * @LastEditTime: 2022-03-31 10:43:57
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const deptMapper = require('@/system/db/sysDeptMapper')
const roleMapper = require('@/system/db/sysRoleMapper')
const { formatTime } = require('@/utils/validate')
const { isUserAdmin } = require('@/utils/permissions')
const userConstants = require('@/enums/userConstants')



/**
 * 查询部门管理数据
 * 
 * @param dept 部门信息
 * @param loginUser 登录信息
 * @return 部门信息集合
 * 
 * @DataScope(deptAlias = "d")  // 数据权控制
 */

let selectDeptList = async (dept = {}, loginUser) => {
  let select = deptMapper.selectDeptList(dept, loginUser)
  let list = await dbconfig.sqlConnect(select.sqlString, select.value)
  list.forEach(item => {
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss')
    item.deptId = Number(item.deptId)
    item.parentId = Number(item.parentId)
  })
  return list
}


/**
 * 校验部门名称是否唯一
 * 
 * @param dept 部门信息
 * @return 结果
 */
let checkDeptNameUnique = async (dept = {}) => {
  let { deptName, parentId, deptId } = dept
  let [info] = await dbconfig.sqlConnect(deptMapper.checkDeptNameUnique, [deptName, parentId])
  if (info && dept.deptId != info.deptId) throw { code: 500, msg: `${deptId ? '修改' : '新增'}部门'${deptName}'失败，部门名称已存在` }
}


/**
 * 新增保存部门信息
 * 
 * @param dept 部门信息
 * @return 结果
 */
let insertDept = async (dept = {}) => {
  let [info] = await dbconfig.sqlConnect(deptMapper.selectDeptById, dept.parentId)

  if (!info.status === userConstants.DEPT_NORMAL) throw { code: 500, msg: "部门停用，不允许新增" }

  dept.ancestors = `${info.ancestors},${dept.parentId}`
  let db = deptMapper.insertDept(dept)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}



/**
 * 校验部门是否有数据权限
 * 
 * @param deptId 部门id
 * @param loginUser 用户登录信息
 */
let checkDeptDataScope = async (deptId, loginUser = {}) => {
  if (isUserAdmin(loginUser.userId)) return
  let list = await selectDeptList({ deptId }, loginUser)
  if (list.length === 0) throw { code: 500, msg: "没有权限访问部门数据！" }
}



/**
 * 根据部门ID查询信息
 * 
 * @param deptId 部门ID
 * @return 部门信息
 */
let selectDeptById = async (deptId) => {
  let [row] = await dbconfig.sqlConnect(deptMapper.selectDeptById, deptId)
  row.createTime = formatTime(row.createTime, 'yyyy-MM-dd HH:mm:ss')
  row.deptId = Number(row.deptId)
  row.parentId = Number(row.parentId)
  return row
}



/**
 * 根据ID查询所有子部门（正常状态）
 * 
 * @param deptId 部门ID
 * @return 子部门数
 */
let selectNormalChildrenDeptById = async (deptId = '') => {
  let [info] = await dbconfig.sqlConnect(deptMapper.selectNormalChildrenDeptById, deptId)
  return Number(info.countNum) > 0
}



/**
 * 修改保存部门信息
 * 
 * @param dept 部门信息
 * @return 结果
 */
let updateDept = async (dept = {}) => {
  let { parentId, deptId } = dept
  let [newParentDept] = await dbconfig.sqlConnect(deptMapper.selectDeptById, parentId)
  let [oldDept] = await dbconfig.sqlConnect(deptMapper.selectDeptById, deptId)
  let newAncestors = ''
  let oldAncestors = ''
  if (newParentDept && oldDept !== 0) {
    newAncestors = `${newParentDept.ancestors},${newParentDept.deptId}`
    oldAncestors = oldDept.ancestors
    dept.ancestors = newAncestors
    await updateDeptChildren(deptId, newAncestors, oldAncestors)
  }
  let update = deptMapper.updateDept(dept)
  await dbconfig.sqlConnect(update.sqlString, update.value)
}



/**
 * 修改子元素关系
 * 
 * @param deptId 被修改的部门ID
 * @param newAncestors 新的父ID集合
 * @param oldAncestors 旧的父ID集合
 */
let updateDeptChildren = async (deptId, newAncestors, oldAncestors) => {
  let children = await dbconfig.sqlConnect(deptMapper.selectChildrenDeptById, deptId)
  children.forEach(item => {
    item.ancestors = item.ancestors.replace(oldAncestors, newAncestors)
  })

  if (children.length > 0) {
    let update = deptMapper.updateDeptChildren(children)
    await dbconfig.sqlConnect(update.sqlString, update.value)
  }

}



/**
 * 是否存在子节点
 * 
 * @param deptId 部门ID
 * @return 结果
 */
let hasChildByDeptId = async (deptId) => {
  let [result] = await dbconfig.sqlConnect(deptMapper.hasChildByDeptId, deptId);
  return Number(result.countNum) > 0;
}



/**
 * 查询部门是否存在用户
 * 
 * @param deptId 部门ID
 * @return 结果 true 存在 false 不存在
 */
let checkDeptExistUser = async (deptId) => {
  let [result] = await dbconfig.sqlConnect(deptMapper.checkDeptExistUser, deptId);
  return Number(result.countNum) > 0;
}




/**
  * 删除部门管理信息
  * 
  * @param deptId 部门ID
  * @return 结果
  */

let deleteDeptById = async (deptId) => {
  await dbconfig.sqlConnect(deptMapper.deleteDeptById, deptId)
}


/**
 * 根据角色ID查询部门树信息
 * 
 * @param roleId 角色ID
 * @return 选中部门列表
 */
let selectDeptListByRoleId = async (roleId = '') => {
  let [role] = await dbconfig.sqlConnect(roleMapper.selectRoleById, roleId)
  let db = deptMapper.selectDeptListByRoleId(roleId, role.deptCheckStrictly)
  return await dbconfig.sqlConnect(db)
}


module.exports = {
  selectDeptListByRoleId,
  selectDeptList,
  checkDeptNameUnique,
  insertDept,
  checkDeptDataScope,
  selectDeptById,
  selectNormalChildrenDeptById,
  updateDept,
  hasChildByDeptId,
  checkDeptExistUser,
  deleteDeptById
}


