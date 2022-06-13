/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:57:11
 * @LastEditTime: 2022-04-12 14:57:22
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
