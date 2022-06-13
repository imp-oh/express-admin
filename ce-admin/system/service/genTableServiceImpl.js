/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 15:03:02
 * @LastEditTime: 2022-04-13 13:46:20
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const genTableMapper = require('@/system/db/genTableMapper')
const genTableColumnMapper = require('@/system/db/genTableColumnMapper')
const genUtils = require('@/enums/genUtils')
let GenConstants = require('@/enums/genConstants')
const { formatTime } = require('@/utils/validate')
/**
 * 查询业务列表
 *
 * @param genTable 业务信息
 * @return 业务集合
 */
let selectGenTableList = async (genTable = {}) => {
  let db = genTableMapper.selectGenTableList(genTable)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

let startPage = async (genTable = {}) => {
  let body = JSON.parse(JSON.stringify(genTable))
  delete body.pageNum
  delete body.pageSize
  let db = genTableMapper.selectGenTableList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 查询据库列表
 *
 * @param genTable 业务信息
 * @return 数据库表集合
 */
let selectDbTableList = async (genTable = {}) => {
  let db = genTableMapper.selectDbTableList(genTable)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

let datastartPage = async (genTable = {}) => {
  let body = JSON.parse(JSON.stringify(genTable))
  delete body.pageNum
  delete body.pageSize
  let db = genTableMapper.selectDbTableList(genTable)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 查询据库列表
 *
 * @param tableNames 表名称组
 * @return 数据库表集合
 */
let selectDbTableListByNames = async (tableNames = []) => {
  let db = genTableMapper.selectDbTableListByNames(tableNames)
  return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

/**
 * 导入表结构
 *
 * @param tableList 导入表列表
 * @param loginUser 登录用户信息
 */
let importGenTable = async (tableList = [], loginUser = {}) => {
  let operName = loginUser.userName

  for (var i = 0; i < tableList.length; i++) {
    let table = tableList[i]
    let tableName = table.tableName
    genUtils.initTable(table, operName)
    let db = genTableMapper.insertGenTable(table)
    let { affectedRows, insertId } = await dbconfig.sqlConnect(db.sqlString, db.value)
    table.tableId = insertId
    if (affectedRows > 0) {
      let genTableColumns = await dbconfig.sqlConnect(genTableColumnMapper.selectDbTableColumnsByName, tableName)
      for (var t = 0; t < genTableColumns.length; t++) {
        let column = genTableColumns[t]
        genUtils.initColumnField(column, table)
        column.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
        let insertdb = genTableColumnMapper.insertGenTableColumn(column)
        await dbconfig.sqlConnect(insertdb.sqlString, insertdb.value)
      }
    }
  }
}

/**
 * 查询业务信息
 *
 * @param id 业务ID
 * @return 业务信息
 */
let selectGenTableById = async (id = '') => {
  let GenTable = await dbconfig.sqlConnect(genTableMapper.selectGenTableById, id)

  GenTable = GenTableFun(GenTable)

  let [info] = GenTable
  let rows = {
    businessName: info.businessName,
    className: info.className,
    columns: GenTable,
    functionAuthor: info.functionAuthor,
    functionName: info.functionName,
    genPath: info.genPath,
    genType: info.genType,
    moduleName: info.moduleName,
    packageName: info.packageName,
    options: null,
    sub: isSub(info.tplCategory),
    tableComment: info.tableComment,
    tableId: info.tableId,
    tableName: info.tableName,
    tplCategory: info.tplCategory,
    tree: isTree(info.tplCategory)
  }

  // setTableFromOptions(genTable)
  return rows
}

let GenTableFun = GenTable => {
  GenTable.forEach(item => {
    item.edit = item.isEdit === '1'
    item.increment = item.isIncrement === '1'
    item.increment = item.isList === '1'
    item.pk = item.isPk === '1'
    item.query = item.isQuery === '1'
    item.required = item.isRequired === '1'
    item.superColumn = isSuperColumn(item.tplCategory, item.javaField)
    item.usableColumn = equalsAnyIgnoreCase(item.javaField, ['parentId', 'orderNum', 'remark'])
  })
  return GenTable
}

let isSub = tplCategory => {
  return tplCategory != null && GenConstants.TPL_SUB === tplCategory
}

let isSuperColumn = (tplCategory, javaField) => {
  if (isTree(tplCategory)) {
    let arr = GenConstants.TREE_ENTITY.concat(GenConstants.BASE_ENTITY)
    return equalsAnyIgnoreCase(javaField, arr)
  }
  return equalsAnyIgnoreCase(javaField, GenConstants.BASE_ENTITY)
}

let equalsAnyIgnoreCase = (value, arr) => {
  return arr.indexOf(value) > -1
}

let isTree = tplCategory => {
  return tplCategory != null && GenConstants.TPL_TREE === tplCategory
}

/**
 * 设置代码生成其他选项值
 *
 * @param genTable 设置后的生成对象
 */
let setTableFromOptions = async (genTable = []) => {
  if (genTable.length === 0) return genTable
  //  genTable = genTable.options
  // if (genTable != null) {
  // }
  // let [paramsObj = null] = genTable
  //  let  treeCode = paramsObj.getString(GenConstants.TREE_CODE);
}

/**
 * 查询所有表信息
 *
 * @return 表信息集合
 */
let selectGenTableAll = async () => {
  let list = await dbconfig.sqlConnect(genTableMapper.selectGenTableAll)
  console.log(list)
}

module.exports = {
  selectGenTableAll,
  GenTableFun,
  selectGenTableById,
  importGenTable,
  selectDbTableListByNames,
  datastartPage,
  selectDbTableList,
  startPage,
  selectGenTableList
}
