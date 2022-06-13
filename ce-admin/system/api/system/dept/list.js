/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-27 13:59:28
 * @LastEditTime: 2022-03-27 16:40:42
 * @Description: ...每位新修改者自己的信息
 */
const { selectDeptList } = require('@/system/service/sysDeptServiceImpl')


/**
 * 查询部门列表（排除节点）
 */
let exclude = async (req, res) => {
  let { user } = req.loginUser
  let { deptId } = req.params
  let data = await selectDeptList({}, user)
  let list = []
  data.forEach(item => {
    let ancestors = item.ancestors.split(',')
    if (item.deptId != deptId && !ancestors.includes(deptId+'')) list.push(item)
  })

  res.send({
    code: 200,
    msg: "操作成功",
    data: list || [] 
  })
}

module.exports = {
  exclude
}