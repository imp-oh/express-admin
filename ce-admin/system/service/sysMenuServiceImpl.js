/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-25 14:38:18
 * @LastEditTime: 2022-04-09 23:54:01
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const menuMapper = require('@/system/db/sysMenuMapper')
const roleMapper = require('@/system/db/sysRoleMapper')
const roleMenuMapper = require('@/system/db/sysRoleMenuMapper')
const userConstants = require('@/enums/userConstants')
const { ishttp } = require('@/utils/util')
const { formatTime, loginTime } = require('@/utils/validate')


/**
 * 根据用户查询系统菜单列表
 * 
 * @param menu 菜单信息
 * @param userId 用户ID
 * @return 菜单列表
 */
let selectMenuList = async (menu = {}, userId = '') => {
  menu.userId = userId
  let db = isUserAdmin(userId) ? menuMapper.selectMenuList(menu) : menuMapper.selectMenuListByUserId(menu)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value)
  return list
}



/**
 * 校验菜单名称是否唯一
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let checkMenuNameUnique = async (menu) => {
  let { menuName, parentId, menuId } = menu
  let [info] = await dbconfig.sqlConnect(menuMapper.checkMenuNameUnique, [menuName, parentId])
  if (info && info.menuId != menu.menuId) throw { code: 500, msg: `${menuId ? '修改' : '新增'}菜单'${info.menuName}'失败，菜单名称已存在` }
}


/**
 * 根据菜单ID查询信息
 * 
 * @param menuId 菜单ID
 * @return 菜单信息
 */
let selectMenuById = async (menuId) => {
  let [menu] = await dbconfig.sqlConnect(menuMapper.selectMenuById(), menuId)
  menu.createTime = formatTime(menu.createTime, 'yyyy-MM-dd HH:mm:ss')
  menu.isFrame += ''
  menu.isCache += ''
  return menu
}



/**
 * 是否存在菜单子节点
 * 
 * @param menuId 菜单ID
 * @return 结果
 */
let hasChildByMenuId = async (menuId) => {
  let [result] = await dbconfig.sqlConnect(menuMapper.hasChildByMenuId, menuId)
  return Number(result.countNum) > 0
}



/**
 * 查询菜单使用数量
 * 
 * @param menuId 菜单ID
 * @return 结果
 */
let checkMenuExistRole = async (menuId) => {
  let [result] = await dbconfig.sqlConnect(roleMenuMapper.checkMenuExistRole, menuId)
  return Number(result.countNum) > 0
}


/**
 * 删除菜单管理信息
 * 
 * @param menuId 菜单ID
 * @return 结果
 */
let deleteMenuById = async (menuId) => {
  await dbconfig.sqlConnect(menuMapper.deleteMenuById, menuId)
}




/**
 * 根据用户ID查询权限
 * 
 * @param userId 用户ID
 * @return 权限列表
 */
let selectMenuPermsByUserId = async (userId) => {
  let permsSet = await dbconfig.sqlConnect(menuMapper.selectMenuPermsByUserId, userId)
  let maps = permsSet.map(item => item.perms)
  return maps.filter(item => !!item)
}






/**
 * 根据用户ID查询菜单
 * 
 * @param userId 用户名称
 * @return 菜单列表
 */

let selectMenuTreeByUserId = async (userId) => {
  let menus = []
  if (isUserAdmin(userId)) {
    menus = await dbconfig.sqlConnect(menuMapper.selectMenuTreeAll)
  } else {
    menus = await dbconfig.sqlConnect(menuMapper.selectMenuTreeByUserId, userId)
  }

  return treeMenu('0', menus)
}


/**
 * 根据角色ID查询菜单树信息
 * 
 * @param roleId 角色ID
 * @return 选中菜单列表
 */
let selectMenuListByRoleId = async (roleId = '') => {
  let [role] = await dbconfig.sqlConnect(roleMapper.selectRoleById, roleId)
  return await dbconfig.sqlConnect(menuMapper.selectMenuListByRoleId(roleId, role.menuCheckStrictly))
}





/**
 * 新增保存菜单信息
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let insertMenu = async (menu = {}) => {
  let db = menuMapper.insertMenu(menu)
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}




/**
 * 修改保存菜单信息
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let updateMenu = async (menu = {}) => {
  let db = menuMapper.updateMenu(menu)
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}




/**
 * 菜单递归遍历
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */


let treeMenu = (id, data) => {
  if (data.length === 0) return []
  let arrays = []
  for (let i in data) {
    let item = data[i]
    item.component = getComponent(item)
    if (item.parentId === id) {
      arrays.push(item)
      item.children = treeMenu(item.menuId, data)
      if (item.children.length > 0) {
        item.alwaysShow = true
      }
      if (item.children && item.children.length > 0 && item.menuType === userConstants.TYPE_DIR) {
        item.redirect = 'noRedirect'
      }

      item.meta = {
        icon: item.icon,
        link: item.isFrame == 0 ? item.link : null,
        title: item.menuName,
        noCache: item.isCache == 1
      }
      item.name = firstToUpper(item.path)
      if (item.parentId == 0 &&
        item.menuType === userConstants.TYPE_DIR &&
        item.isFrame == userConstants.NO_FRAME
      ) item.path = '/' + item.path

      item.hidden = item.visible != 0;

      delete item.createTime
      delete item.menuName
      delete item.icon
      delete item.isCache
      delete item.isFrame
      delete item.menuId
      delete item.visible
      delete item.status
      delete item.menuType
      delete item.orderNum
      delete item.parentId
      delete item.perms
      delete item.query
      if (item.children.length === 0) delete item.children

    }
  }
  return arrays
}


/**
 * 获取组件信息
 * 
 * @param menu 菜单信息
 * @return 组件信息
 */
let getComponent = (menu = {}) => {
  let component = userConstants.LAYOUT;
  if (menu.component && !isMenuFrame(menu)) {
    component = menu.component
  } else if (!menu.component && menu.parentId != 0 && isInnerLink(menu)) {
    component = userConstants.INNER_LINK;
  } else if (!menu.component && isParentView(menu)) {
    component = userConstants.PARENT_VIEW;
  }
  return component
}


/**
 *  首字母转大写
 * @param {*} str 
 * @returns 
 */
function firstToUpper (str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}


/**
 * 是否为菜单内部跳转
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let isMenuFrame = (menu = {}) => {
  return menu.parentId == 0 && userConstants.TYPE_MENU === menu.menuType && menu.isFrame === userConstants.NO_FRAME
}


/**
 * 是否为内链组件
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let isInnerLink = (menu = {}) => {
  return menu.isFrame === userConstants.NO_FRAME && ishttp(menu.path)
}


/**
 * 是否为parent_view组件
 * 
 * @param menu 菜单信息
 * @return 结果
 */
let isParentView = (menu = {}) => {
  return menu.parentId != 0 && userConstants.TYPE_DIR === menu.menuType;
}



module.exports = {
  updateMenu,
  insertMenu,
  selectMenuListByRoleId,
  selectMenuTreeByUserId,
  selectMenuPermsByUserId,
  selectMenuList,
  checkMenuNameUnique,
  selectMenuById,
  hasChildByMenuId,
  checkMenuExistRole,
  deleteMenuById
}


