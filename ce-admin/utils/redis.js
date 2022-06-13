/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-15 13:30:24
 * @LastEditTime: 2022-04-09 09:41:37
 * @Description: ...每位新修改者自己的信息
 */

let redis = require('redis')

let $redis = {
  init: function (port = 6379, host = '127.0.0.1') {
    this.client = redis.createClient(port, host)
    return this
  },
  set: function (key, val) {
    if (typeof val == 'object') {
      val = JSON.stringify(val)
    }
    this.client.set(key, val, redis.print)
  },
  get: function (key) {
    return this.callBack({ key })
  },
  // 获取 Object || Array
  getObject: function (key) {
    return this.callBack({ key, isObjects: true })
  },
  keys: function (key) {
    return this.callBack({ key, type: 'keys' })
  },

  // 回调方法
  callBack: function (rows = {}) {
    let { key = '', type = 'get', isObjects = false } = rows
    return new Promise((resolve, reject) => {
      this.client[type](key, (err, val) => {
        if (err) return reject(err)
        if (val == null) return resolve(null)
        try {
          resolve(!isObjects ? val : JSON.parse(val))
        } catch (error) {
          resolve(val)
        }
      })
    })
  }

}

let config = $redis.init()


module.exports = config
