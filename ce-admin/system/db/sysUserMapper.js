/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-15 16:03:39
 * @LastEditTime: 2022-04-11 23:11:34
 * @Description: 数据权限使用
 */
const { sqlFunKey, handlePage } = require('@/utils/mysql')
const { handleDataScope } = require('@/enums/dataScopeAspect')
const mysql = require('mysql')
const { selectRoleVo, deleteRoleByIds } = require('./sysRoleMapper')


let selectUserVo = `select u.user_id, u.dept_id, u.user_name, u.nick_name, u.email, u.avatar, u.phonenumber, u.password, u.sex, u.status, u.del_flag, u.login_ip, u.login_date, u.create_by, u.create_time, u.remark, 
d.dept_id, d.parent_id, d.dept_name, d.order_num, d.leader, d.status as dept_status,
r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope, r.status as role_status
from sys_user u
left join sys_dept d on u.dept_id = d.dept_id
left join sys_user_role ur on u.user_id = ur.user_id
left join sys_role r on r.role_id = ur.role_id `



/**
 * 2022-04-11 修改 sqlFun 标记点
 */
let selectDiy = (field, rows = {}) => {
  let { userId, userName, status, phonenumber, params = {}, deptId = 0 } = rows
  let sql = `select ${field} from sys_user u
  left join sys_dept d on u.dept_id = d.dept_id
  where u.del_flag = '0' `
  let sqlarr = [
    {
      key: 'userId',
      sql: " AND u.user_id = ? ",
      isNotZero: true // 条件
    },
    {
      key: 'userName',
      sql: " AND u.user_name like concat('%',?, '%') ",
    },
    {
      key: 'status',
      sql: " status != null and status != '' ",
    },
    {
      key: 'phonenumber',
      sql: " AND u.phonenumber like concat('%',?, '%') ",
    },
    {
      key: 'params.beginTime',
      sql: " AND date_format(u.create_time,'%y%m%d') >= date_format(?,'%y%m%d') ",
    },
    {
      key: 'params.endTime',
      sql: " AND date_format(u.create_time,'%y%m%d') <= date_format(?,'%y%m%d') ",
    },
    {
      key: 'deptId',
      sql: ` AND (u.dept_id = ? OR u.dept_id IN ( SELECT t.dept_id FROM sys_dept t WHERE find_in_set(${mysql.escape(deptId)}, ancestors) )) `,
      isNotZero: true // 条件
    },
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  sql += sqlRow.sqlString

  // 数据范围过滤
  if (params.dataScope) sql += params.dataScope

  return {
    sqlString: sql,
    value: sqlRow.value
  }
}


let selectUserList = (row = {}, loginUser) => {

  let dataScope = handleDataScope({ deptAlias: "d", userAlias: "u", loginUser })  // 数据权控制

  if (!row.params) row.params = {}
  row.params.dataScope = dataScope

  let sqlList = selectDiy(` u.user_id, u.dept_id, u.nick_name, u.user_name, u.email, u.avatar, u.phonenumber, u.password, u.sex, u.status, u.del_flag, u.login_ip, u.login_date, u.create_by, u.create_time, u.remark, d.dept_name, d.leader `, row)
  let sqlString = sqlList.sqlString
  let page = handlePage(row)
  if (page.length !== 0) sqlList.value.push(...page), sqlString += " LIMIT ?,? ";
  return {
    sqlString,
    value: sqlList.value
  }
}


/**
 *  查询list 总条数
 * @param {*} row 
 * @param {*} loginUser 
 * @returns 
 */
let startPage = (row = {}, loginUser) => {
  let dataScope = handleDataScope({ deptAlias: "d", userAlias: "u", loginUser })  // 数据权控制
  if (!row.params) row.params = {}
  row.params.dataScope = dataScope
  let sqlList = selectDiy(' count(0) AS countNum', row)
  return {
    sqlString: sqlList.sqlString,
    value: sqlList.value
  }
}






/**
 *  部门查询
 * @param {*} isAdmin  Boolean
 * @returns 
 */
const treeselectSql = (isAdmin) => {
  return `select d.dept_id, d.parent_id, d.ancestors, d.dept_name, 
  d.order_num, d.leader, d.phone, d.email, d.status, d.del_flag, 
  d.create_by, d.create_time from sys_dept d where d.del_flag = '0'
  ${!isAdmin ? 'AND (d.dept_id IN ( SELECT dept_id FROM sys_role_dept WHERE role_id =? ) )' : ''}
  order by d.parent_id, d.order_num`
}



// 字典查询
const dictSql = () => {
  return `select dict_code, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by,
   create_time, remark from sys_dict_data where status = '0' and dict_type = ? order by dict_sort asc`
}



/**
 *  查询配置config
 * @returns 
 */
const configKeySql = () => {
  return `select config_id, config_name, config_key, config_value, config_type, create_by, create_time,
   update_by, update_time, remark from sys_config WHERE config_key = ?`
}







let selectUserRow = () => {
  return `SELECT
	u.user_id,
	u.dept_id,
	u.user_name,
	u.nick_name,
	u.email,
	u.avatar,
	u.phonenumber,
	u.PASSWORD,
	u.sex,
	u.STATUS,
	u.del_flag,
	u.login_ip,
	u.login_date,
	u.create_by,
	u.create_time,
	u.remark,
	d.dept_id,
	d.parent_id,
	d.dept_name,
	d.order_num,
	d.leader,
	d.STATUS AS dept_status,
	r.role_id,
	r.role_name,
	r.role_key,
	r.role_sort,
	r.data_scope,
	r.STATUS AS role_status 
FROM
	sys_user u
	LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
	LEFT JOIN sys_user_role ur ON u.user_id = ur.user_id
	LEFT JOIN sys_role r ON r.role_id = ur.role_id 
WHERE
	u.user_id = ?`
}



let checkUserNameUnique = "select count(1) countNum from sys_user where user_name = ? limit 1"


let checkPhoneUnique = "select user_id, phonenumber from sys_user where phonenumber = ? limit 1"

let checkEmailUnique = "select user_id, email from sys_user where email = ? limit 1"



let selectUserByUserName = selectUserVo + " where u.user_name = ? "


let selectUserById = selectUserVo + " where u.user_id = ? "


let selectAllocatedList = (rows = {}, loginUser = {}) => {
  let sqlString = `select distinct u.user_id, u.dept_id, u.user_name, u.nick_name, u.email, u.phonenumber, u.status, u.create_time
  from sys_user u
   left join sys_dept d on u.dept_id = d.dept_id
   left join sys_user_role ur on u.user_id = ur.user_id
   left join sys_role r on r.role_id = ur.role_id
  where u.del_flag = '0' and `
  let sqlarr = [
    {
      key: 'roleId',
      sql: " r.role_id = ? ",
    },
    {
      key: 'userName',
      sql: " AND u.user_name like concat('%', ?, '%') "
    },
    {
      key: 'phonenumber',
      sql: " AND u.phonenumber like concat('%', ?, '%') "
    },
  ]


  let sqlRow = sqlFunKey(rows, sqlarr)
  sqlString += sqlRow.sqlString

  // 数据范围过滤
  let dataScope = handleDataScope({ deptAlias: "d", userAlias: "u", loginUser })  // 数据权控制
  sqlString += dataScope

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), sqlString += " LIMIT ?,? "

  return {
    sqlString,
    value: sqlRow.value
  }

}


