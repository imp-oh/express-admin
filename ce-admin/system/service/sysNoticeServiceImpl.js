/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-09 10:07:20
 * @LastEditTime: 2022-04-09 22:41:09
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const noticeMapper = require('@/system/db/sysNoticeMapper')

const { treeMenu } = require('@/utils/util')

const { formatTime, loginTime } = require('@/utils/validate')


/**
 * 查询公告列表总条数
 * 
 * @param notice 公告信息
 * @return 公告集合
 */
let startPage = async (notice = {}) => {
    let body = JSON.parse(JSON.stringify(notice))
    delete body.pageNum
    delete body.pageSize
    let db = noticeMapper.selectNoticeList(body)
    let sqlString = db.sqlString.replace(/^select(.*?)from/gi, 'SELECT count(0) AS countNum FROM ')
    let [info] = await dbconfig.sqlConnect(sqlString, db.value)
    return Number(info.countNum)
}

/**
 * 查询公告列表
 * 
 * @param notice 公告信息
 * @return 公告集合
 */
let selectNoticeList = async (notice = {}) => {
    let db = noticeMapper.selectNoticeList(notice)
    return await dbconfig.sqlConnect(db.sqlString, db.value, 'yyyy-MM-dd HH:mm:ss')
}


/**
 * 新增公告
 * 
 * @param notice 公告信息
 * @return 结果
 */
let insertNotice = async (notice = {}) => {
    let db = noticeMapper.insertNotice(notice)
    return await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 查询公告信息
 * 
 * @param noticeId 公告ID
 * @return 公告信息
 */
let selectNoticeById = async (noticeId = '') => {
    let [info] = await dbconfig.sqlConnect(noticeMapper.selectNoticeById, noticeId, 'yyyy-MM-dd HH:mm:ss')
    return info
}


/**
 * 修改公告
 * 
 * @param notice 公告信息
 * @return 结果
 */
let updateNotice = async (notice = {}) => {
    let db = noticeMapper.updateNotice(notice)
    return await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 批量删除公告信息
 * 
 * @param noticeIds 需要删除的公告ID
 * @return 结果
 */
let deleteNoticeByIds = async (noticeIds = '') => {
    if (noticeIds.length === 0) return
    let delId = noticeIds.split(',')
    let db = noticeMapper.deleteNoticeByIds(delId)
    await dbconfig.sqlConnect(db.sqlString, db.value)
}


module.exports = {
    deleteNoticeByIds,
    updateNotice,
    selectNoticeById,
    insertNotice,
    startPage,
    selectNoticeList
}

