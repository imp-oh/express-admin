/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-15 11:30:47
 * @LastEditTime: 2022-04-13 22:21:52
 * @Description: 登录模块
 */

const { tokenEncrypt, tokenDecrypt } = require('@/utils/crypto')
const redis = require("@/utils/redis")
const { uuid } = require('@/utils/util')
const { constants } = require('@/config')
const configService = require('@/system/service/sysConfigServiceImpl')
const loginService = require('@/system/service/sysLoginServiceImpl')
const permissionService = require('@/system/service/sysPermissionService')
const menuService = require('@/system/service/sysMenuServiceImpl')

/**
 * 登录方法
 * 
 * @param req.body 登录信息
 * @return 结果
 * 
 * @PostMapping("/login")
 */
let login = async (req, res) => {
  // 表单验证
  await req.rules({
    username: [{ required: true, message: '请输入账号' }],
    password: [{ required: true, message: '请输入密码' }]
  }, req.body)

  let user = await loginService.login(req, res) // 验证
  let loginToken = constants.LOGIN_TOKEN_KEY + user.token
  res.send({
    token: tokenEncrypt(loginToken),
    code: 200,
    msg: '登录成功'
  })
}



/**
 *  用户退出
 * 
 * @GetMapping("logout")
 */
const logout = (req, res) => {
  let { gitce = '' } = req.headers
  let token = tokenDecrypt(gitce).data
  if (token) redis.client.del(token)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}



/**
 * 生成验证码
 * 
 * @GetMapping("/captchaImage")
 */
const captchaImage = async (req, res) => {
  let captchaOnOff = await configService.selectCaptchaOnOff();
  let codeConfig = {}
  if (captchaOnOff) codeConfig = configService.captcha()
  res.send({
    captchaOnOff: captchaOnOff,
    code: 200,
    img: captchaOnOff ? codeConfig.img : "",
    msg: "操作成功",
    uuid: uuid()
  })
}




/**
 * 获取用户信息
 * 
 * @return 用户信息
 * @GetMapping("getInfo")
 */
const getInfo = (req, res) => {
  let { permissions = [], user = {} } = req.loginUser
  delete user.password
  res.send({
    code: 200,
    msg: "操作成功",
    permissions,
    roles: permissionService.getRolePermission(user),
    user: user
  })
}





/**
 * 获取路由信息
 * 
 * @return 路由信息
 * @GetMapping("getRouters")
 */
const getRouters = async (req, res) => {
  let { user } = req.loginUser
  let data = await menuService.selectMenuTreeByUserId(user.userId)
  res.send({
    msg: "操作成功",
    code: 200,
    data: data
  })
}




module.exports = {
  login, captchaImage, getInfo, logout, getRouters
}