/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-16 13:51:11
 * @LastEditTime: 2022-04-09 09:44:08
 * @Description: 权限控制
 */
const { ip } = require('@/utils/util')
const { tokenDecrypt } = require('@/utils/crypto')
const redis = require("@/utils/redis")


/**
 *  路由正则替换
 * @param {*} parsedUrl  /router/xxxx
 * @returns  router:xxxx
 */
const splitRoute = (parsedUrl) => {
  try {
    return parsedUrl.replace(/^\//, '').replace(/\//ig, ':')
  } catch (error) {
    return ''
  }
}


/**
 * 判断路由是否存在
 * @param {*} userAll  用户传递的权限  Array
 * @param {*} permissionsAll redist存储的Array权限
 */
const isRouter = (userAll = [], permissionsAll = []) => {
  let isState = false
  for (let i = 0; i < userAll.length; i++) {
    let item = userAll[i]
    if (permissionsAll.includes(item)) {
      isState = true
      break;
    }
  }
  return isState
}


// 错误提示
const dbError = (pathname, code) => {
  return { msg: "请求访问：" + pathname + "，认证失败，无法访问系统资源", code: code }
}


const error403 = {
  code: 403,
  msg: "没有权限，请联系管理员授权"
}



/**
 * 判断是否是超级管理员
 * @param {*} userid 
 * @returns 
 */
const isUserAdmin = (userid) => {
  return userid === '1'
}



/**
 *  判断角色是否是超级管理员
 * @param {*} roleId 
 * @returns 
 */
let isRolesAdmin = (roleId) => {
  return roleId != null && roleId == 1
}





/**
 *  头部验证
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const handleAuth = async (req, res, next) => {
  var authheader = req.headers.gitce;
  let token = tokenDecrypt(authheader).data
  if (!token) {
    console.log('---------失效--------userIP:', ip(req))
    throw dbError(req._parsedUrl.pathname, 401)
  }

  if (token) {
    let key = await redis.getObject(token)
    if (key === null) throw dbError(req._parsedUrl.pathname, 401)
    req.loginUser = key || {}
  }
  next()
}




/**
 *  自动匹配接口权限
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 匹配路由地址，判断是否有这个权限 
 */
const pathPermi = async (req, res, next) => {
  let { permissions = [] } = req.loginUser
  if (!permissions || permissions.length === 0) throw error403

  let route = splitRoute(req._parsedUrl.pathname)
  console.log("pathPermi =>", route)
  if (route.length === 0 || !permissions.includes(route) && !permissions.includes('*:*:*')) throw error403
  next()
}





/**
 *  符合system:user:list权限要求
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * hasPermi('system:user:list')
 */
const hasPermi = (str = '') => {
  let fun = function(req, res, next) {
    let { permissions = [] } = req.loginUser
    console.log('hasPermi =>', str)
    if (!permissions || permissions.length === 0) throw error403
    if (!permissions.includes(str) && !permissions.includes('*:*:*')) throw error403
    next()
  }
  return fun
}




// 不符合system:user:list权限要求
const lacksPermi = (str = '') => {
  let fun = function(req, res, next) {
    let { permissions = [] } = req.loginUser
    if (!permissions || permissions.length === 0) throw error403
    if (permissions.includes(str)) throw error403
    next()
  }
  return fun
}





/**
 * 符合system:user:add或system:user:edit权限要求即可
 * @param {*} userAll 
 * @returns 
 */
let hasAnyPermi = (userAll = []) => {
  let fun = function(req, res, next) {
    let { permissions = [] } = req.loginUser
    if (permissions.length === 0 || userAll.length === 0) throw error403
    if (!isRouter(userAll, permissions)) throw error403
    next()
  }
  return fun
}


// 角色权限
// http://doc.ruoyi.vip/ruoyi/document/htsc.html#requiresroles

// @RequiresRoles("admin") 示例1: 以下代码表示必须拥有admin角色才可访问
// @RequiresRoles({"admin", "common"}) 示例2: 以下代码表示必须拥有admin和common角色才可访问
// @RequiresRoles(value = {"admin", "common"}, logical = Logical.OR)  示例3: 以下代码表示需要拥有admin或common角色才可访问
// value	String[]	角色列表
// logical	Logical	角色之间的判断关系，默认为Logical.AND =>  && 、|| 
let requiresRoles = (value, logical) => {

}

/**
 * 1.数据权限示例。
 // 符合system:user:list权限要求
@PreAuthorize("@ss.hasPermi('system:user:list')")

// 不符合system:user:list权限要求
@PreAuthorize("@ss.lacksPermi('system:user:list')")

// 符合system:user:add或system:user:edit权限要求即可
@PreAuthorize("@ss.hasAnyPermi('system:user:add,system:user:edit')")



* 2.角色权限示例。
// 属于user角色
@PreAuthorize("@ss.hasRole('user')")

// 不属于user角色
@PreAuthorize("@ss.lacksRole('user')")

// 属于user或者admin之一
@PreAuthorize("@ss.hasAnyRoles('user,admin')")
 */



module.exports = {
  isUserAdmin,
  handleAuth,
  pathPermi,
  hasPermi,
  lacksPermi,
  hasAnyPermi,
  isRolesAdmin
}