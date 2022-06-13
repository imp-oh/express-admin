/*
 * @Author: Ghost

 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2022-03-20 10:50:02
 * @Description: 路由注册
 */

let { app, router } = require('./index')
let routerArray = require('@/routers/index')
const handlePermi = require('@/utils/permissions')



/**
 * 路由拦截方法判断
 * @param {*} row 
 * @returns 
 */
let fun = (row) => {
  let { isAuth, hasPermi, pathPermi, hasAnyPermi, lacksPermi } = row.preAuthorize || { pathPermi: false, isAuth: true }
  let funArray = []
  if (void 0 === isAuth || isAuth) funArray.push(handlePermi.handleAuth)
  if (hasPermi) funArray.push(handlePermi.hasPermi(hasPermi))
  if (hasAnyPermi) funArray.push(handlePermi.hasAnyPermi(hasAnyPermi))
  if (lacksPermi) funArray.push(handlePermi.lacksPermi(lacksPermi))
  if (pathPermi) funArray.push(handlePermi.pathPermi)

  return funArray
}



/**
 * 路由添加 
 */
for (let i in routerArray) {
  let item = routerArray[i]
  let funArray = fun(item)
  router[item.method.toLowerCase()](item.path, funArray, item.component)
}
app.use(router)





/**
 * 拦截路由错误
 */
app.use((err, req, res, next) => {
  console.log(req._parsedUrl.pathname)
  if (err.code && typeof err.code === 'number') {
    res.status(err.status || 200);
    res.json(err);
  }
  if (err.message) {
    res.status(403);
    console.log(err.message)
    res.json({ msg: '未知错误', code: 403 });
  }
  next(err);
});


/** 没注册路由区部跳转404 */
app.get('*', (req, res) => {
  return res.send({
    code: 404,
    msg: '网管说这个页面你不能进......'
  })
})