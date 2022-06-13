/*
 * @Author: Chen
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-17 09:23:30
 * @LastEditTime: 2022-03-18 10:16:17
 * @Description: ...每位新修改者自己的信息
 */
import Cookies from 'js-cookie'

const TokenKey = 'gitce-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
