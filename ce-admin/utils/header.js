/*
 * @Author: Ghost

 * @Date: 2021-01-29 15:18:53
 * @LastEditTime: 2021-02-01 14:43:39
 * @Description: ...每位新修改者自己的信息
 */


/** 报错状态 */


// 判读用户状态
isUserStatus = (req, res) => {

  const cookie = req.getCookie(req)
  if (cookie.cnblog && cookie.cnblog.userId) return false

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end('小伙子，你又调皮了！');
  return true
}

statusCode = (req, res, code = 500) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end();
  return
}


module.exports = {
  isUserStatus, statusCode
}