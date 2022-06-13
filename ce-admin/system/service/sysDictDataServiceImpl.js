/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-01 13:11:29
 * @LastEditTime: 2022-04-09 10:22:59
 * @Description: ...每位新修改者自己的信息
 */

const dbconfig = require('@/config/dbconfig')
const dictDataMapper = require('@/system/db/sysDictDataMapper')
const { dictUtils } = require('./sysDictTypeServiceImpl')
const { isUserAdmin } = require('@/utils/permissions')

/**
 * 根据条件分页查询字典数据
 *
 * @param dictData 字典数据信息
 * @return 字典数据集合信息
 */
let selectDictDataList = async (dictData = {}) => {
  let db = dictDataMapper.selectDictDataList(dictData)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
  return list
}

let startPage = async (dictData = {}) => {
  let body = JSON.parse(JSON.stringify(dictData))
  delete body.pageNum
  delete body.pageSize
  let db = dictDataMapper.selectDictDataList(body)
  let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
  let [info] = await dbconfig.sqlConnect(sqlString, db.value)
  return Number(info.countNum)
}

/**
 * 新增保存字典数据信息
 *
 * @param data 字典数据信息
 * @return 结果
 */
let insertDictData = async (data = {}) => {
  let db = dictDataMapper.insertDictData(data)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    let dictDatas = await dbconfig.sqlConnect(dictDataMapper.selectDictDataByType, data.dictType, 'yyyy-MM-dd HH:mm:ss')
    dictUtils.setDictCache(data.dictType, dictDatas)
  }
}

/**
 * 根据字典数据ID查询信息
 *
 * @param dictCode 字典数据ID
 * @return 字典数据
 */
let selectDictDataById = async (dictCode = '') => {
  let [info] = await dbconfig.sqlConnect(dictDataMapper.selectDictDataById, dictCode, 'yyyy-MM-dd HH:mm:ss')
  return info
}

/**
 * 修改保存字典数据信息
 *
 * @param data 字典数据信息
 * @return 结果
 */
let updateDictData = async (data = {}) => {
  let db = dictDataMapper.updateDictData(data)
  let { affectedRows } = await dbconfig.sqlConnect(db.sqlString, db.value)
  if (affectedRows > 0) {
    let dictDatas = await dbconfig.sqlConnect(dictDataMapper.selectDictDataByType, data.dictType, 'yyyy-MM-dd HH:mm:ss')
    dictUtils.setDictCache(data.dictType, dictDatas)
  }
  return affectedRows
}

/**
 * 批量删除字典数据信息
 *
 * @param dictCodes 需要删除的字典数据ID
 */
let deleteDictDataByIds = async (dictCodes = '') => {
  if (dictCodes.length === 0) return
  let dictCodesArr = dictCodes.split(',')
  for (let i = 0; i < dictCodesArr.length; i++) {
    let dictCode = dictCodesArr[i]
    let data = await selectDictDataById(dictCode)
    await dbconfig.sqlConnect(dictDataMapper.deleteDictDataById, dictCode)
    let dictDatas = await dbconfig.sqlConnect(dictDataMapper.selectDictDataByType, data.dictType, 'yyyy-MM-dd HH:mm:ss')
    dictUtils.setDictCache(data.dictType, dictDatas)
  }
}



module.exports = {
  deleteDictDataByIds,
  updateDictData,
  selectDictDataById,
  insertDictData,
  startPage,
  selectDictDataList
}
