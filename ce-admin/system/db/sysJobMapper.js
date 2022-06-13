/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:25:52
 * @LastEditTime: 2022-04-12 14:43:52
 * @Description: ...每位新修改者自己的信息
 */
const { sqlFunKey, handlePage } = require('@/utils/mysql')

let selectJobVo =
  'select job_id, job_name, job_group, invoke_target, cron_expression, misfire_policy, concurrent, status, create_by, create_time, remark from sys_job'

let selectJobList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'jobName',
      sql: " AND job_name like concat('%', ?, '%') "
    },
    {
      key: 'jobGroup',
      sql: ' AND job_group = ? '
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    },
    {
      key: 'invokeTarget',
      sql: " AND invoke_target like concat('%', ?, '%') "
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = selectJobVo
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectJobById = selectJobVo + ' where job_id = ?'

module.exports = {
  selectJobById,
  selectJobList
}
