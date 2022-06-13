/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-13 13:35:33
 * @LastEditTime: 2022-04-13 13:44:52
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const genTableMapper = require('@/system/db/genTableMapper')
const genTableColumnMapper = require('@/system/db/genTableColumnMapper')
const genUtils = require('@/enums/genUtils')
let GenConstants = require('@/enums/genConstants')
const { formatTime } = require('@/utils/validate')
const { GenTableFun } = require('./genTableServiceImpl')

/**
 * 查询业务字段列表
 *
 * @param tableId 业务字段编号
 * @return 业务字段集合
 */
let selectGenTableColumnListByTableId = async (tableId = '') => {
  let list = await dbconfig.sqlConnect(genTableColumnMapper.selectGenTableColumnListByTableId, tableId,'yyyy-MM-dd HH:mm:ss')
  return GenTableFun(list)
}

module.exports = {
  selectGenTableColumnListByTableId
}
