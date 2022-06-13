/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-09 10:07:57
 * @LastEditTime: 2022-04-09 22:41:40
 * @Description: ...每位新修改者自己的信息
 */
const { handlePage, sqlFunKey } = require('@/utils/mysql')
const mysql = require('mysql')


let selectNoticeVo = "select notice_id, notice_title, notice_type, cast(notice_content as char) as notice_content, status, create_by, create_time, update_by, update_time, remark from sys_notice "

let selectNoticeList = (rows = {}) => {
    let sqlarr = [
        {
            key: "noticeTitle",
            sql: " AND notice_title like concat('%', ?, '%') "
        },
        {
            key: "noticeType",
            sql: " AND notice_type = ? "
        },
        {
            key: "createBy",
            sql: " AND create_by like concat('%', ?, '%') "
        },
    ]

    let sqlRow = sqlFunKey(rows, sqlarr)
    let sqlString = selectNoticeVo

    if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))
    // 分页数据
    let page = handlePage(rows)
    if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

    return {
        sqlString,
        value: sqlRow.value
    }
}



let insertNotice = (rows = {}) => {
    let slqarr = [
        {
            key: "noticeTitle",
            sql: " notice_title, "
        },
        {
            key: "noticeType",
            sql: " notice_type, "
        },
        {
            key: "noticeContent",
            sql: " notice_content, "
        },
        {
            key: "status",
            sql: " status, "
        },
        {
            key: "remark",
            sql: " remark, "
        },
        {
            key: "createBy",
            sql: " create_by, "
        },
        {
            key: "createTime",
            sql: " create_time "
        }
    ]

    let sqlRow = sqlFunKey(rows, slqarr)
    let sqlString = `insert into sys_notice (${sqlRow.sqlString}) values (${sqlRow.value.map(item => '?').join(',')})`
    return {
        sqlString,
        value: sqlRow.value
    }
}

let selectNoticeById = selectNoticeVo + " where notice_id = ?"


let updateNotice = (rows = {}) => {
    let sqlarr = [
        {
            key: "noticeTitle",
            sql: " notice_title = ?, "
        },
        {
            key: "noticeType",
            sql: " notice_type = ?, "
        },
        {
            key: "noticeContent",
            sql: " notice_content = ?, "
        },
        {
            key: "status",
            sql: " status = ?, "
        },
        {
            key: "updateBy",
            sql: " update_by = ?, "
        },
        {
            key: "updateTime",
            sql: " update_time = ? "
        },
        {
            key: "noticeId",
            sql: " where notice_id = ?"
        }
    ]
    let sqlRow = sqlFunKey(rows, sqlarr)
    let sqlString = `update sys_notice set ${sqlRow.sqlString}`

    return {
        sqlString,
        value: sqlRow.value
    }
}



let deleteNoticeByIds = (rows = []) => {
    return {
        sqlString: `delete from sys_notice where notice_id in (${rows.map(() => '?').join(',')})`,
        value: rows
    }
}

module.exports = {
    deleteNoticeByIds,
    updateNotice,
    selectNoticeById,
    insertNotice,
    selectNoticeList
}