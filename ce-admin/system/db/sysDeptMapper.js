/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-19 21:58:16
 * @LastEditTime: 2022-04-01 16:17:59
 * @Description: ...每位新修改者自己的信息
 */

const { handleDataScope } = require('@/enums/dataScopeAspect')
const { handlePage, sqlFunKey } = require('@/utils/mysql')
const mysql = require('mysql')

let selectDeptVo = `select d.dept_id, d.parent_id, d.ancestors, d.dept_name, d.order_num, d.leader, d.phone, d.email, d.status, d.del_flag, d.create_by, d.create_time from sys_dept d `

let selectDeptList = (rows = {}, loginUser) => {
  let sqlString = selectDeptVo + " where d.del_flag = '0' "
  let dataScope = handleDataScope({ deptAlias: 'd', loginUser }) // 数据权控制

  let sqlarr = [
    {
      key: 'deptId',
      sql: ' AND dept_id = ? ',
      isNotZero: true // 条件
    },
    {
      key: 'parentId',
      sql: ' AND parent_id = ? ',
      isNotZero: true
    },
    {
      key: 'deptName',
      sql: " AND dept_name like concat('%', ?, '%') "
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  sqlString += sqlRow.sqlString
  if (dataScope) sqlString += dataScope
  sqlString += ' order by d.parent_id, d.order_num '

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectDeptListByRoleId = (roleId, deptCheckStrictly) => {
  return `select d.dept_id
  from sys_dept d
          left join sys_role_dept rd on d.dept_id = rd.dept_id
      where rd.role_id = ${mysql.escape(roleId)}
      ${deptCheckStrictly ? 'and d.dept_id not in (select d.parent_id from sys_dept d inner join sys_role_dept rd on d.dept_id = rd.dept_id and rd.role_id = ' + mysql.escape(roleId) + ')' : ''}
  order by d.parent_id, d.order_num`
}

let checkDeptNameUnique = selectDeptVo + ' where dept_name=? and parent_id = ? limit 1'

let insertDept = (rows = {}) => {
  let sqlarr = [
    {
      key: 'deptId',
      sql: ' dept_id, ',
      isNotZero: true
    },
    {
      key: 'parentId',
      sql: ' parent_id, ',
      isNotZero: true
    },
    {
      key: 'deptName',
      sql: ' dept_name, '
    },
    {
      key: 'ancestors',
      sql: ' ancestors, '
    },
    {
      key: 'orderNum',
      sql: ' order_num, '
    },
    {
      key: 'leader',
      sql: ' leader, '
    },
    {
      key: 'phone',
      sql: ' phone, '
    },
    {
      key: 'email',
      sql: ' email, '
    },
    {
      key: 'status',
      sql: ' status, ',
      isNull: true
    },
    {
      key: 'createBy',
      sql: ' create_by, '
    },
    {
      key: 'createTime',
      sql: ' create_time '
    }
  ]
  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_dept (${sqlRow.sqlString}) values (${sqlRow.value.map(() => '?').join(',')})`

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectDeptById = selectDeptVo + ' where dept_id = ?'

let selectNormalChildrenDeptById = "select count(*) as countNum from sys_dept where status = 0 and del_flag = '0' and find_in_set(?, ancestors)"

let updateDept = (rows = {}) => {
  let sqlarr = [
    {
      key: 'parentId',
      sql: ' parent_id = ? , ',
      isNotZero: true
    },
    {
      key: 'deptName',
      sql: ' dept_name = ? , '
    },
    {
      key: 'ancestors',
      sql: ' ancestors = ? , '
    },
    {
      key: 'orderNum',
      sql: ' order_num = ? , '
    },
    {
      key: 'leader',
      sql: ' leader = ? , ',
      isNull: true
    },
    {
      key: 'phone',
      sql: ' phone = ? , ',
      isNull: true
    },
    {
      key: 'email',
      sql: ' email = ? , ',
      isNull: true
    },
    {
      key: 'status',
      sql: ' status = ? , '
    },
    {
      key: 'updateBy',
      sql: ' update_by = ? , '
    },
    {
      key: 'updateTime',
      sql: ' update_time = ? '
    },
    {
      key: 'deptId',
      sql: ' where dept_id = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  sqlRow.sqlString = `update sys_dept set ${sqlRow.sqlString}`
  return sqlRow
}

let selectChildrenDeptById = 'select * from sys_dept where find_in_set(?, ancestors)'

let updateDeptChildren = (depts = []) => {
  let sqlString = 'update sys_dept set ancestors = '
  let sqlarr = depts.map(() => ' when ? then ? ')
  sqlarr.length > 0 ? (sqlString += ' case dept_id ') : ''
  sqlString += sqlarr.join('') + ` end  where dept_id in (${depts.map(() => '?').join(',')})`
  let value = []
  depts.forEach((item) => {
    value.push(item.deptId, item.ancestors)
  })
  value.push(...depts.map((item) => item.deptId))
  return {
    sqlString,
    value
  }
}

let hasChildByDeptId = "select count(1) as countNum from sys_dept where del_flag = '0' and parent_id = ? limit 1"

let checkDeptExistUser = "select count(1) as countNum from sys_user where dept_id = ? and del_flag = '0'"

let deleteDeptById = "update sys_dept set del_flag = '2' where dept_id = ?"

module.exports = {
  selectDeptList,
  selectDeptListByRoleId,
  checkDeptNameUnique,
  insertDept,
  selectDeptById,
  selectNormalChildrenDeptById,
  updateDept,
  selectChildrenDeptById,
  updateDeptChildren,
  hasChildByDeptId,
  checkDeptExistUser,
  deleteDeptById
}
