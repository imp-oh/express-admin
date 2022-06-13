/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-30 13:30:35
 * @LastEditTime: 2022-03-30 13:55:09
 * @Description: ...每位新修改者自己的信息
 */
const redis = require("@/utils/redis")
const { constants } = require('@/config')

/**
 * 设置用户身份信息
 */
let setLoginUser = (loginUser = {}) => {
  if (loginUser && loginUser.token) refreshToken(loginUser)
}



/**
 * 刷新令牌有效期
 *
 * @param loginUser 登录信息
 */

let refreshToken = (loginUser = {}) => {
  let loginToken = constants.LOGIN_TOKEN_KEY + loginUser.token
  // 60秒 * 分钟
  // redis.client.expire(loginToken, 60 * token.expireTime)
  redis.set(loginToken, loginUser)
}

module.exports = {
  setLoginUser
}