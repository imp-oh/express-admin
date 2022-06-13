/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-20 20:07:44
 * @LastEditTime: 2022-03-31 10:15:41
 * @Description: ...每位新修改者自己的信息
 */


const { formatTime } = require('@/utils/validate')
const { treeDept, ishttp } = require('@/utils/util')
const menuService = require('@/system/service/sysMenuServiceImpl')





/**
 * 获取菜单列表
 * @PreAuthorize("@ss.hasPermi('system:menu:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let { user } = req.loginUser
  let data = await menuService.selectMenuList(req.query, user.userId);
  res.send({
    code: 200,
    msg: "操作成功",
    data
  })
}


/**
 * 新增菜单
 * @PreAuthorize("@ss.hasPermi('system:menu:add')")
 */
let add = async (req, res) => {
  let { user } = req.loginUser
  let { isFrame, path, menuName } = req.body

  await menuService.checkMenuNameUnique(req.body)
  if (isFrame == 0 && !ishttp(path)) throw { code: 500, msg: "新增菜单'" + menuName + "'失败，地址必须以http(s)://开头" }
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await menuService.insertMenu(req.body)

  res.send({
    code: 200,
    msg: "新增成功"
  })
}




/**
 * 修改菜单
 * @PreAuthorize("@ss.hasPermi('system:menu:edit')")
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  let { isFrame, path, menuName, parentId, menuId } = req.body
  await menuService.checkMenuNameUnique(req.body)
  if (isFrame == 0 && !ishttp(path)) throw { code: 500, msg: "新增菜单'" + menuName + "'失败，地址必须以http(s)://开头" }
  if (parentId == menuId) throw { code: 500, msg: "修改菜单'" + menuName + "'失败，上级菜单不能选择自己" }
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await menuService.updateMenu(req.body)

  res.send({
    code: 200,
    msg: "修改成功"
  })
}



/**
 * 删除菜单
 * @PreAuthorize("@ss.hasPermi('system:menu:remove')")
 *  @DeleteMapping("/{menuId}")
 */
let remove = async (req, res) => {
  let { menuId } = req.params
  if (await menuService.hasChildByMenuId(menuId)) throw { code: 500, msg: "存在子菜单,不允许删除" }
  if (await menuService.checkMenuExistRole(menuId)) throw { code: 500, msg: "菜单已分配,不允许删除" }

  await menuService.deleteMenuById(menuId)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}




/**
 * 获取菜单下拉树列表
 * @GetMapping("/treeselect")
 */
let treeselect = async (req, res) => {
  let { user = {} } = req.loginUser
  let menus = await menuService.selectMenuList(req.params, user.userId)
  res.send({
    code: 200,
    msg: "操作成功",
    data: treeDept('0', menus, { id: "menuId", label: "menuName" })
  })
}



/**
 * 加载对应角色菜单列表树
 * @GetMapping(value = "/roleMenuTreeselect/{roleId}")
 */
let roleMenuTreeselect = async (req, res) => {
  let { roleId } = req.params
  let { user = {} } = req.loginUser
  let menus = await menuService.selectMenuList(req.params, user.userId)
  let checkedKeys = await menuService.selectMenuListByRoleId(roleId)

  res.send({
    code: 200,
    msg: "操作成功",
    menus: treeDept('0', menus, { id: "menuId", label: "menuName" }),
    checkedKeys: checkedKeys.map(item => Number(item.menuId))
  })
}






/**
 * 根据菜单编号获取详细信息
 * @PreAuthorize("@ss.hasPermi('system:menu:query')")
 * @GetMapping(value = "/{menuId}")
 */
let getInfo = async (req, res) => {
  let { menuId } = req.params
  let data = await menuService.selectMenuById(menuId)
  res.send({
    code: 200,
    msg: "查询成功",
    data
  })
}




module.exports = {
  treeselect,
  roleMenuTreeselect,
  list,
  add,
  getInfo,
  edit,
  remove
}