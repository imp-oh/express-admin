/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-31 10:59:02
 * @LastEditTime: 2022-04-09 09:42:28
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require('@/config/dbconfig')
const userConstants = require('@/enums/userConstants')
const dictTypeMapper = require('@/system/db/sysDictTypeMapper')
const dictDataMapper = require('@/system/db/sysDictDataMapper')
const redis = require('@/utils/redis')
const { constants } = require('@/config')

let dictUtils = {
  /**
   * 设置 redis 缓存
   */
  setDictCache: (dictType = '', dictDatas = []) => {
    let name = constants.SYS_DICT_KEY + dictType
    redis.set(name, dictDatas)
  },
  clearDictCache: async () => {
    let keys = constants.SYS_DICT_KEY + '*'
    let list = await redis.keys(keys)
    return list
  },
  removeDictCache: (key) => {
    let name = constants.SYS_DICT_KEY + key
    redis.client.del(name)
  }
}

/**
 * 根据条件分页查询字典类型总条数
 *
 * @param dictType 字典类型信息
 * @return 字典类型集合信息
 */
let startPage = async (dictType = {}) => {
  let body = JSON.parse(JSON.stringify(dictType))
  delete body.pageNum
  delete body.pageSize
  let db = dictTypeMapper.selectDictTypeList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 根据条件分页查询字典类型
 *
 * @param dictType 字典类型信息
 * @return 字典类型集合信息
 */
let selectDictTypeList = async (dictType = {}) => {
  let db = dictTypeMapper.selectDictTypeList(dictType)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')

  return list
}

/**
 * 校验字典类型称是否唯一
 *
 * @param dict 字典类型
 * @return 结果
 */
let checkDictTypeUnique = async (dict = {}) => {
  let { dictId } = dict
  let [info] = await dbconfig.sqlConnect(dictTypeMapper.checkDictTypeUnique, dict.dictType)
  if (info && info.dictId != dictId) return userConstants.NOT_UNIQUE
  return userConstants.UNIQUE
}

/**
 * 新增保存字典类型信息
 *
 * @param dict 字典类型信息
 * @return 结果
 */
let insertDictType = async (dict = {}) => {
  let db = dictTypeMapper.insertDictType(dict)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    // DictUtils.setDictCache(dict.getDictType(), null);
  }
  return affectedRows
}

/**
 * 根据字典类型ID查询信息
 *
 * @param dictId 字典类型ID
 * @return 字典类型
 */
let selectDictTypeById = async (dictId = '') => {
  let [info] = await dbconfig.sqlConnect(dictTypeMapper.selectDictTypeById, dictId, 'yyyy-MM-dd HH:mm:ss')
  return info
}

/**
 * 修改保存字典类型信息
 *
 * @param dict 字典类型信息
 * @return 结果
 */
let updateDictType = async (dict = {}) => {
  let [oldDict] = await dbconfig.sqlConnect(dictTypeMapper.selectDictTypeById, dict.dictId)
  await dbconfig.sqlConnect(dictDataMapper.updateDictDataType, [oldDict.dictType, dict.dictType])

  let db = dictTypeMapper.updateDictType(dict)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    let dictDatas = await dbconfig.sqlConnect(dictDataMapper.selectDictDataByType, dict.dictType, 'yyyy-MM-dd HH:mm:ss')
    dictUtils.setDictCache(dict.dictType, dictDatas) // 设置缓存
  }
}

/**
 * 清空字典缓存数据
 */
let clearDictCache = async () => {
  let keys = await dictUtils.clearDictCache()
  if (keys.length === 0) return
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    redis.client.del(key)
  }
}

/**
 * 加载字典缓存数据
 */

let loadingDictCache = async () => {
  let dictData = {
    status: '0'
  }
  let db = dictDataMapper.selectDictDataList(dictData)
  let dictDataMap = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
  let keys = {}

  for (let i = 0; i < dictDataMap.length; i++) {
    let item = dictDataMap[i]
    if (!keys[item.dictType]) keys[item.dictType] = []
    if (keys[item.dictType] && Array.isArray(keys[item.dictType])) {
      keys[item.dictType].push(item)
    }
  }

  for (let k in keys) {
    let value = keys[k]
    dictUtils.setDictCache(k, value)
  }
}

/**
 * 重置字典缓存数据
 */
let resetDictCache = async () => {
  await clearDictCache()
  await loadingDictCache()
}

/**
 * 批量删除字典类型信息
 *
 * @param dictIds 需要删除的字典ID
 */
let deleteDictTypeByIds = async (dictIds = '') => {
  if (dictIds.length === 0) return
  let dictIdsArr = dictIds.split(',')

  for (let i = 0; i < dictIdsArr.length; i++) {
    let dictId = dictIdsArr[i]
    let info = await selectDictTypeById(dictId)
    let [count] = await dbconfig.sqlConnect(dictDataMapper.countDictDataByType, info.dictType)
    if (Number(count.countNum) > 0) throw { msg: `${info.dictName}已分配,不能删除`, code: 500 }
    await dbconfig.sqlConnect(dictTypeMapper.deleteDictTypeById, dictId)
    dictUtils.removeDictCache(info.dictType)
  }
}

/**
 * 根据字典类型查询字典数据
 *
 * @param dictType 字典类型
 * @return 字典数据集合信息
 */
let selectDictDataByType = async (dictType) => {
  let name = constants.SYS_DICT_KEY + dictType
  let userSex = await redis.getObject(name)
  if (!userSex) {
    userSex = await dbconfig.sqlConnect(dictDataMapper.selectDictDataByType, dictType, 'yyyy-MM-dd HH:mm:ss')
    redis.set(name, userSex)
  }
  return userSex
}

module.exports = {
  selectDictDataByType,
  dictUtils,
  deleteDictTypeByIds,
  resetDictCache,
  updateDictType,
  selectDictTypeById,
  insertDictType,
  checkDictTypeUnique,
  selectDictTypeList,
  startPage
}
