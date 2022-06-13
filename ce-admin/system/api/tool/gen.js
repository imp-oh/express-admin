/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:58:52
 * @LastEditTime: 2022-04-13 13:49:20
 * @Description: ...每位新修改者自己的信息
 */
const { formatTime } = require('@/utils/validate')
const genTableService = require('@/system/service/genTableServiceImpl')
const genTableColumnService = require('@/system/service/genTableColumnServiceImpl')

/**
 * 查询代码生成列表
 * @PreAuthorize("@ss.hasPermi('tool:gen:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let total = await genTableService.startPage(req.query)
  let list = []
  if (total > 0) list = await genTableService.selectGenTableList(req.query)
  res.send({
    msg: '查询成功',
    code: 200,
    rows: list,
    total: total
  })
}

/**
 * 查询数据库列表
 * @PreAuthorize("@ss.hasPermi('tool:gen:list')")
 * @GetMapping("/db/list")
 */
let dataList = async (req, res) => {
  let total = await genTableService.datastartPage()
  let list = []
  if (total > 0) list = await genTableService.selectDbTableList(req.query)

  res.send({
    msg: '查询成功',
    code: 200,
    rows: list || [],
    total: total
  })
}

/**
 * 导入表结构（保存）
 * @PreAuthorize("@ss.hasPermi('tool:gen:import')")
 * @PostMapping("/importTable")
 */
let importTableSave = async (req, res) => {
  let { user } = req.loginUser
  let { tables } = req.query
  let tableNames = []
  if (tables.length !== 0) tableNames = tables.split(',')
  let tableList = await genTableService.selectDbTableListByNames(tableNames)
  await genTableService.importGenTable(tableList, user)
  res.send({
    msg: '操作成功',
    code: 200
  })
}

/**
 * 修改代码生成业务
 * @PreAuthorize("@ss.hasPermi('tool:gen:query')")
 *  @GetMapping(value = "/{tableId}")
 */
let getInfo = async (req, res) => {
  let { tableId } = req.params
  let table = await genTableService.selectGenTableById(tableId)
  let tables = await genTableService.selectGenTableAll()
  let list = await genTableColumnService.selectGenTableColumnListByTableId(tableId)
  res.send({
    code: 200,
    msg: '操作成功',
    data:{
      info: table,
      rows: list,
      tables: tables
    }
  })
}

module.exports = {
  getInfo,
  importTableSave,
  dataList,
  list
}
