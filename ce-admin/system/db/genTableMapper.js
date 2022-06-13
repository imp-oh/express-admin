/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 15:05:28
 * @LastEditTime: 2022-04-13 13:50:13
 * @Description: ...每位新修改者自己的信息
 */
const { handlePage, sqlFunKey } = require('@/utils/mysql')

let selectGenTableVo =
  'select table_id, table_name, table_comment, sub_table_name, sub_table_fk_name, class_name, tpl_category, package_name, module_name, business_name, function_name, function_author, gen_type, gen_path, options, create_by, create_time, update_by, update_time, remark from gen_table '

let selectGenTableList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'tableName',
      sql: " AND lower(table_name) like lower(concat('%', ?, '%')) "
    },
    {
      key: 'tableComment',
      sql: " AND lower(table_comment) like lower(concat('%', ?, '%')) "
    },
    {
      key: 'params.beginTime',
      sql: " AND date_format(create_time,'%y%m%d') >= date_format(?,'%y%m%d') "
    },
    {
      key: 'params.endTime',
      sql: " AND date_format(create_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = selectGenTableVo
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectDbTableList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'tableName',
      sql: " AND lower(table_name) like lower(concat('%',?, '%')) "
    },
    {
      key: 'tableComment',
      sql: " AND lower(table_comment) like lower(concat('%', ?, '%')) "
    },
    {
      key: 'params.beginTime',
      sql: " AND date_format(create_time,'%y%m%d') >= date_format(?,'%y%m%d') "
    },
    {
      key: 'params.endTime',
      sql: " AND date_format(create_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]

  let sqlString = `select table_name, table_comment, create_time, update_time from information_schema.tables
  where table_schema = (select database())
  AND table_name NOT LIKE 'qrtz_%' AND table_name NOT LIKE 'gen_%'
  AND table_name NOT IN (select table_name from gen_table) `
  let sqlRow = sqlFunKey(rows, sqlarr)
  if (sqlRow.value.length > 0) sqlString += sqlRow.sqlString

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) (sqlString += '  order by create_time desc '), sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')
  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectDbTableListByNames = (value = []) => {
  let sqlString = `select table_name, table_comment, create_time, update_time from information_schema.tables
  where table_name NOT LIKE 'qrtz_%' and table_name NOT LIKE 'gen_%' and table_schema = (select database())
  and table_name in (${value.map(() => '?').join(',')})`
  return {
    sqlString,
    value
  }
}

let insertGenTable = (rows = {}) => {
  let sqlarr = [
    {
      key: 'tableName',
      sql: ' table_name, ',
      isNull: true
    },
    {
      key: 'tableComment',
      sql: ' table_comment, '
    },
    {
      key: 'className',
      sql: ' class_name, '
    },
    {
      key: 'tplCategory',
      sql: ' tpl_category, '
    },
    {
      key: 'packageName',
      sql: ' package_name, '
    },
    {
      key: 'moduleName',
      sql: ' module_name, '
    },
    {
      key: 'businessName',
      sql: ' business_name, '
    },
    {
      key: 'functionName',
      sql: ' function_name, '
    },
    {
      key: 'functionAuthor',
      sql: ' function_author, '
    },
    {
      key: 'genType',
      sql: ' genType, '
    },
    {
      key: 'genPath',
      sql: ' genPath, '
    },
    {
      key: 'remark',
      sql: ' remark, '
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
  let sqlString = `insert into gen_table (${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectGenTableById = `SELECT t.table_id, t.table_name, t.table_comment, t.sub_table_name, t.sub_table_fk_name, t.class_name, t.tpl_category, t.package_name, t.module_name, t.business_name, t.function_name, t.function_author, t.gen_type, t.gen_path, t.options, t.remark,
c.column_id, c.column_name, c.column_comment, c.column_type, c.java_type, c.java_field, c.is_pk, c.is_increment, c.is_required, c.is_insert, c.is_edit, c.is_list, c.is_query, c.query_type, c.html_type, c.dict_type, c.sort
FROM gen_table t LEFT JOIN gen_table_column c ON t.table_id = c.table_id where t.table_id = ? order by c.sort`


let selectGenTableAll = `SELECT t.table_id, t.table_name, t.table_comment, t.sub_table_name, t.sub_table_fk_name, t.class_name, t.tpl_category, t.package_name, t.module_name, t.business_name, t.function_name, t.function_author, t.options, t.remark,
c.column_id, c.column_name, c.column_comment, c.column_type, c.java_type, c.java_field, c.is_pk, c.is_increment, c.is_required, c.is_insert, c.is_edit, c.is_list, c.is_query, c.query_type, c.html_type, c.dict_type, c.sort
FROM gen_table t LEFT JOIN gen_table_column c ON t.table_id = c.table_id order by c.sort`

module.exports = {
  selectGenTableAll,
  selectGenTableById,
  insertGenTable,
  selectDbTableListByNames,
  selectDbTableList,
  selectGenTableList
}
