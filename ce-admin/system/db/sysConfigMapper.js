/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 14:04:17
 * @LastEditTime: 2022-04-01 16:17:30
 * @Description: ...每位新修改者自己的信息
 */

const { handlePage, sqlFunKey } = require('@/utils/mysql')


let selectConfigVo = 'select config_id, config_name, config_key, config_value, config_type, create_by, create_time, update_by, update_time, remark from sys_config'

let selectConfigList = (rows = {}) => {
  let sqlarr = [
    {
      key: 'configName',
      sql: " AND config_name like concat('%', ?, '%') "
    },
    {
      key: 'configType',
      sql: ' AND config_type = ? '
    },
    {
      key: 'configKey',
      sql: " AND config_key like concat('%', ?, '%') "
    },
    {
      key: 'params.beginTime',
      sql: " and date_format(create_time,'%y%m%d') >= date_format(?,'%y%m%d')"
    },
    {
      key: 'params.endTime',
      sql: " and date_format(create_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]
  let sqlString = selectConfigVo
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

let selectConfig = (rows = {}) => {
  let sqlarr = [
    {
      key: 'configId',
      sql: ' and config_id = ? '
    },
    {
      key: 'configKey',
      sql: ' and config_key =? '
    }
  ]
  let sqlString = selectConfigVo
  let sqlRow = sqlFunKey(rows, sqlarr)

  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))
  return {
    sqlString,
    value: sqlRow.value
  }
}

let insertConfig = (rows = {}) => {
  let sqlarr = [
    {
      key: 'configName',
      sql: ' config_name, '
    },
    {
      key: 'configKey',
      sql: ' config_key, '
    },
    {
      key: 'configValue',
      sql: ' config_value, '
    },
    {
      key: 'configType',
      sql: ' config_type, '
    },
    {
      key: 'createBy',
      sql: ' create_by, '
    },
    {
      key: 'remark',
      sql: ' remark, '
    },
    {
      key: 'createTime',
      sql: ' create_time '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_config (${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`
  return {
    sqlString,
    value: sqlRow.value
  }
}

let checkConfigKeyUnique = selectConfigVo + '  where config_key = ? limit 1'

let updateConfig = (rows = {}) => {
  let sqlarr = [
    {
      key: 'configName',
      sql: ' config_name=?, '
    },
    {
      key: 'configKey',
      sql: ' config_key=?, '
    },
    {
      key: 'configValue',
      sql: ' config_value=?, '
    },
    {
      key: 'configType',
      sql: ' config_type=?, '
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
      sql: ' update_time=? '
    },
    {
      key: 'configId',
      sql: ' where config_id = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `update sys_config set ${sqlRow.sqlString}`
  return {
    sqlString,
    value: sqlRow.value
  }
}

let deleteConfigById = ' delete from sys_config where config_id = ?'

module.exports = {
  deleteConfigById,
  updateConfig,
  checkConfigKeyUnique,
  insertConfig,
  selectConfig,
  selectConfigVo,
  selectConfigList
}
