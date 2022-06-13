/*
 * @Author: Ghost

 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2022-02-23 13:25:32
 * @Description:请求头配置
 */


var { app, bodyParser } = require('./index')
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据