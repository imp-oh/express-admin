/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-11 21:01:29
 * @LastEditTime: 2022-04-12 13:08:11
 * @Description: ...每位新修改者自己的信息
 */

const { sqlFunKey, handlePage } = require('@/utils/mysql')

let selectOperLogVo =
  'select oper_id, title, business_type, method, request_method, operator_type, oper_name, dept_name, oper_url, oper_ip, oper_location, oper_param, json_result, status, error_msg, oper_time from sys_oper_log'

let selectOperLogList = (rows = {}) => {
  let { businessTypes = [] } = rows
  let sqlarr = [
    {
      key: 'title',
      sql: " AND title like concat('%', ?, '%') "
    },
    {
      key: 'businessType',
      sql: ' AND business_type = ? '
    },
    {
      key: 'businessTypes',
      sql: ` AND business_type in (${businessTypes.map(() => '?').join(',')}) `,
      isFun: true,
      where: 'key.length > 0'
    },
    {
      key: 'status',
      sql: ' AND status = ? ',
      isNull: true
    },
    {
      key: 'operName',
      sql: " AND oper_name like concat('%', ?, '%') "
    },
    {
      key: 'params.beginTime',
      sql: " and date_format(oper_time,'%y%m%d') >= date_format(?,'%y%m%d') "
    },
    {
      key: 'params.endTime',
      sql: " and date_format(oper_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = selectOperLogVo
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) (sqlString += ' order by oper_id desc '), sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let deleteOperLogByIds = (value = []) => {
  let sqlString = `delete from sys_oper_log where oper_id in (${value.map(() => '?').join(',')})`
  return {
    sqlString,
    value
  }
}

let cleanOperLog = 'truncate table sys_oper_log'

module.exports = {
  cleanOperLog,
  deleteOperLogByIds,
  selectOperLogVo,
  selectOperLogList
}
