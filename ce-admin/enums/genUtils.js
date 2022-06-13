/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 16:42:12
 * @LastEditTime: 2022-04-13 10:55:27
 * @Description: ...每位新修改者自己的信息
 */
const { toUpperCaseAll, toHump } = require('@/utils/mysql')
const { formatTime } = require('@/utils/validate')
const GenConstants = require('@/enums/genConstants')

/**
 * 初始化表信息
 */
let initTable = (genTable = {}, operName = '') => {
  let tableName = genTable.tableName
  genTable.operName = operName
  genTable.className = toUpperCaseAll(tableName)
  genTable.packageName = 'com.ruoyi.system'
  genTable.moduleName = 'system'
  let splitTableName = tableName.split('_')
  genTable.businessName = splitTableName[splitTableName.length - 1]
  genTable.functionName = genTable.tableComment.replace(/表$/gi, '')
  genTable.functionAuthor = 'gitce'
  genTable.createBy = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

  return genTable
}

/**
 * 初始化列属性字段
 */
let initColumnField = (column = {}, table = {}) => {
  let dataType = getDbType(column.columnType)
  let columnName = column.columnName
  column.tableId = table.tableId
  column.createBy = table.createBy
  column.javaField = toHump(columnName)
  // 设置默认类型
  column.javaType = GenConstants.TYPE_STRING
  column.queryType = GenConstants.QUERY_EQ
  if (arraysContains(GenConstants.COLUMNTYPE_STR, dataType) || arraysContains(GenConstants.COLUMNTYPE_TEXT, dataType)) {
    // 字符串长度超过500设置为文本域
    let columnLength = getColumnLength(column.columnType)
    let htmlType =
      columnLength >= 500 || arraysContains(GenConstants.COLUMNTYPE_TEXT, dataType) ? GenConstants.HTML_TEXTAREA : GenConstants.HTML_INPUT
    column.htmlType = htmlType
  } else if (arraysContains(GenConstants.COLUMNTYPE_TIME, dataType)) {
    column.javaType = GenConstants.TYPE_DATE
    column.htmlType = GenConstants.HTML_DATETIME
  } else if (arraysContains(GenConstants.COLUMNTYPE_NUMBER, dataType)) {
    column.htmlType = GenConstants.HTML_INPUT
    // 如果是浮点型 统一用BigDecimal
    let columnType = column.columnType.substring(column.columnType.indexOf('(') + 1, column.columnType.length - 1)
    let str = columnType.split(',')
    if (str != null && str.length == 2 && parseInt(str[1]) > 0) {
      column.javaType = GenConstants.TYPE_BIGDECIMAL
    } else if (str != null && str.length == 1 && parseInt(str[0]) <= 10) {
      // 如果是整形
      column.javaType = GenConstants.TYPE_INTEGER
    } else {
      column.javaType = GenConstants.TYPE_LONG
    }
  }
  // 插入字段（默认所有字段都需要插入）
  column.isInsert = GenConstants.REQUIRE
  // 编辑字段
  if (!arraysContains(GenConstants.COLUMNNAME_NOT_EDIT, columnName) && !isPK(column.isPk)) {
    column.isEdit = GenConstants.REQUIRE
  }
  // 列表字段
  if (!arraysContains(GenConstants.COLUMNNAME_NOT_LIST, columnName) && !isPK(column.isPk)) {
    column.isList = GenConstants.REQUIRE
  }
  // 查询字段
  if (!arraysContains(GenConstants.COLUMNNAME_NOT_QUERY, columnName) && !isPK(column.isPk)) {
    column.isQuery = GenConstants.REQUIRE
  }
  // 查询字段类型
  if (endsWithIgnoreCase(columnName, 'name')) {
    column.queryType = GenConstants.QUERY_LIKE
  }
  // 状态字段设置单选框
  if (endsWithIgnoreCase(columnName, 'status')) {
    column.htmlType = GenConstants.HTML_RADIO
  } else if (endsWithIgnoreCase(columnName, 'type') || endsWithIgnoreCase(columnName, 'sex')) {
    // 类型&性别字段设置下拉框
    column.htmlType = GenConstants.HTML_SELECT
  } else if (endsWithIgnoreCase(columnName, 'image')) {
    // 图片字段设置图片上传控件
    column.htmlType = GenConstants.HTML_IMAGE_UPLOAD
  } else if (endsWithIgnoreCase(columnName, 'file')) {
    // 文件字段设置文件上传控件
    column.htmlType = GenConstants.HTML_FILE_UPLOAD
  } else if (endsWithIgnoreCase(columnName, 'content')) {
    // 内容字段设置富文本控件
    column.htmlType = GenConstants.HTML_EDITOR
  }
}

let endsWithIgnoreCase = (arr, str) => {
  return arr.indexOf(str) > -1
}

let isPK = isPk => {
  return isPk != null && isPk == '1'
}

/**
 * 校验数组是否包含指定值
 *
 * @param arr 数组
 * @param targetValue 值
 * @return 是否包含
 */
let arraysContains = (arr, targetValue) => {
  return arr.indexOf(targetValue) > -1
}

/**
 * 获取数据库类型字段
 *
 * @param columnType 列类型
 * @return 截取后的列类型
 */
let getDbType = (columnType = '') => {
  if (columnType.length === 0) return columnType
  if (columnType.indexOf('(') > 0) columnType = columnType.split('(')[0]
  return columnType
}

/**
 * 获取字段长度
 *
 * @param columnType 列类型
 * @return 截取后的列类型
 */
let getColumnLength = columnType => {
  if (columnType.indexOf('(') > 0) return columnType.substring(columnType.indexOf('(') + 1, columnType.length - 1)
  return columnType
}

module.exports = {
  initColumnField,
  initTable
}
