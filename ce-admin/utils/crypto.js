/*
 * @Author: Ghost

 * @Date: 2020-12-08 09:39:28
 * @LastEditTime: 2022-03-18 15:21:49
 * @Description: 加密方法
 */
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { rsa, jsonwebtoken } = require('@/config')
const jwt = require('jsonwebtoken');
const { token } = require('@/config')


/**
 * 解密rsa
 */
const rsaDecrypt = (key) => {
  var priKey = rsa.private // 私钥
  var priKey = new NodeRSA(priKey, 'pkcs8-private'); //导入私钥
  priKey.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。

  return priKey.decrypt(key, 'utf8')
}

/**
 *  加密rsa
 */
const rsaEncrypt = (key) => {
  var result = crypto.createHash('md5').update(key).digest("hex")
  return result
}





/**
 * bcrypt加密
 * @param {*} password string  案例 => admin123
 * @param {*} cost  number     案例 => 10
 * @returns 返回密码
 */
const bcryptEncrypt = (password, cost = 10) => {
  let salt = bcrypt.genSaltSync(cost);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

/**
 * bcrypt解密
 * @param {*} password  string         案例 => admin123
 * @param {*} encryptPassword  string  案例 => $2b$10$7yy22nNpdl0AIZ8cKRbFQuOeNMEOAjTx.sr50Vbo98D5BV3tjUquK
 * @returns true || false  => true 成功
 */
const bcryptDecrypt = (password, encryptPassword) => {
  return bcrypt.compareSync(password, encryptPassword)
}









/**
 * token 加密
 * @param {value} data 
 * @param {*} time 
 * @requires 返回加密
 */
const tokenEncrypt = (data, time) => {
  return jwt.sign({
    // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 180), // 设置180天过期
    exp: Math.floor(Date.now() / 1000) + (60 * token.expireTime), // 
    // exp: Math.floor(Date.now() / 1000) + (60 * 1),
    data: data
  }, jsonwebtoken.secretKey);
}

/**
 * token 解析
 * @param {value} data 
 */
const tokenDecrypt = (data) => {
  try {
    return jwt.verify(data, jsonwebtoken.secretKey);
  } catch (err) {
    return {}
  }
}








/**
 * 解析自定义头
 * @param {*} req 
 */
const codeengine = (req) => {
  const cookie = req.headers.codeengine
  return tokenDecrypt(cookie).data
}





module.exports = {
  rsaEncrypt,
  rsaDecrypt,
  bcryptDecrypt,
  bcryptEncrypt,
  tokenEncrypt,
  tokenDecrypt,
  codeengine
}