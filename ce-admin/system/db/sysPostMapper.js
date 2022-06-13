/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-23 17:02:48
 * @LastEditTime: 2022-04-01 15:03:34
 * @Description: ...每位新修改者自己的信息
 */
const { sqlFunKey, handlePage } = require('@/utils/mysql')

let selectPostVo = `select post_id, post_code, post_name, post_sort, status, create_by, create_time, remark from sys_post `

let selectPostList = (rows = {}) => {
  let sqlString = selectPostVo

  let sqlarr = [
    {
      key: 'postCode',
      sql: " AND post_code like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    },
    {
      key: 'postName',
      sql: " AND post_name like concat('%', ?, '%') "
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)

  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), (sqlString += ' LIMIT ?,? ')

  return {
    sqlString,
    value: sqlRow.value
  }
}

let startPage = 'SELECT count(0) as countNum FROM sys_post'

let checkPostNameUnique = selectPostVo + ' where post_name= ? limit 1'

let checkPostCodeUnique = selectPostVo + ' where post_code= ? limit 1'

let insertPost = (rows = {}) => {
  let sqlarr = [
    {
      key: 'postId',
      sql: ' post_id, ',
      condition: '0'
    },
    {
      key: 'postCode',
      sql: ' post_code, '
    },
    {
      key: 'postName',
      sql: ' post_name, '
    },
    {
      key: 'postSort',
      sql: ' post_sort, '
    },
    {
      key: 'status',
      sql: ' status, '
    },
    {
      key: 'remark',
      sql: ' remark, '
    },
    {
      key: 'createBy',
      sql: ' create_by, '
    },
    {
      key: 'createTime',
      sql: ' create_time'
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_post(${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectPostById = selectPostVo + ' where post_id = ?'

let updatePost = (rows = {}) => {
  let sqlarr = [
    {
      key: 'postCode',
      sql: ' post_code = ?, '
    },
    {
      key: 'postName',
      sql: ' post_name = ?, '
    },
    {
      key: 'postSort',
      sql: ' post_sort = ?, '
    },
    {
      key: 'status',
      sql: ' status = ?, '
    },
    {
      key: 'remark',
      sql: ' remark = ?, ',
      isNull: true
    },
    {
      key: 'updateBy',
      sql: ' update_by = ?, '
    },
    {
      key: 'updateTime',
      sql: ' update_time = ? '
    },
    {
      key: 'postId',
      sql: ' where post_id = ? '
    }
  ]
  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = 'update sys_post set ' + sqlRow.sqlString

  return {
    sqlString,
    value: sqlRow.value
  }
}

let deletePostByIds = (rows = []) => {
  let sqlString = `delete from sys_post where post_id in  (${rows.map(() => '?').join(',')})`
  return {
    sqlString,
    value: rows
  }
}

let selectPostAll = selectPostVo

let selectPostListByUserId = `select p.post_id
from sys_post p
  left join sys_user_post up on up.post_id = p.post_id
  left join sys_user u on u.user_id = up.user_id
where u.user_id = ?`


let selectPostsByUserName = `select p.post_id, p.post_name, p.post_code
from sys_post p
   left join sys_user_post up on up.post_id = p.post_id
   left join sys_user u on u.user_id = up.user_id
where u.user_name = ?`
module.exports = {
  selectPostsByUserName,
  selectPostListByUserId,
  selectPostAll,
  selectPostVo,
  selectPostList,
  startPage,
  checkPostNameUnique,
  checkPostCodeUnique,
  insertPost,
  selectPostById,
  updatePost,
  deletePostByIds
}
