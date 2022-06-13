/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-23 11:18:43
 * @LastEditTime: 2022-04-12 16:20:55
 * @Description: ...每位新修改者自己的信息
 */
let { getProperty } = require('@/plug-in/dot-prop')
const { formatTime } = require('@/utils/validate')

/**
 *  分页
 * @param {*} page
 * @returns
 */
const handlePage = (page = {}) => {
  let { pageNum, pageSize } = page
  return pageSize ? [(Number(pageNum) - 1) * Number(pageSize), Number(pageSize)] : []
}

/**
 *  数据库语句配接
 * @param {*} sqlarr
 *  where  => 判断条件
 *  sql  => mysql 语句
 *  key => 对象名称
 *
 * @returns
 */

/**
  使用教程

    {
      key: 'status',
      sql: ' AND status = ? ',
      isNull: true  => 这里只要
    },

 */
let sqlFunKey = (rows = {}, sqlarr = []) => {
  let sqlString = ''
  let value = []
  for (let i in sqlarr) {
    let item = sqlarr[i]
    item.where = void 0 === item.where ? '' : item.where

    let content = getProperty(rows, item.key)

    // 1.不等于  undefined && ''
    if (content !== void 0 && content !== '' && item.isNull) (sqlString += item.sql), value.push(content)

    // 2.判断不等于 '' && undefined && 0 
    if (content != null && content !== '' && content != 0 && item.isNotZero) (sqlString += item.sql), value.push(content)

    // 3.自定义判断
    if (item.where && item.isFun && new Function('key', 'return ' + item.where)(content)) (sqlString += item.sql), value.push(...content)

    // 4.默认 不等于 undefined && null
    if (content !== void 0 && content !== null && !item.where && !item.isNull && !item.isFun && !item.isNotZero) (sqlString += item.sql), value.push(content)
  }
  return {
    sqlString,
    value
  }
}



// 下划线转换驼峰
function toHump (name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// 驼峰转换下划线
function toLine (name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

// 下划线转驼峰  sys_role_menu  =>  SysRoleMenu
function toUpperCaseAll (name) {
  let str = toHump(name)
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 *  下划线转换驼峰
 * @param {*} obj
 * @param {*} timeFormat 时间格式 'yyyy-MM-dd HH:mm:ss'
 * @returns
 */
function toHumpFun (obj, timeFormat) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      const index = key.indexOf('_')
      let newKey = key
      if (index === -1 || key.length === 1) {
        result[key] = element
      } else {
        const keyArr = key.split('_')
        const newKeyArr = keyArr.map((item, index) => {
          if (index === 0) return item
          return item.charAt(0).toLocaleUpperCase() + item.slice(1)
        })
        newKey = newKeyArr.join('')
        result[newKey] = element
      }
      if (element instanceof Date) {
        result[newKey] = void 0 === timeFormat ? element : formatTime(element, timeFormat)
      } else if (!(element instanceof Date) && typeof element === 'object' && element !== null) {
        result[newKey] = toHumpFun(element, timeFormat)
      }
    }
  }
  return result
}

/**
 *  Boolean 转 数字
 */
let numberFun = is => {
  if (void 0 === is) return null
  return is === true ? 1 : 0
}

module.exports = {
  toUpperCaseAll,
  handlePage,
  toHump,
  toLine,
  toHumpFun,
  sqlFunKey,
  numberFun
}
