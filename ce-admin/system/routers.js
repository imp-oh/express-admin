/**
 * path: 路由地址     => String
 * method: 请求类型   => String
 * component:回调方法 => Function
 * preAuthorize:{
 *    pathPermi: true || false  , 自动匹配接口权限   【默认值 flase】
 *    isAuth: true || false , 是否开启头部校验  【默认值 true】
 *    hasPermi:'system:user:list'  ,  string
 *    hasAnyPermi:['system:user:list'], Array string
 *    lacksPermi:'system:user:list'  ,  string 不符合权限 取反
 * }
 */




 let index = require('@/system/api/index')
 let systemUser = require('@/system/api/system/user')
 let userProfile = require('@/system/api/system/user/profile')
 let dict = require('@/system/api/system/dict/data')
 let typeConfig = require('@/system/api/system/dict/type')
 let dept = require('@/system/api/system/dept')
 let deptListConfig = require('@/system/api/system/dept/list')
 let apiConfig = require('@/system/api/system/config')
 let roleConfig = require('@/system/api/system/role')
 let menuConfig = require('@/system/api/system/menu')
 let authUserConfig = require('@/system/api/system/role/authUser')
 let postConfig = require('@/system/api/system/post')
 let noticeConfig = require('@/system/api/system/notice')
 
 let operlogConfig = require('@/system/api/monitor/operlog')
 let logininforConfig = require('@/system/api/monitor/logininfor')
 let onlineConfig = require('@/system/api/monitor/online')
 let jobConfig = require('@/system/api/monitor/job')
 let serverConfig = require('@/system/api/monitor/server')
 let cacheConfig = require('@/system/api/monitor/cache')
 let genConfig = require('@/system/api/tool/gen')
 
 const routerAll = [
   {
     path: '/login',
     method: 'post',
     component: index.login,
     preAuthorize: {
       isAuth: false
     }
   },
   {
     path: '/logout',
     method: 'post',
     component: index.logout,
     preAuthorize: {
       isAuth: false
     }
   },
   {
     path: '/captchaImage',
     method: 'get',
     component: index.captchaImage,
     preAuthorize: {
       isAuth: false
     }
   },
   {
     path: '/getInfo',
     method: 'get',
     component: index.getInfo
   },
 
   {
     path: '/getRouters',
     method: 'get',
     component: index.getRouters
   },
   {
     path: '/system',
     children: [
       {
         path: '/user',
         method: 'post',
         component: systemUser.add,
         preAuthorize: {
           hasPermi: 'system:user:add'
         }
       },
       {
         path: '/user',
         method: 'put',
         component: systemUser.edit,
         preAuthorize: {
           hasPermi: 'system:user:edit'
         }
       },
       {
         path: '/user/',
         method: 'get',
         component: systemUser.getInfo,
         preAuthorize: {
           hasPermi: 'system:user:query'
         }
       },
       {
         path: '/user/list',
         method: 'get',
         component: systemUser.list,
         preAuthorize: {
           hasPermi: 'system:user:list'
         }
       },
 
       {
         path: '/user/profile',
         method: 'get',
         component: userProfile.profile
       },
       {
         path: '/user/profile',
         method: 'put',
         component: userProfile.updateProfile
       },
       {
         path: '/user/profile/updatePwd',
         method: 'put',
         component: userProfile.updatePwd
       },
       {
         path: '/user/profile/avatar',
         method: 'post',
         component: userProfile.avatar
       },
 
       {
         path: '/user/changeStatus',
         method: 'put',
         component: systemUser.changeStatus,
         preAuthorize: {
           hasPermi: 'system:user:edit'
         }
       },
 
 
       {
         path: '/user/authRole',
         method: 'put',
         component: systemUser.insertAuthRole,
         preAuthorize: {
           hasPermi: 'system:user:edit'
         }
       },
       {
         path: '/user/resetPwd',
         method: 'put',
         component: systemUser.resetPwd,
         preAuthorize: {
           hasPermi: 'system:user:resetPwd'
         }
       },
 
       {
         path: '/user/:userId',
         method: 'get',
         component: systemUser.getInfo,
         preAuthorize: {
           hasPermi: 'system:user:query'
         }
       },
 
       {
         path: '/user/:userIds',
         method: 'delete',
         component: systemUser.remove,
         preAuthorize: {
           hasPermi: 'system:user:remove'
         }
       },
       {
         path: '/user/authRole/:userId',
         method: 'get',
         component: systemUser.authRole,
         preAuthorize: {
           hasPermi: 'system:user:query'
         }
       },
 
 
 
 
       {
         path: '/dict/data',
         method: 'post',
         component: dict.add,
         preAuthorize: {
           hasPermi: 'system:dict:add'
         }
       },
       {
         path: '/dict/data',
         method: 'put',
         component: dict.edit,
         preAuthorize: {
           hasPermi: 'system:dict:edit'
         }
       },
 
       {
         path: '/dict/data/list',
         method: 'get',
         component: dict.list,
         preAuthorize: {
           hasPermi: 'system:dict:list'
         }
       },
       {
         path: '/dict/data/:dictCode',
         method: 'get',
         component: dict.getInfo,
         preAuthorize: {
           hasPermi: 'system:dict:query'
         }
       },
       {
         path: '/dict/data/:dictCodes',
         method: 'delete',
         component: dict.remove,
         preAuthorize: {
           hasPermi: 'system:dict:remove'
         }
       },
 
       {
         path: '/dict/data/type/:dictType',
         method: 'get',
         component: dict.type
       },
 
       {
         path: '/dict/type',
         method: 'post',
         component: typeConfig.add,
         preAuthorize: {
           hasPermi: 'system:dict:add'
         }
       },
 
       {
         path: '/dict/type',
         method: 'put',
         component: typeConfig.edit,
         preAuthorize: {
           hasPermi: 'system:dict:edit'
         }
       },
 
       {
         path: '/dict/type/list',
         method: 'get',
         component: typeConfig.list,
         preAuthorize: {
           hasPermi: 'system:dict:list'
         }
       },
       {
         path: '/dict/type/refreshCache',
         method: 'delete',
         component: typeConfig.refreshCache,
         preAuthorize: {
           hasPermi: 'system:dict:remove'
         }
       },
       {
         path: '/dict/type/:dictId',
         method: 'get',
         component: typeConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:dict:query'
         }
       },
       {
         path: '/dict/type/:dictIds',
         method: 'delete',
         component: typeConfig.remove,
         preAuthorize: {
           hasPermi: 'system:dict:remove'
         }
       },
 
       {
         path: '/dept',
         method: 'post',
         component: dept.add,
         preAuthorize: {
           hasPermi: 'system:dept:add'
         }
       },
       {
         path: '/dept',
         method: 'put',
         component: dept.edit,
         preAuthorize: {
           hasPermi: 'system:dept:edit'
         }
       },
 
       {
         path: '/dept/list',
         method: 'get',
         component: dept.list,
         preAuthorize: {
           hasPermi: 'system:dept:list'
         }
       },
       {
         path: '/dept/treeselect',
         method: 'get',
         component: dept.treeselect
       },
       {
         path: '/dept/:deptId',
         method: 'get',
         component: dept.getInfo,
         preAuthorize: {
           hasPermi: 'system:dept:query'
         }
       },
 
       {
         path: '/dept/:deptId',
         method: 'delete',
         component: dept.remove,
         preAuthorize: {
           hasPermi: 'system:dept:remove'
         }
       },
 
       {
         path: '/dept/roleDeptTreeselect/:roleId',
         method: 'get',
         component: dept.roleDeptTreeselect
       },
 
       {
         path: '/dept/list/exclude/:deptId',
         method: 'get',
         component: deptListConfig.exclude,
         preAuthorize: {
           hasPermi: 'system:dept:list'
         }
       },
 
       {
         path: '/config',
         method: 'put',
         component: apiConfig.edit,
         preAuthorize: {
           hasPermi: 'system:config:edit'
         }
       },
       {
         path: '/config',
         method: 'post',
         component: apiConfig.add,
         preAuthorize: {
           hasPermi: 'system:config:add'
         }
       },
       {
         path: '/config/list',
         method: 'get',
         component: apiConfig.list,
         preAuthorize: {
           hasPermi: 'system:config:list'
         }
       },
       {
         path: '/config/refreshCache',
         method: 'delete',
         component: apiConfig.refreshCache,
         preAuthorize: {
           hasPermi: 'system:config:remove'
         }
       },
       {
         path: '/config/:configId',
         method: 'get',
         component: apiConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:config:query'
         }
       },
 
       {
         path: '/config/:configIds',
         method: 'delete',
         component: apiConfig.remove,
         preAuthorize: {
           hasPermi: 'system:config:remove'
         }
       },
 
       {
         path: '/config/configKey/:configKey',
         method: 'get',
         component: apiConfig.getConfigKey
       },
 
       {
         path: '/role',
         method: 'put',
         component: roleConfig.edit,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
       {
         path: '/role',
         method: 'post',
         component: roleConfig.add,
         preAuthorize: {
           hasPermi: 'system:role:add'
         }
       },
 
       {
         path: '/role/list',
         method: 'get',
         component: roleConfig.list,
         preAuthorize: {
           hasPermi: 'system:role:list'
         }
       },
       {
         path: '/role/authUser/allocatedList',
         method: 'get',
         component: authUserConfig.allocatedList,
         preAuthorize: {
           hasPermi: 'system:role:list'
         }
       },
       {
         path: '/role/authUser/unallocatedList',
         method: 'get',
         component: authUserConfig.unallocatedList,
         preAuthorize: {
           hasPermi: 'system:role:list'
         }
       },
       {
         path: '/role/authUser/selectAll',
         method: 'put',
         component: authUserConfig.selectAll,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
       {
         path: '/role/authUser/cancel',
         method: 'put',
         component: authUserConfig.cancel,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
       {
         path: '/role/authUser/cancelAll',
         method: 'put',
         component: authUserConfig.cancelAll,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
 
       {
         path: '/role/changeStatus',
         method: 'put',
         component: roleConfig.changeStatus,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
       {
         path: '/role/dataScope',
         method: 'put',
         component: roleConfig.dataScope,
         preAuthorize: {
           hasPermi: 'system:role:edit'
         }
       },
 
       {
         path: '/role/:roleId',
         method: 'get',
         component: roleConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:role:query'
         }
       },
       {
         path: '/role/:roleIds',
         method: 'delete',
         component: roleConfig.remove,
         preAuthorize: {
           hasPermi: 'system:role:remove'
         }
       },
 
       {
         path: '/menu',
         method: 'post',
         component: menuConfig.add,
         preAuthorize: {
           hasPermi: 'system:menu:add'
         }
       },
       {
         path: '/menu',
         method: 'put',
         component: menuConfig.edit,
         preAuthorize: {
           hasPermi: 'system:menu:edit'
         }
       },
 
       {
         path: '/menu/list',
         method: 'get',
         component: menuConfig.list,
         preAuthorize: {
           hasPermi: 'system:menu:list'
         }
       },
       {
         path: '/menu/treeselect',
         method: 'get',
         component: menuConfig.treeselect
       },
 
       {
         path: '/menu/:menuId',
         method: 'get',
         component: menuConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:menu:query'
         }
       },
 
       {
         path: '/menu/:menuId',
         method: 'delete',
         component: menuConfig.remove,
         preAuthorize: {
           hasPermi: 'system:menu:remove'
         }
       },
 
       {
         path: '/menu/roleMenuTreeselect/:roleId',
         method: 'get',
         component: menuConfig.roleMenuTreeselect
       },
 
       {
         path: '/post',
         method: 'post',
         component: postConfig.add,
         preAuthorize: {
           hasPermi: 'system:post:add'
         }
       },
       {
         path: '/post',
         method: 'put',
         component: postConfig.edit,
         preAuthorize: {
           hasPermi: 'system:post:edit'
         }
       },
 
       {
         path: '/post/list',
         method: 'get',
         component: postConfig.list,
         preAuthorize: {
           hasPermi: 'system:post:list'
         }
       },
 
       {
         path: '/post/:postId',
         method: 'get',
         component: postConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:post:query'
         }
       },
       {
         path: '/post/:postIds',
         method: 'delete',
         component: postConfig.remove,
         preAuthorize: {
           hasPermi: 'system:post:remove'
         }
       },
 
       {
         path: '/notice',
         method: 'post',
         component: noticeConfig.add,
         preAuthorize: {
           hasPermi: 'system:notice:add'
         }
       },
       {
         path: '/notice',
         method: 'put',
         component: noticeConfig.edit,
         preAuthorize: {
           hasPermi: 'system:notice:edit'
         }
       },
       {
         path: '/notice/list',
         method: 'get',
         component: noticeConfig.list,
         preAuthorize: {
           hasPermi: 'system:notice:list'
         }
       },
       {
         path: '/notice/:noticeId',
         method: 'get',
         component: noticeConfig.getInfo,
         preAuthorize: {
           hasPermi: 'system:notice:query'
         }
       },
       {
         path: '/notice/:noticeIds',
         method: 'delete',
         component: noticeConfig.remove,
         preAuthorize: {
           hasPermi: 'system:notice:remove'
         }
       }
     ]
   },
 
   {
     path: '/monitor',
     children: [
       {
         path: '/operlog/list',
         method: 'get',
         component: operlogConfig.list,
         preAuthorize: {
           hasPermi: 'monitor:operlog:list'
         }
       },
       {
         path: '/operlog/clean',
         method: 'delete',
         component: operlogConfig.clean,
         preAuthorize: {
           hasPermi: 'monitor:operlog:remove'
         }
       },
       {
         path: '/operlog/:operIds',
         method: 'delete',
         component: operlogConfig.remove,
         preAuthorize: {
           hasPermi: 'monitor:operlog:remove'
         }
       },
 
       {
         path: '/logininfor/list',
         method: 'get',
         component: logininforConfig.list,
         preAuthorize: {
           hasPermi: 'monitor:logininfor:list'
         }
       },
       {
         path: '/logininfor/clean',
         method: 'delete',
         component: logininforConfig.clean,
         preAuthorize: {
           hasPermi: 'monitor:logininfor:remove'
         }
       },
       {
         path: '/logininfor/:infoIds',
         method: 'delete',
         component: logininforConfig.remove,
         preAuthorize: {
           hasPermi: 'monitor:logininfor:remove'
         }
       },
 
       // 在线用户
       {
         path: '/online/list',
         method: 'get',
         component: onlineConfig.list,
         preAuthorize: {
           hasPermi: 'monitor:online:list'
         }
       },
       {
         path: '/online/:tokenId',
         method: 'delete',
         component: onlineConfig.forceLogout,
         preAuthorize: {
           hasPermi: 'monitor:online:forceLogout'
         }
       },
 
       // 定时任务
       {
         path: '/job/list',
         method: 'get',
         component: jobConfig.list,
         preAuthorize: {
           hasPermi: 'monitor:job:list'
         }
       },
       {
         path: '/job/:jobId',
         method: 'get',
         component: jobConfig.getInfo,
         preAuthorize: {
           hasPermi: 'monitor:job:query'
         }
       },
       {
         path: '/server',
         method: 'get',
         component: serverConfig.getInfo,
         preAuthorize: {
           hasPermi: 'monitor:server:query'
         }
       },
 
       {
         path: '/cache',
         method: 'get',
         component: cacheConfig.getInfo,
         preAuthorize: {
           hasPermi: 'monitor:cache:query'
         }
       }
     ]
   },
   {
     path: '/tool',
     children: [
       {
         path: '/gen/list',
         method: 'get',
         component: genConfig.list,
         preAuthorize: {
           hasPermi: 'tool:gen:list'
         }
       },
       {
         path: '/gen/importTable',
         method: 'post',
         component: genConfig.importTableSave,
         preAuthorize: {
           hasPermi: 'tool:gen:import'
         }
       },
       {
         path: '/gen/db/list',
         method: 'get',
         component: genConfig.dataList,
         preAuthorize: {
           hasPermi: 'tool:gen:list'
         }
       },
       {
         path: '/gen/:tableId',
         method: 'get',
         component: genConfig.getInfo,
         preAuthorize: {
           hasPermi: 'tool:gen:query'
         }
       },
     ]
   }
 ]
 
 module.exports = routerAll
 