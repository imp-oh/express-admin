/*
 * @Author: Ghost

 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2022-03-20 14:06:49
 * @Description: 拦截器
 */

const { express, app } = require('../config/index')
const { codeengine } = require('../utils/crypto')

const session = require('express-session')
const { rules } = require('@/utils/fromValidate')
// https://github.com/davidbanham/express-async-errors

require('express-async-errors'); // 错误拦截



app.set('x-powered-by', false)  // 禁止显示框架

app.disable('etag');

/** 接口配置 */
app.use(express.urlencoded({ extended: false }));











/** session */
app.use(session({
  secret: "codeAdmin",		//设置签名秘钥  内容可以任意填写 
  cookie: { maxAge: 5 * 1000 * 60, httpOnly: true }, // 五分钟后失效
  // cookie: { maxAge: 180 * 24 * 60 * 60 * 1000, httpOnly: true },
  resave: true,			//强制保存，如果session没有被修改也要重新保存
  saveUninitialized: false		//如果原先没有session那么久设置，否则不设置
}))


app.all("*", (req, res, next) => {

  res.header("Cache-Control", "no-siteApp,no-cache,must-revalidate,no-transform"); // 禁止ie缓存
  res.header("Pragma", "no-cache"); // 禁止ie缓存

  // 方法挂载
  req.codeengine = codeengine
  req.rules = rules

  // routes 拦截
  next()
})
