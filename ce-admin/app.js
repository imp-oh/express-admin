/*
 * @Author: Ghost
 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2022-03-16 14:22:07
 * @Description: ...每位新修改者自己的信息
 */


/** 全局配置缩写符号 */
var nodeRequireAlias = require("./utils/rootRequire")
const path = require("path")
let __dirPaht = process.cwd()
nodeRequireAlias.setAlias({
  "@": path.join(__dirname),
  // "__dirPaht":__dirPaht
})


var { app } = require("@/config/index")
var http = require("http");



/**
 * 静态资源
 */
require("@/config/static")

/**
 * 请求头
 */
require("@/config/header")



/**
 * 拦截器
 */
 require("@/config/interceptor")




/**
 * 路由注册
 */

require("@/config/routers")





// var fs = require("fs");

// fs.readdir(path.join(__dirname, './'), function(err, files) {
//   console.log("目录文件 =>>>>>>>", files, files.length)
// })



/**
 * Create HTTP server.
 */
var server = http.createServer(app);
server.listen('8800', () => {
  var port = server.address().port;
  console.log(`Example app listening at http://127.0.0.1:${port}`)
})





