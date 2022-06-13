/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:23:29
 * @LastEditTime: 2022-04-12 14:44:33
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const jobMapper = require('@/system/db/sysJobMapper')

/**
 * 获取quartz调度器的计划任务列表
 *
 * @param job 调度信息
 * @return
 */
let selectJobList = async (job = {}) => {
  let db = jobMapper.selectJobList(job)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

let startPage = async (job = {}) => {
  let body = JSON.parse(JSON.stringify(job))
  delete body.pageNum
  delete body.pageSize
  let db = jobMapper.selectJobList(job)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 通过调度任务ID查询调度信息
 *
 * @param jobId 调度任务ID
 * @return 调度任务对象信息
 */
let selectJobById = async jobId => {
  let [info] = await dbconfig.sqlConnect(jobMapper.selectJobById, jobId, 'yyyy-MM-dd HH:mm:ss')
  return info
}

module.exports = {
  selectJobById,
  startPage,
  selectJobList
}
