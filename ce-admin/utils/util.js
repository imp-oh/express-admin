/*
 * @Author: Ghost

 * @Date: 2020-10-21 13:47:00
 * @LastEditTime: 2022-04-09 23:21:11
 * @Description: ...每位新修改者自己的信息
 */
const requestIp = require('request-ip');
const { v4: uuidv4 } = require('uuid');
const UAParser = require("ua-parser-js");


const toLiteral = (str) => {
  var dict = { '\b': 'b', '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r' };
  return str.replace(/([\\'"\b\t\n\v\f\r])/g, function ($0, $1) {
    return '\\' + (dict[$1] || $1);
  });
}



/**
 *  获取用户IP地址
 * @param {*} req 
 * @returns 
 */
const ip = (req) => {
  let ips = requestIp.getClientIp(req)
  let address = ips.indexOf(':') !== -1 ? ips.split(':') : ips;
  let ipAddress = address
  if (ips.indexOf(':') !== -1) ipAddress = address[3];
  return ipAddress
}

/**
 * 内外网ip判断
 * @param {*} address 
 * @returns 
 */
const checkIsInsideIP = function (ipAddress) {
  if (ipAddress == "127.0.0.1" || ipAddress == "localhost") {
    return true;
  }
  var aryIpAddress = ipAddress.split('.');
  if (aryIpAddress[0] == "10") {
    return true;
  }
  if (aryIpAddress[0] == "192" && aryIpAddress[1] == "168") {
    return true;
  }
  if (aryIpAddress[0] == "172") {
    var num = parseInt(aryIpAddress[1]);
    if (num >= 16 && num <= 31) {
      return true;
    }
  }

  return false;
}



/**
 * 生成UUid
 * @returns 
 */
const uuid = () => {
  return uuidv4()
}



/**
 * 统计用户登录
 * @param {*} str 
 * @returns 
 */
const getUserAgent = (req) => {
  let str = req.headers['user-agent']
  var uaParser = new UAParser(str);
  let user = uaParser.getResult()
  let { os, browser, ua } = user
  return {
    os: os.name ? (os.name + os.version) : "",
    browser: browser.name ? (browser.name + browser.version) : ua
  }
}




/**
 *  部门递归遍历
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
let treeDept = (id, data = [], key = {}) => {
  if (data.length === 0) return []
  let arrays = []
  for (let i in data) {
    let item = data[i]
    if (item.parentId === id) {
      let row = {
        id: item[key.id],
        label: item[key.label],
      }
      row.children = treeDept(row.id, data, key)
      if (row.children.length === 0) delete row.children
      arrays.push(row)
    }
  }
  return arrays
}




function ishttp (url) {
  var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  return reg.test(url)
}


module.exports = {
  toLiteral, ip, uuid, getUserAgent, checkIsInsideIP, treeDept, ishttp
}