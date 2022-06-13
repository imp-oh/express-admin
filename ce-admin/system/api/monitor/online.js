/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 13:21:01
 * @LastEditTime: 2022-04-12 14:09:38
 * @Description: 在线用户
 */

const { formatTime } = require('@/utils/validate')
const redis = require('@/utils/redis')
const { constants } = require('@/config')

function fuzzyQuery(list, rows = {}) {
  let { key1, value1, key2, value2 } = rows
  var arr = []
  for (var i = 0; i < list.length; i++) {
    let info = list[i]
    if (info[key1].indexOf(value1) >= 0 && info[key2].indexOf(value2) >= 0) {
      arr.push(list[i])
    }
  }
  return arr
}

/**
 * 在线用户监控
 * @GetMapping("/list")
 * @PreAuthorize("@ss.hasPermi('monitor:online:list')")
 */
let list = async (req, res) => {
  let keys = await redis.keys(constants.LOGIN_TOKEN_KEY + '*')
  let { ipaddr = '', userName = '' } = req.query

  let userOnlineList = []
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i]
    let info = await redis.getObject(k)
    let { user = {} } = info
    userOnlineList.push({
      browser: info.browser,
      deptName: user.dept.deptName,
      ipaddr: user.loginIp,
      loginLocation: info.loginLocation,
      loginTime: info.loginTime,
      os: info.os,
      tokenId: info.token,
      userName: info.userName
    })
  }

  let list = fuzzyQuery(userOnlineList, {
    key1: 'ipaddr',
    key2: 'userName',
    value1: ipaddr,
    value2: userName
  })
  res.send({
    msg: '查询成功',
    code: 200,
    total: list.length,
    rows: list
  })
}

/**
 * 强退用户
 * @PreAuthorize("@ss.hasPermi('monitor:online:forceLogout')")
 * @DeleteMapping("/{tokenId}")
 */
let forceLogout = async (req, res) => {
  let { tokenId } = req.params
  redis.client.del(constants.LOGIN_TOKEN_KEY + tokenId)
  res.send({
    msg: '操作成功',
    code: 200
  })
}

module.exports = {
  forceLogout,
  list
}
