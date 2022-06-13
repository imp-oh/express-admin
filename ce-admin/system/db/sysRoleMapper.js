/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-20 20:12:48
 * @LastEditTime: 2022-04-01 16:18:34
 * @Description: 字段需要按照顺序案例获取对应值
 */

const { handleDataScope } = require('@/enums/dataScopeAspect')
const { handlePage, sqlFun, sqlFunKey, getObjectValue } = require('@/utils/mysql')




let selectRoleVo = `select distinct r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope, r.menu_check_strictly, r.dept_check_strictly,
r.status, r.del_flag, r.create_time, r.remark 
from sys_role r
left join sys_user_role ur on ur.role_id = r.role_id
left join sys_user u on u.user_id = ur.user_id
left join sys_dept d on u.dept_id = d.dept_id `



/**
 * list 方法共用
 */
let selectRoleListFun = (rows = {}, loginUser = {}) => {
  let sqlarr = [
    {
      key: 'roleId',
      sql: " AND r.role_id = ? ",
      isNotZero: true // 条件
    },
    {
      key: 'roleName',
      sql: " AND r.role_name like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: " AND r.status = ? "
    },
    {
      key: 'roleKey',
      sql: " AND r.role_key like concat('%',?, '%') "
    },
    {
      key: 'params.beginTime',
      sql: " AND date_format(r.create_time,'%y%m%d') >= date_format(?,'%y%m%d') "
    },
    {
      key: 'params.endTime',
      sql: " AND date_format(r.create_time,'%y%m%d') <= date_format(?,'%y%m%d') "
    }
  ]

  let sqlString = selectRoleVo + " where r.del_flag = '0' "
  let sqlRow = sqlFunKey(rows, sqlarr)
  sqlString += sqlRow.sqlString
  let dataScope = handleDataScope({ deptAlias: "d", loginUser }) // 数据过滤
  sqlString += dataScope

  return {
    sqlString,
    value: sqlRow.value
  }
}



let selectRoleList = (rows = {}, loginUser) => {
  let sqlConn = selectRoleListFun(rows, loginUser)
  sqlConn.sqlString += " order by r.role_sort"
  let page = handlePage(rows)
  if (page.length !== 0) sqlConn.value.push(...page), sqlConn.sqlString += " LIMIT ?,? "
  return {
    sqlString: sqlConn.sqlString,
    value: sqlConn.value
  }
}



let startPage = (rows = {}, loginUser) => {
  delete rows.pageNum
  delete rows.pageSize
  let sqlConn = selectRoleListFun(rows, loginUser)
  sqlConn.sqlString = `SELECT count(0) AS countNum FROM (${sqlConn.sqlString}) table_count`
  return sqlConn
}






let updateRole = (rows = {}) => {
  let sqlarr = [
    {
      key: 'roleName',
      sql: " role_name = ?, "
    },
    {
      key: 'roleKey',
      sql: " role_key = ?, "
    },
    {
      key: 'roleSort',
      sql: " role_sort = ?, "
    },
    {
      key: 'dataScope',
      sql: " data_scope = ?, "
    },
    {
      key: 'menuCheckStrictly',
      sql: " menu_check_strictly = ?, "
    },
    {
      key: 'deptCheckStrictly',
      sql: " dept_check_strictly = ?, "
    },
    {
      key: 'status',
      sql: " status = ?, "
    },
    {
      key: 'remark',
      sql: " remark = ?, "
    },
    {
      key: 'updateBy',
      sql: " update_by = ?, "
    },
    {
      key: 'updateTime',
      sql: " update_time = ? "
    },
    {
      key: 'roleId',
      sql: " where role_id = ? "
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `update sys_role set ${sqlRow.sqlString}`

  return {
    sqlString,
    value: sqlRow.value
  }
}


let checkRoleNameUnique = selectRoleVo + " where r.role_name=? limit 1"



let checkRoleKeyUnique = selectRoleVo + " where r.role_key=? limit 1"



let selectRoleById = selectRoleVo + "where r.role_id = ?"



let insertRole = (rows = {}) => {
  let sqlarr = [
    {
      key: "roleId",
      sql: " role_id, ",
      isNotZero: true
    },
    {
      key: "roleName",
      sql: " role_name, "
    },
    {
      key: "roleKey",
      sql: " role_key, "
    },
    {
      key: "roleSort",
      sql: " role_sort, "
    },
    {
      key: "dataScope",
      sql: " data_scope, "
    },
    {
      key: "menuCheckStrictly",
      sql: " menu_check_strictly, ",
      isNull: true
    },
    {
      key: "deptCheckStrictly",
      sql: " dept_check_strictly, ",
      isNull: true
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


  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_role(${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}


let deleteRoleByIds = (roleArray = []) => {
  let sqlString = "update sys_role set del_flag = '2' where role_id in"
  if (roleArray.length !== 0) sqlString += `(${roleArray.map(r => '?').join(',')})`
  return {
    sqlString,
    value: roleArray
  }
}


let selectRolePermissionByUserId = selectRoleVo + " WHERE r.del_flag = '0' and ur.user_id = ? "


let selectRolesByUserName = selectRoleVo + " WHERE r.del_flag = '0' and u.user_name = ?"

module.exports = {
  selectRolesByUserName,
  selectRoleVo,
  selectRoleList,
  updateRole,
  checkRoleNameUnique,
  checkRoleKeyUnique,
  insertRole,
  selectRoleById,
  deleteRoleByIds,
  selectRolePermissionByUserId,
  startPage
}