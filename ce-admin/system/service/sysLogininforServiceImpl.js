/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 11:33:41
 * @LastEditTime: 2022-04-12 13:18:39
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const logininforMapper = require('@/system/db/sysLogininforMapper')

let startPage = async (logininfor = {}) => {
  let body = JSON.parse(JSON.stringify(logininfor))
  delete body.pageNum
  delete body.pageSize

  let db = logininforMapper.selectLogininforList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 查询系统登录日志集合
 *
 * @param logininfor 访问日志对象
 * @return 登录记录集合
 */
let selectLogininforList = async (logininfor = {}) => {
  let db = logininforMapper.selectLogininforList(logininfor)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

/**
 * 批量删除系统登录日志
 *
 * @param infoIds 需要删除的登录日志ID
 * @return 结果
 */
let deleteLogininforByIds = async (infoIds = []) => {
  let db = logininforMapper.deleteLogininforByIds(infoIds)
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}

/**
 * 清空系统登录日志
 */
let cleanLogininfor = async () => {
  return await dbconfig.sqlConnect(logininforMapper.cleanLogininfor)
}
module.exports = {
  cleanLogininfor,
  deleteLogininforByIds,
  startPage,
  selectLogininforList
}
