/*
 * @Author: Ghost
 * @Date: 2020-09-18 13:37:48
 * @LastEditTime: 2022-03-31 15:52:46
 * @Description: SQL配置，和链接数据库方法
 */
const mysql = require('mysql')
const { toHumpFun } = require('@/utils/mysql')

var config = {
  config: {
    // mysql 配置
    host: 'localhost',
    port: '3306', //端口
    user: 'root', // 账号
    password: 'root', // 密码
    database: 'node',  // 数据库名称
    supportBigNumbers: true, //bigint强制转换字符串
    bigNumberStrings: true //bigint强制转换字符串
  },
  db: null,
  init: function () {
    this.db = mysql.createPool(this.config);
  },

  format: mysql.format,
  escapeId: mysql.escapeId,
  escape: mysql.escape,
  // 连接数据库，使用mysql 连接池方法
  // 连接池对象
  sqlConnect: function (sql, sqlArr = [], timeFormat) {
    const _this = this
    return new Promise(function (resolve, reject) {
      _this.db.getConnection((err, conn) => {
        if (err) {
          _this.db.releaseConnection(conn);
          throw { code: 502, msg: "不小心玩崩溃了把" }
        }
        //事件驱动回调
        conn.query(sql, sqlArr, function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(toHumpFun(data, timeFormat))
          }
        })
        //释放连接
        _this.db.releaseConnection(conn);
      })
    })
  }
}

config.init() // 先连接

module.exports = config