let selectAllocatedListTotal = (row, loginUser) => {
  delete row.pageNum
  delete row.pageSize
  let sqlRow = selectAllocatedList(row, loginUser)
  let sqlString = `SELECT count(0) AS countNum FROM ( ${sqlRow.sqlString} ) table_count`
  return {
    sqlString,
    value: sqlRow.value
  }
}







/**
 * 接口有数据权限
 * 2022-04-11 修改 sqlFun 标记点
 */
let selectUnallocatedList = (rows = {}, loginUser) => {

  let sqlString = `select distinct u.user_id, u.dept_id, u.user_name, u.nick_name, u.email, u.phonenumber, u.status, u.create_time
  from sys_user u
   left join sys_dept d on u.dept_id = d.dept_id
   left join sys_user_role ur on u.user_id = ur.user_id
   left join sys_role r on r.role_id = ur.role_id
  where u.del_flag = '0' and (r.role_id != ? or r.role_id IS NULL)
  and u.user_id not in (select u.user_id from sys_user u inner join sys_user_role ur on u.user_id = ur.user_id and ur.role_id = ?) `

  let sqlarr = [
    {
      key: 'roleId',
      sql: ""
    },
    {
      key: 'roleId',
      sql: ""
    },
    {
      key: 'userName',
      sql: " AND u.user_name like concat('%', ?, '%') "
    },
    {
      key: 'phonenumber',
      sql: " AND u.phonenumber like concat('%', ?, '%') "
    },
  ]

  let sqlRow = sqlFunKey(sqlarr)
  sqlString += sqlRow.sqlString

  // 数据范围过滤
  let dataScope = handleDataScope({ deptAlias: "d", userAlias: "u", loginUser })  // 数据权控制
  sqlString += dataScope

  // 分页数据
  let page = handlePage(rows)
  if (page.length !== 0) sqlRow.value.push(...page), sqlString += " LIMIT ?,? "

  return {
    sqlString,
    value: sqlRow.value
  }

}


