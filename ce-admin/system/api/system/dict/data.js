/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-17 18:35:01
 * @LastEditTime: 2022-04-01 14:32:49
 * @Description: ...每位新修改者自己的信息
 * @RequestMapping("/system/dict/data")
 */

const { formatTime } = require('@/utils/validate')
const dictDataService = require('@/system/service/sysDictDataServiceImpl')
const dictTypeService = require('@/system/service/sysDictTypeServiceImpl')

/**
 * 根据字典类型查询字典数据信息
 *  @GetMapping(value = "/type/{dictType}")
 */
let type = async (req, res) => {
  const { dictType } = req.params
  let data = await dictTypeService.selectDictDataByType(dictType)

  res.send({
    data,
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 字典详情list
 *
 * @PreAuthorize("@ss.hasPermi('system:dict:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let total = await dictDataService.startPage(req.query)
  let list = []
  if (total > 0) list = await dictDataService.selectDictDataList(req.query)
  res.send({
    rows: list,
    code: 200,
    total: total,
    msg: '查询成功'
  })
}

/**
 * 查询字典数据详细
 * @PreAuthorize("@ss.hasPermi('system:dict:query')")
 * @GetMapping(value = "/{dictCode}")
 */
let getInfo = async (req, res) => {
  let { dictCode } = req.params
  let data = await dictDataService.selectDictDataById(dictCode)
  res.send({
    code: 200,
    msg: '查询成功',
    data: data || {}
  })
}

/**
 * 新增字典类型
 *  @PreAuthorize("@ss.hasPermi('system:dict:add')")
 */
let add = async (req, res) => {
  let { user } = req.loginUser
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await dictDataService.insertDictData(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 修改保存字典类型
 * @PreAuthorize("@ss.hasPermi('system:dict:edit')")
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await dictDataService.updateDictData(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 删除字典类型
 * @PreAuthorize("@ss.hasPermi('system:dict:remove')")
 * @DeleteMapping("/{dictCodes}")
 */
let remove = async (req, res) => {
  let { dictCodes } = req.params
  await dictDataService.deleteDictDataByIds(dictCodes)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}
module.exports = {
  remove,
  edit,
  getInfo,
  add,
  list,
  type
}
