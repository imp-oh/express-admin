/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:54:02
 * @LastEditTime: 2022-04-12 14:56:29
 * @Description: ...每位新修改者自己的信息
 */

let getInfo = (req, res) => {
  res.send({
    msg: '查询成功',
    code: 200,
    data: {}
  })
}

module.exports = {
  getInfo
}
