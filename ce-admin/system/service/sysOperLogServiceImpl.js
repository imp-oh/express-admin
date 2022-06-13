/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-11 21:01:16
 * @LastEditTime: 2022-04-12 11:34:53
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const operLogMapper = require('@/system/db/sysOperLogMapper')

/**
 * 查询公告列表总条数
 *
 * @param notice 公告信息
 * @return 公告集合
 */
let startPage = async (operLog = {}) => {
  let body = JSON.parse(JSON.stringify(operLog))
  delete body.pageNum
  delete body.pageSize
  if (body.businessTypes && body.businessTypes.length !== 0 && typeof body.businessTypes === 'string')
    body.businessTypes = body.businessTypes.split(',')
  else if (body.businessTypes && body.businessTypes.length === 0) body.businessTypes = []
  let db = operLogMapper.selectOperLogList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 查询系统操作日志集合
 *
 * @param operLog 操作日志对象
 * @return 操作日志集合
 */
let selectOperLogList = async (operLog = {}) => {
  if (operLog.businessTypes && operLog.businessTypes.length !== 0 && typeof body.businessTypes === 'string')
    operLog.businessTypes = operLog.businessTypes.split(',')
  else if (operLog.businessTypes && operLog.businessTypes.length === 0) operLog.businessTypes = []
  let db = operLogMapper.selectOperLogList(operLog)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

/**
 * 批量删除系统操作日志
 *
 * @param operIds 需要删除的操作日志ID
 * @return 结果
 */
let deleteOperLogByIds = async (operIds = []) => {
  let db = operLogMapper.deleteOperLogByIds(operIds)
  return await dbconfig.sqlConnect(db.sqlString, db.value)
}

/**
 * 清空操作日志
 */
let cleanOperLog = async () => {
  return await dbconfig.sqlConnect(operLogMapper.cleanOperLog)
}

module.exports = {
  cleanOperLog,
  deleteOperLogByIds,
  startPage,
  selectOperLogList
}
