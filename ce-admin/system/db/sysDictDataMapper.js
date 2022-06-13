/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-31 15:16:24
 * @LastEditTime: 2022-04-01 16:18:04
 * @Description: ...每位新修改者自己的信息
 */

const { handlePage, sqlFunKey } = require('@/utils/mysql')
const mysql = require('mysql')

let selectDictDataVo = 'select dict_code, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark from sys_dict_data '

let updateDictDataType = 'update sys_dict_data set dict_type = ? where dict_type = ?'

let selectDictDataByType = selectDictDataVo + " where status = '0' and dict_type = ? order by dict_sort asc"

let selectDictDataById = selectDictDataVo + ' where dict_code = ?'

let selectDictDataList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictType',
      sql: ' AND dict_type = ? '
    },
    {
      key: 'dictLabel',
      sql: " AND dict_label like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    }
  ]
  let sqlString = selectDictDataVo
  let sqlRow = sqlFunKey(rows, sqlarr)
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))
  sqlString += ' order by dict_sort asc '

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let countDictDataByType = 'select count(1) as countNum from sys_dict_data where dict_type= ? '

let insertDictData = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictSort',
      sql: ' dict_sort, ',
      isNull: true
    },
    {
      key: 'dictLabel',
      sql: ' dict_label, '
    },
    {
      key: 'dictValue',
      sql: ' dict_value, '
    },
    {
      key: 'dictType',
      sql: ' dict_type, '
    },
    {
      key: 'cssClass',
      sql: ' css_class, ',
      isNaN:true
    },
    {
      key: 'listClass',
      sql: ' list_class, '
    },
    {
      key: 'isDefault',
      sql: ' is_default, '
    },
    {
      key: 'status',
      sql: ' status, ',
      isNull: true
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
  let sqlString = `insert into sys_dict_data (${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let updateDictData = (rows = {}) => {
  let sqlarr = [
    {
      key: 'dictSort',
      sql: ' dict_sort=?, ',
      isNull: true
    },
    {
      key: 'dictLabel',
      sql: ' dict_label=?, '
    },
    {
      key: 'dictValue',
      sql: ' dict_value=?, '
    },
    {
      key: 'dictType',
      sql: ' dict_type=?, '
    },
    {
      key: 'cssClass',
      sql: ' css_class=?, ',
      isNull:true
    },
    {
      key: 'listClass',
      sql: ' list_class=?, '
    },
    {
      key: 'isDefault',
      sql: ' is_default=?, '
    },
    {
      key: 'status',
      sql: ' status=?, ',
      isNull: true
    },
    {
      key: 'remark',
      sql: ' remark=?, ',
      isNull: true
    },
    {
      key: 'updateBy',
      sql: ' update_by=?, '
    },
    {
      key: 'updateTime',
      sql: ' update_time =? '
    },
    {
      key: 'dictCode',
      sql: ' where dict_code = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `update sys_dict_data set ${sqlRow.sqlString}`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let deleteDictDataById = 'delete from sys_dict_data where dict_code = ?'

module.exports = {
  deleteDictDataById,
  updateDictData,
  selectDictDataById,
  insertDictData,
  countDictDataByType,
  selectDictDataList,
  selectDictDataByType,
  updateDictDataType
}
