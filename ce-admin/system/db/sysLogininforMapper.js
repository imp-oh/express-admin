/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 11:34:17
 * @LastEditTime: 2022-04-12 13:18:13
 * @Description: ...每位新修改者自己的信息
 */
const { sqlFunKey, handlePage } = require('@/utils/mysql')

let insertLogininfor =
  'insert into sys_logininfor (user_name, status, ipaddr, login_location, browser, os, msg, login_time) values (#{userName}, #{status}, #{ipaddr}, #{loginLocation}, #{browser}, #{os}, #{msg}, sysdate())'

let selectLogininforList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'ipaddr',
      sql: " AND ipaddr like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    },
    {
      key: 'userName',
      sql: " AND user_name like concat('%', ?, '%') "
    },
    {
      key: 'params.beginTime',
      sql: "and date_format(login_time,'%y%m%d') >= date_format(?,'%y%m%d')"
    },
    {
      key: 'params.endTime',
      sql: "and date_format(login_time,'%y%m%d') <= date_format(?,'%y%m%d')"
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = 'select info_id, user_name, ipaddr, login_location, browser, os, status, msg, login_time from sys_logininfor '
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) (sqlString += ' order by login_time desc '), sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let deleteLogininforByIds = (value = []) => {
  return {
    sqlString: `delete from sys_logininfor where info_id in (${value.map(() => '?').join(',')})`,
    value
  }
}

let cleanLogininfor = 'truncate table sys_logininfor'
module.exports = {
  cleanLogininfor,
  deleteLogininforByIds,
  insertLogininfor,
  selectLogininforList
}
