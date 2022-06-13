/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 13:45:48
 * @LastEditTime: 2022-04-09 10:22:55
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const redis = require('@/utils/redis')
const { constants } = require('@/config')
const { formatTime } = require('@/utils/validate')
const configMapper = require('@/system/db/sysConfigMapper')
const captchapng = require('captchapng')
const userConstants = require('@/enums/userConstants')

/**
 * 根据键名查询参数配置信息
 *
 * @param configKey 参数key
 * @return 参数键值
 */
let selectConfigByKey = async (configKey = '') => {
  let name = constants.SYS_CONFIG_KEY + configKey
  let key = await redis.get(name)
  if (key) {
    return key
  }
  let db = configMapper.selectConfig({ configKey })
  let [info] = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
  if (info) redis.set(name, info.configValue)
  return info.configValue
}

/**
 * 获取验证码开关
 *
 * @return true开启，false关闭
 */

let selectCaptchaOnOff = async () => {
  let configValue = await selectConfigByKey('sys.account.captchaOnOff')
  return configValue === 'true'
}

/**
 *  验证码生成
 * @returns
 */
let captcha = () => {
  // 第三方插件，
  let captchaVal = parseInt(Math.random() * 9000 + 1000)
  var p = new captchapng(80, 38, captchaVal)
  p.color(0, 0, 0, 0)
  p.color(80, 80, 80, 255)
  var img = p.getBase64()
  //验证码存redis
  return {
    img: 'data:image/png;base64,' + img,
    code: captchaVal
  }
}

/**
 * 查询参数配置列表
 *
 * @param config 参数配置信息
 * @return 参数配置集合
 */
let selectConfigList = async (config = {}) => {
  let db = configMapper.selectConfigList(config)
  return dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}

let startPage = async (config = {}) => {
  let body = JSON.parse(JSON.stringify(config))
  delete body.pageNum
  delete body.pageSize
  let db = configMapper.selectConfigList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 校验参数键名是否唯一
 *
 * @param config 参数配置信息
 * @return 结果
 */
let checkConfigKeyUnique = async (config = {}) => {
  let [info] = await dbconfig.sqlConnect(configMapper.checkConfigKeyUnique, config.configKey)
  if (info && info.configId != config.configId) return userConstants.NOT_UNIQUE
  return userConstants.UNIQUE
}

/**
 * 新增参数配置
 *
 * @param config 参数配置信息
 * @return 结果
 */
let insertConfig = async (config = {}) => {
  let db = configMapper.insertConfig(config)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    let name = constants.SYS_CONFIG_KEY + config.configKey
    redis.set(name, config.configValue)
  }
  return affectedRows
}

/**
 * 查询参数配置信息
 *
 * @param configId 参数配置ID
 * @return 参数配置信息
 */
let selectConfigById = async (configId = '') => {
  let db = configMapper.selectConfig({ configId })
  let [info] = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
  return info || {}
}

/**
 * 修改参数配置
 *
 * @param config 参数配置信息
 * @return 结果
 */
let updateConfig = async (config = {}) => {
  let db = configMapper.updateConfig(config)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    let name = constants.SYS_CONFIG_KEY + config.configKey
    redis.set(name, config.configValue)
  }
  return affectedRows
}

/**
 * 批量删除参数信息
 *
 * @param configIds 需要删除的参数ID
 */
let deleteConfigByIds = async (configIds = '') => {
  if (configIds.length === 0) return
  let configIdsArr = configIds.split(',')
  for (let i = 0; i < configIdsArr.length; i++) {
    let configId = configIdsArr[i]
    let config = await selectConfigById(configId)
    if (userConstants.YES === config.configType) throw { code: 500, msg: `内置参数【${config.configKey}】不能删除` }
    await dbconfig.sqlConnect(configMapper.deleteConfigById, configId)
    let name = constants.SYS_CONFIG_KEY + config.configKey
    redis.client.del(name)
  }
}

/**
 * 清空参数缓存数据
 */
let clearConfigCache = async () => {
  let keys = await redis.keys(constants.SYS_CONFIG_KEY + '*')
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    redis.client.del(key)
  }
}

/**
 * 加载参数缓存数据
 */
let loadingConfigCache = async () => {
  let db = configMapper.selectConfigList({})
  let list = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
  if (list.length === 0) return
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    let name = constants.SYS_CONFIG_KEY + item.configKey
    redis.set(name, item.configValue)
  }
}

/**
 * 重置参数缓存数据
 */
let resetConfigCache = async () => {
  await clearConfigCache()
  await loadingConfigCache()
}

module.exports = {
  resetConfigCache,
  deleteConfigByIds,
  updateConfig,
  selectConfigById,
  insertConfig,
  checkConfigKeyUnique,
  startPage,
  selectConfigByKey,
  selectConfigList,
  selectCaptchaOnOff,
  captcha
}
