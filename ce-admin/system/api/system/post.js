/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 09:11:27
 * @LastEditTime: 2022-03-29 14:12:26
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
const {
  selectDeptListByRoleId
} = require('@/system/db/sysDeptMapper')
const { selectRoleById } = require('@/system/db/sysRoleMapper')
const { isUserAdmin } = require('@/utils/permissions')
const { treeDept } = require('@/utils/util')
const postService = require('@/system/service/sysPostServiceImpl')
const { formatTime } = require('@/utils/validate')


let list = async (req, res) => {

  let startPage = await postService.startPage()
  let lists = []
  if (startPage > 0) lists = await postService.selectPostList(req.query)

  res.send({
    code: 200,
    rows: lists,
    total: startPage,
    msg: "操作成功"
  })
}



/**
 * 新增岗位
 */
let add = async (req, res) => {
  let { user } = req.loginUser
  await postService.checkPostNameUnique(req.body)
  await postService.checkPostCodeUnique(req.body)
  req.body.createBy = user.userName
  req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await postService.insertPost(req.body)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}


/**
 * 根据岗位编号获取详细信息
 */
let getInfo = async (req, res) => {
  let { postId } = req.params
  let data = await postService.selectPostById(postId)
  res.send({
    code: 200,
    data: data,
    msg: "操作成功"
  })
}


/**
 * 修改岗位
 */
let edit = async (req, res) => {
  let { user } = req.loginUser
  await postService.checkPostNameUnique(req.body)
  await postService.checkPostCodeUnique(req.body)
  req.body.updateBy = user.userName
  req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
  await postService.updatePost(req.body)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}


/**
 * 删除岗位
 */
let remove = async (req, res) => {
  let { postIds } = req.params
  await postService.deletePostByIds(postIds)
  res.send({
    code: 200,
    msg: "操作成功"
  })
}



module.exports = {
  list, add, getInfo, edit, remove
}