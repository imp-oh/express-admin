/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-20 22:10:09
 * @LastEditTime: 2022-04-01 15:02:56
 * @Description: menu 菜单
 */
const mysql = require('mysql')
const { sqlFunKey } = require('@/utils/mysql')

let selectMenuVo =
  "select menu_id, menu_name, parent_id, order_num, path, component, `query`, is_frame, is_cache, menu_type, visible, status, ifnull(perms,'') as perms, icon, create_time from sys_menu "

let selectMenuList = (row = {}) => {
  let sqlarr = [
    {
      key: 'menuName',
      sql: " AND menu_name like concat('%',?, '%') "
    },
    {
      key: 'visible',
      sql: ' AND visible = ? '
    },
    {
      key: 'status',
      sql: ' AND status = ? '
    }
  ]
  let sqlString = selectMenuVo
  let sqlRow = sqlFunKey(row, sqlarr)
  if (sqlRow.value.length > 0) (sqlString += ' where '), (sqlString += sqlRow.sqlString.substring(4))
  sqlString += 'order by parent_id, order_num '

  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectMenuListByUserId = (rows = {}) => {
  let sqlString =
    "select distinct m.menu_id, m.parent_id, m.menu_name, m.path, m.component, m.`query`, m.visible, m.status, ifnull(m.perms,'') as perms, m.is_frame, m.is_cache, m.menu_type, m.icon, m.order_num, m.create_time " +
    ' from sys_menu m' +
    ' left join sys_role_menu rm on m.menu_id = rm.menu_id' +
    ' left join sys_user_role ur on rm.role_id = ur.role_id' +
    ' left join sys_role ro on ur.role_id = ro.role_id'

  let sqlarr = [
    {
      key: 'userId',
      sql: ' where ur.user_id = ?  '
    },
    {
      key: 'menuName',
      sql: " AND m.menu_name like concat('%',?, '%') "
    },
    {
      key: 'visible',
      sql: ' AND m.visible = ? '
    },
    {
      key: 'status',
      sql: ' AND m.status = ? '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  sqlString += sqlRow.sqlString + 'order by m.parent_id, m.order_num'
  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectMenuListByRoleId = (roleId, menuCheckStrictly) => {
  return `select m.menu_id
  from sys_menu m
          left join sys_role_menu rm on m.menu_id = rm.menu_id
      where rm.role_id = ${mysql.escape(roleId)}
      ${menuCheckStrictly ? 'and m.menu_id not in (select m.parent_id from sys_menu m inner join sys_role_menu rm on m.menu_id = rm.menu_id and rm.role_id =' + mysql.escape(roleId) + ')' : ''}
  order by m.parent_id, m.order_num`
}

let selectMenuPermsByUserId = `select distinct m.perms
from sys_menu m
   left join sys_role_menu rm on m.menu_id = rm.menu_id
   left join sys_user_role ur on rm.role_id = ur.role_id
   left join sys_role r on r.role_id = ur.role_id
where m.status = '0' and r.status = '0' and ur.user_id = ?`

let checkMenuNameUnique = selectMenuVo + ' where menu_name=? and parent_id = ? limit 1'

let insertMenu = (rows = {}) => {
  let sqlarr = [
    {
      key: 'menuId',
      sql: ' menu_id, ',
      isNotZero: true
    },
    {
      key: 'parentId',
      sql: ' parent_id, ',
      isNotZero: true
    },
    {
      key: 'menuName',
      sql: ' menu_name, '
    },
    {
      key: 'orderNum',
      sql: ' order_num, '
    },
    {
      key: 'path',
      sql: ' path, '
    },
    {
      key: 'component',
      sql: ' component, '
    },
    {
      key: 'query',
      sql: ' `query`, '
    },
    {
      key: 'isFrame',
      sql: ' is_frame, '
    },
    {
      key: 'isCache',
      sql: ' is_cache, '
    },
    {
      key: 'menuType',
      sql: ' menu_type, '
    },
    {
      key: 'visible',
      sql: ' visible, ',
      isNull: true
    },
    {
      key: 'status',
      sql: ' status, ',
      isNull: true
    },
    {
      key: 'perms',
      sql: ' perms, '
    },
    {
      key: 'icon',
      sql: ' icon, '
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
      sql: ' create_time '
    }
  ]
  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = `insert into sys_menu (${sqlRow.sqlString}) values(${sqlRow.value.map(() => '?').join(',')}) `
  return {
    sqlString,
    value: sqlRow.value
  }
}

let selectMenuById = () => {
  return selectMenuVo + ' where menu_id = ?'
}

let updateMenu = (rows = {}) => {
  let sqlarr = [
    {
      key: 'menuName',
      sql: ' menu_name = ? , '
    },
    {
      key: 'parentId',
      sql: ' parent_id = ? , ',
      isNull: true
    },
    {
      key: 'orderNum',
      sql: ' order_num = ? , '
    },
    {
      key: 'path',
      sql: ' path = ? , '
    },
    {
      key: 'component',
      sql: ' component = ? , ',
      isNull: true
    },
    {
      key: 'query',
      sql: ' `query` = ? , ',
      isNull: true
    },
    {
      key: 'isFrame',
      sql: ' is_frame = ? , '
    },
    {
      key: 'isCache',
      sql: ' is_cache = ? , '
    },
    {
      key: 'menuType',
      sql: ' menu_type = ? , '
    },
    {
      key: 'visible',
      sql: ' visible = ? , ',
      isNull: true
    },
    {
      key: 'perms',
      sql: ' perms = ? , ',
      isNull: true
    },
    {
      key: 'icon',
      sql: ' icon = ? , '
    },
    {
      key: 'remark',
      sql: ' remark = ? , '
    },
    {
      key: 'updateBy',
      sql: ' update_by = ? , '
    },
    {
      key: 'updateTime',
      sql: ' update_time = ?  '
    },
    {
      key: 'menuId',
      sql: ' where menu_id = ?  '
    }
  ]

  let sqlRow = sqlFunKey(rows, sqlarr)
  let sqlString = 'update sys_menu set ' + sqlRow.sqlString

  return {
    sqlString,
    value: sqlRow.value
  }
}

let hasChildByMenuId = 'select count(1) AS countNum from sys_menu where parent_id = ?'

let deleteMenuById = 'delete from sys_menu where menu_id = ?'

let selectMenuTreeAll =
  'select distinct m.menu_id, m.parent_id, m.menu_name, m.path, m.component, m.`query`, m.visible, m.status, ' +
  " ifnull(m.perms,'') as perms, m.is_frame, m.is_cache, m.menu_type, m.icon, m.order_num, m.create_time " +
  " from sys_menu m where m.menu_type in ('M', 'C') and m.status = 0 " +
  ' order by m.parent_id, m.order_num'

let selectMenuTreeByUserId =
  "select distinct m.menu_id, m.parent_id, m.menu_name, m.path, m.component, m.`query`, m.visible, m.status, ifnull(m.perms,'') as perms, " +
  ' m.is_frame, m.is_cache, m.menu_type, m.icon, m.order_num, m.create_time ' +
  ' from sys_menu m ' +
  ' left join sys_role_menu rm on m.menu_id = rm.menu_id ' +
  '  left join sys_user_role ur on rm.role_id = ur.role_id ' +
  '  left join sys_role ro on ur.role_id = ro.role_id ' +
  '  left join sys_user u on ur.user_id = u.user_id ' +
  " where u.user_id = ? and m.menu_type in ('M', 'C') and m.status = 0  AND ro.status = 0 " +
  ' order by m.parent_id, m.order_num'

module.exports = {
  selectMenuList,
  selectMenuVo,
  selectMenuListByRoleId,
  selectMenuListByUserId,
  selectMenuPermsByUserId,
  checkMenuNameUnique,
  insertMenu,
  selectMenuById,
  updateMenu,
  hasChildByMenuId,
  deleteMenuById,
  selectMenuTreeAll,
  selectMenuTreeByUserId
}
