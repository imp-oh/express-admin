/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-31 10:55:10
 * @LastEditTime: 2022-04-01 11:34:51
 * @Description: ...每位新修改者自己的信息
 */
const dictTypeService = require('@/system/service/sysDictTypeServiceImpl')
const userConstants = require('@/enums/userConstants')
const { formatTime } = require('@/utils/validate')

let errorTile = (name, title, userId) => {
  return {
    msg: `${userId ? '修改' : '新增'}字典'${name}'失败，${title}已存在`,
    code: 500,
  }
}

let list = async (req, res) => {
  let startPage = await dictTypeService.startPage(req.query)
  let rows = await dictTypeService.selectDictTypeList(req.query)
  res.send({
    code: 200,
    msg: '查询成功',
    rows: rows,
    total: startPage,
  })
}

let add = async (req, res) => {
  let { user } = req.loginUser
  let { dictName } = req.body
  let isDictTypeU = await dictTypeService.checkDictTypeUnique(req.body)
  if (userConstants.NOT_UNIQUE === isDictTypeU) throw errorTile(dictName, '字典类型')
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

  await dictTypeService.insertDictType(req.body)
  res.send({
    code: 200,
    msg: '查询成功',
  })
}

/**
 * 查询字典类型详细
 * @PreAuthorize("@ss.hasPermi('system:dict:query')")
 * @GetMapping(value = "/{dictId}")
 */
let getInfo = async (req, res) => {
  let { dictId } = req.params
  let data = await dictTypeService.selectDictTypeById(dictId)
  res.send({
    code: 200,
    msg: '查询成功',
    data: data || {},
  })
}

/**
 * 修改字典类型
 * @PreAuthorize("@ss.hasPermi('system:dict:edit')")
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  if (userConstants.NOT_UNIQUE === (await dictTypeService.checkDictTypeUnique(req.body))) throw errorTile(dictName, '字典类型')

  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

  await dictTypeService.updateDictType(req.body)
  res.send({
    code: 200,
    msg: '操作成功',
  })
}

/**
 * 刷新字典缓存
 * @PreAuthorize("@ss.hasPermi('system:dict:remove')")
 * @DeleteMapping("/refreshCache")
 */
let refreshCache = async (req, res) => {
  await dictTypeService.resetDictCache()
  res.send({
    code: 200,
    msg: '操作成功',
  })
}

/**
 * 删除字典类型
 * @PreAuthorize("@ss.hasPermi('system:dict:remove')")
 * @DeleteMapping("/{dictIds}")
 */
let remove = async (req, res) => {
  let { dictIds } = req.params
  await dictTypeService.deleteDictTypeByIds(dictIds)

  res.send({
    code: 200,
    msg: '操作成功',
  })
}

module.exports = {
  remove,
  refreshCache,
  edit,
  getInfo,
  add,
  list,
}
