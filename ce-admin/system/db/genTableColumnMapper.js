/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 16:35:16
 * @LastEditTime: 2022-04-13 13:39:12
 * @Description: ...每位新修改者自己的信息
 */
const { handlePage, sqlFunKey } = require('@/utils/mysql')

let selectGenTableColumnVo ="select column_id, table_id, column_name, column_comment, column_type, java_type, java_field, is_pk, is_increment, is_required, is_insert, is_edit, is_list, is_query, query_type, html_type, dict_type, sort, create_by, create_time, update_by, update_time from gen_table_column "

let selectDbTableColumnsByName = `select column_name, (case when (is_nullable = 'no' && column_key != 'PRI') then '1' else null end) as is_required, (case when column_key = 'PRI' then '1' else '0' end) as is_pk, ordinal_position as sort, column_comment, (case when extra = 'auto_increment' then '1' else '0' end) as is_increment, column_type
from information_schema.columns where table_schema = (select database()) and table_name = (?) order by ordinal_position`

let insertGenTableColumn = (rows = {}) => {
  let sqlarr = [
    {
      key: 'tableId',
      sql: ' table_id, '
    },
    {
      key: 'columnName',
      sql: ' column_name, '
    },
    {
      key: 'columnComment',
      sql: ' column_comment, '
    },
    {
      key: 'columnType',
      sql: ' column_type, '
    },
    {
      key: 'javaType',
      sql: ' java_type, '
    },
    {
      key: 'javaField',
      sql: ' java_field, '
    },
    {
      key: 'isPk',
      sql: ' is_pk, '
    },
    {
      key: 'isIncrement',
      sql: ' is_increment, '
    },
    {
      key: 'isRequired',
      sql: ' is_required, '
    },
    {
      key: 'isInsert',
      sql: ' is_insert, '
    },
    {
      key: 'isEdit',
      sql: ' is_edit, '
    },
    {
      key: 'isList',
      sql: ' is_list, '
    },
    {
      key: 'isQuery',
      sql: ' is_query, '
    },
    {
      key: 'queryType',
      sql: ' query_type, '
    },
    {
      key: 'htmlType',
      sql: ' html_type, '
    },
    {
      key: 'dictType',
      sql: ' dict_type, '
    },
    {
      key: 'sort',
      sql: ' sort, ',
      isNull: true
    },
    {
      key: 'createBy',
      sql: ' create_by, '
    },
    {
      key: 'createTime',
      sql: ' create_time '
    }
  ]
  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into gen_table_column (${sqlRow.sqlString}) values(${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectGenTableColumnListByTableId =  selectGenTableColumnVo + " where table_id = ? order by sort"

module.exports = {
  selectGenTableColumnListByTableId,
  insertGenTableColumn,
  selectDbTableColumnsByName
}
