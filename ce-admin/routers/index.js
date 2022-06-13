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

/**
 * 路由最多为2级
 * 
  一级由配置如下： 
  {
    path: '/base',
    children: []
  }
  
  二级路由：
  {
    path: '/userList',
    method: "get",
    component: base.userList
  },
 * 
 */

/**
  多级路由写法
  ! 注意  ! 注意  ! 注意
  带 children:[] 属性的 对象path 写法
  错误写法 =>  {paht:'/xx/',children:[] }   => paht 结尾不能写 / 斜杠
  正确写法 =>  {paht:'/xx',children:[] }
  let d = [
    {
      path: '/dept',
      children: [
        {
          path: '/dddd/',
          children: [
            {
              path: "/xxx"
            }
          ]
        }
      ]
    },
  ]

  输出路由地址  '/dept/dddd/xxxx'

 */




let system = require('@/system/routers')

let test = require('@/test/routers')



const routerAll = [
  ...system,
  ...test
]



/** 路由格式化 */
let ordinary = [], dynamic = []

let setValue = (row) => {
  row.isDynamic = row.path.indexOf('/:') !== -1 // 判断是否有动态路由
  row.level = row.path.split('/').length - 1 // 获取路由等级
  row.isDynamic ? dynamic.push(row) : ordinary.push(row)
}

let getRouters = (rows = {}) => {
  if (!(rows.children && rows.children.length !== 0 && !rows.component)) return setValue(rows)
  let str = rows.path.charAt(rows.path.length - 1)
  if (str === '/') throw Error("parent router paht Finally can't appear / ")
  for (let i = 0; i < rows.children.length; i++) {
    let row = rows.children[i]
    row.path = rows.path + row.path //路由拼接
    if (row.children && row.children.length !== 0) return getRouters(row)
    setValue(row)
  }
}

for (let i in routerAll) {
  let row = routerAll[i]
  getRouters(row)
}

let sortArray = [ordinary, dynamic]
let router = []
for (let i = 0; i < sortArray.length; i++) {
  let rows = sortArray[i].sort(function (a, b) {
    return a.level - b.level
  })
  router.push(...rows)
}



module.exports = router
