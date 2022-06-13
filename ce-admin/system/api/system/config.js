/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-18 10:27:36
 * @LastEditTime: 2022-04-01 16:14:17
 * @Description: ...每位新修改者自己的信息
 * @RequestMapping("/system/config")
 */

const { formatTime } = require('@/utils/validate')
const configService = require('@/system/service/sysConfigServiceImpl')
const userConstants = require('@/enums/userConstants')

/**
 * 根据参数键名查询参数值
 * @GetMapping(value = "/configKey/{configKey}")
 */
let getConfigKey = async (req, res) => {
  const { configKey = '' } = req.params
  let key = await configService.selectConfigByKey(configKey)

  res.send({
    code: 200,
    msg: key
  })
}

/**
 * 获取参数配置列表
 *  @PreAuthorize("@ss.hasPermi('system:config:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let rows = []
  let total = await configService.startPage(req.query)
  if (total > 0) rows = await configService.selectConfigList(req.query)
  res.send({
    code: 200,
    rows: rows,
    total: total,
    msg: '查询成功'
  })
}

/**
 * 新增参数配置
 * @PreAuthorize("@ss.hasPermi('system:config:add')")
 */
let add = async (req, res) => {
  let { user } = req.loginUser
  let { configName } = req.body
  if (userConstants.NOT_UNIQUE === (await configService.checkConfigKeyUnique(req.body))) throw { code: 500, msg: `新增参数${configName}失败，参数键名已存在` }
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await configService.insertConfig(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 修改参数配置
 *  @PreAuthorize("@ss.hasPermi('system:config:edit')")
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  let { configName } = req.body
  if (userConstants.NOT_UNIQUE === (await configService.checkConfigKeyUnique(req.body))) throw { code: 500, msg: `修改参数${configName}失败，参数键名已存在` }
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await configService.updateConfig(req.body)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 根据参数编号获取详细信息
 * @PreAuthorize("@ss.hasPermi('system:config:query')")
 * @GetMapping(value = "/{configId}")
 */
let getInfo = async (req, res) => {
  let { configId } = req.params
  let data = await configService.selectConfigById(configId)
  res.send({
    code: 200,
    msg: '操作成功',
    data
  })
}

/**
 * 删除参数配置
 * @PreAuthorize("@ss.hasPermi('system:config:remove')")
 * @DeleteMapping("/{configIds}")
 */
let remove = async (req, res) => {
  let { configIds } = req.params
  await configService.deleteConfigByIds(configIds)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 * 刷新参数缓存
 *  @PreAuthorize("@ss.hasPermi('system:config:remove')")
 * @DeleteMapping("/refreshCache")
 */
let refreshCache = async (req, res) => {
  await configService.resetConfigCache()
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

module.exports = {
  refreshCache,
  remove,
  edit,
  getInfo,
  add,
  list,
  getConfigKey
}
