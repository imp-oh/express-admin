
let redis = require('redis')

let $redis = {
  init: function (port = 6379, host = '127.0.0.1') {
    this.client = redis.createClient(port, host)
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.connect();
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

      this.client[type](key).then(val => {
        if (val == null) return resolve(null)
        try {
          resolve(!isObjects ? val : JSON.parse(val))
        } catch (error) {
          resolve(val)
        }
      }, () => {
        reject(val)
      })

    })
  }
}



let config = $redis.init()


module.exports = config
