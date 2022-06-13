/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 11:06:32
 * @LastEditTime: 2022-04-09 23:09:36
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const configService = require('@/system/service/sysConfigServiceImpl')
const userDetailsService = require('@/system/service/userDetailsServiceImpl')
const { bcryptDecrypt, rsaDecrypt, tokenEncrypt } = require('@/utils/crypto')
const { uuid, getUserAgent, ip, checkIsInsideIP } = require('@/utils/util')
const { formatTime, loginTime } = require('@/utils/validate')
const { constants, token } = require('@/config')
const redis = require("@/utils/redis")

const dbUserMapper = require('@/system/db/sysUserMapper')

/**
 * 登录验证
 * 
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @return 结果
 */
let login = async (req, res) => {
  let { username, password, code } = req.body

  // 验证码开关
  // let captchaOnOff = configService.selectCaptchaOnOff();

  // 用户验证
  let { user, permissions } = await userDetailsService.loadUserByUsername(username)
  const passwordDecrypt = rsaDecrypt(password)
  if (!bcryptDecrypt(passwordDecrypt, user.password)) throw { code: 500, msg: "用户不存在/密码错误" }

  let UUID = uuid()
  let loginToken = constants.LOGIN_TOKEN_KEY + UUID
  let userAgent = getUserAgent(req)

  let loginIp = ip(req)
  let loginDatagetTime = loginTime()
  let loginData = formatTime(loginDatagetTime.loginTime, 'yyyy-MM-dd HH:mm:ss')
  user.loginIp = loginIp
  let row = {
    ...userAgent,
    deptId: user.deptId,
    loginTime: loginDatagetTime.loginTime,
    expireTime: loginDatagetTime.expireTime,
    loginLocation: checkIsInsideIP(loginIp) ? '内网IP' : '外网IP',
    permissions,
    token: UUID,
    user,
    userId: user.userId,
    userName: user.userName
  }

  redis.set(loginToken, row)
  // 60秒 * 分钟
  redis.client.expire(loginToken, 60 * token.expireTime)

  let db = dbUserMapper.updateUser({
    loginIp,
    loginData,
    updateTime: loginData,
    userId: user.userId
  })
  
  await dbconfig.sqlConnect(db.sqlString, db.value)

  return row

}


module.exports = {
  login
}