/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-31 11:02:47
 * @LastEditTime: 2022-04-01 16:18:15
 * @Description: ...每位新修改者自己的信息
 */

const { handlePage, sqlFunKey } = require('@/utils/mysql')
const mysql = require('mysql')

let selectDictTypeVo = 'select dict_id, dict_name, dict_type, status, create_by, create_time, remark from sys_dict_type '

let selectDictTypeList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictName',
      sql: " AND dict_name like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    },
    {
      key: 'dictType',
      sql: " AND dict_type like concat('%', ?, '%') "
    },
    {
      key: 'params.beginTime',
      sql: " and date_format(create_time,'%y%m%d') >= date_format(?,'%y%m%d') "
    },
    {
      key: 'params.endTime',
      sql: " and date_format(create_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]

  let sqlString = selectDictTypeVo
  let sqlRow = sqlFunKey(rows, sqlarr)

  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let checkDictTypeUnique = selectDictTypeVo + ' where dict_type = ? limit 1'

let insertDictType = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictName',
      sql: ' dict_name, '
    },
    {
      key: 'dictType',
      sql: ' dict_type, '
    },
    {
      key: 'status',
      sql: ' status, ',
      isNull: true
    },
    {
      key: 'remark',
      sql: ' remark, ',
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
  let sqlString = `insert into sys_dict_type (${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectDictTypeById = selectDictTypeVo + 'where dict_id = ? '

let updateDictType = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictName',
      sql: ' dict_name = ? , '
    },
    {
      key: 'dictType',
      sql: ' dict_type = ? , '
    },
    {
      key: 'status',
      sql: ' `status` = ? , ',
      isNull: true
    },
    {
      key: 'remark',
      sql: ' remark = ? , ',
      isNull: true
    },
    {
      key: 'updateBy',
      sql: ' update_by = ? , '
    },
    {
      key: 'updateTime',
      sql: ' update_time = ? '
    },
    {
      key: 'dictId',
      sql: ' WHERE dict_id = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = 'update sys_dict_type SET ' + sqlRow.sqlString
  return {
    sqlString,
    value: sqlRow.value
  }
}

let deleteDictTypeById = 'delete from sys_dict_type where dict_id = ?'

module.exports = {
  deleteDictTypeById,
  updateDictType,
  selectDictTypeById,
  insertDictType,
  checkDictTypeUnique,
  selectDictTypeList
}
