/*
 * @Author: Ghost

 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2022-03-17 10:43:40
 * @Description: 公共依赖
 */


var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser')

var path = require('path');
let __dirPaht = process.cwd()


/**
 * 全局挂载驼峰响应方法
 */
const {toHumpFun} = require('@/utils/util')
express.response.sendHump = function(params) {
  let data = toHumpFun(params)
  express.response.send.call(this, data)
}




module.exports = {
  express,
  app,
  // cookieParser,
  session,
  bodyParser,
  path,
  router,
  __dirPaht,
  // formidable
}