let selectUnallocatedListTotal = (row, loginUser) => {
  delete row.pageNum
  delete row.pageSize
  let conn = selectUnallocatedList(row, loginUser)
  let sqlString = `SELECT count(0) AS total FROM ( ${conn.sqlString} ) table_count`
  return {
    sqlString,
    value: conn.value
  }
}



let updateUser = (rows = {}) => {
  let sqlarr = [
    {
      key: "deptId",
      sql: " dept_id = ?, ",
      isNotZero: true
    },
    {
      key: "userName",
      sql: " user_name = ?, "
    },
    {
      key: "nickName",
      sql: " nick_name = ?, "
    },
    {
      key: "email",
      sql: " email = ?, ",
      isNull: true
    },
    {
      key: "phonenumber",
      sql: " phonenumber = ?, ",
      isNull: true
    },
    {
      key: "sex",
      sql: " sex = ?, "
    },
    {
      key: "avatar",
      sql: " avatar = ?, "
    },
    {
      key: "password",
      sql: " password = ?, "
    },
    {
      key: "status",
      sql: " status = ?, "
    },
    {
      key: "loginIp",
      sql: " login_ip = ?, "
    },
    {
      key: "loginDate",
      sql: " login_date = ?, "
    },
    {
      key: "updateBy",
      sql: " update_by = ?, "
    },
    {
      key: "remark",
      sql: " remark = ?, "
    },
    {
      key: "updateTime",
      sql: " update_time = ? "
    },
    {
      key: "userId",
      sql: " where user_id = ? "
    },
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `update sys_user set ${sqlRow.sqlString}`

  return {
    sqlString,
    value: sqlRow.value
  }
}




let insertUser = (rows = {}) => {
  let sqlarr = [
    {
      key: "userId",
      sql: " user_id, ",
      isNotZero: true
    },
    {
      key: "deptId",
      sql: " dept_id, ",
      isNotZero: true
    },
    {
      key: "userName",
      sql: " user_name, "
    },
    {
      key: "nickName",
      sql: " nick_name, "
    },
    {
      key: "email",
      sql: " email, "
    },
    {
      key: "avatar",
      sql: " avatar, "
    },
    {
      key: "phonenumber",
      sql: " phonenumber, "
    },
    {
      key: "sex",
      sql: " sex, "
    },
    {
      key: "password",
      sql: " password, "
    },
    {
      key: "status",
      sql: " status, "
    },
    {
      key: "createBy",
      sql: " create_by, "
    },
    {
      key: "remark",
      sql: " remark, "
    },
    {
      key: "createTime",
      sql: " create_time "
    },
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_user (${sqlRow.sqlString}) values(${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }

}



let deleteUserByIds = (userIds = []) => {
  let sqlString = `update sys_user set del_flag = '2' where user_id in (${userIds.map(() => '?').join(',')})`
  return {
    sqlString,
    value: userIds
  }
}


let resetUserPwd = "update sys_user set password = ? where user_name = ?"


let updateUserAvatar = "update sys_user set avatar = ? where user_name = ?"
module.exports = {
  updateUserAvatar,
  resetUserPwd,
  deleteUserByIds,
  insertUser,
  updateUser,
  selectUserVo,
  treeselectSql,
  dictSql,
  configKeySql,
  selectUserRow,
  selectUserList,
  startPage,
  selectRoleVo,
  checkUserNameUnique,
  checkPhoneUnique,
  checkEmailUnique,
  selectUserById,
  selectUserByUserName,
  selectAllocatedList,
  selectAllocatedListTotal,
  selectUnallocatedList,
  selectUnallocatedListTotal
}