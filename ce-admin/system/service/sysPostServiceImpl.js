/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 09:17:25
 * @LastEditTime: 2022-04-09 22:36:14
 * @Description: ...每位新修改者自己的信息
 */
const dbconfig = require("@/config/dbconfig")
let postMapper = require('@/system/db/sysPostMapper')
let userPostMapper = require('@/system/db/sysUserPostMapper')
const { formatTime } = require('@/utils/validate')
/**
 * 分页总条数查询
 * @returns 总条数
 */
let startPage = async () => {
  let [row] = await dbconfig.sqlConnect(postMapper.startPage)
  return Number(row.countNum)
}


/**
 * 查询岗位信息集合
 * @param {*} rows  岗位信息
 * @returns 
 */
let selectPostList = async (post = {}) => {
  let db = postMapper.selectPostList(post)
  let list = await dbconfig.sqlConnect(db.sqlString, db.value)
  list.forEach(item => {
    item.createTime = formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss')
  })
  return list
}


/**
 * 校验岗位名称是否唯一
 * 
 * @param post 岗位信息
 * @return 结果
 */
let checkPostNameUnique = async (post = {}) => {
  let [info] = await dbconfig.sqlConnect(postMapper.checkPostNameUnique, post.postName);
  if (info && post.postId != info.postId) throw { code: 500, msg: `${post.postId ? '修改' : '新增'}岗位'${post.postName}'失败，岗位名称已存在` }
}



/**
 * 校验岗位编码是否唯一
 * 
 * @param post 岗位信息
 * @return 结果
 */
let checkPostCodeUnique = async (post = {}) => {
  let [info] = await dbconfig.sqlConnect(postMapper.checkPostCodeUnique, post.postCode);
  if (info && post.postId != info.postId) throw { code: 500, msg: `${post.postId ? '修改' : '新增'}岗位'${post.postName}'失败，岗位编码已存在` }
}


/**
 * 新增保存岗位信息
 * 
 * @param post 岗位信息
 * @return 结果
 */
let insertPost = async (post = {}) => {
  let db = postMapper.insertPost(post)
  console.log(db)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 通过岗位ID查询岗位信息
 * 
 * @param postId 岗位ID
 * @return 角色对象信息
 */
let selectPostById = async (postId) => {
  let [row = {}] = await dbconfig.sqlConnect(postMapper.selectPostById, postId)
  row.createTime = formatTime(row.createTime, 'yyyy-MM-dd HH:mm:ss')
  return row
}


/**
 * 修改保存岗位信息
 * 
 * @param post 岗位信息
 * @return 结果
 */
let updatePost = async (post = {}) => {
  let db = postMapper.updatePost(post)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}


/**
 * 通过岗位ID查询岗位使用数量
 * 
 * @param postId 岗位ID
 * @return 结果
 */

let countUserPostById = async (postId) => {
  let [row] = await dbconfig.sqlConnect(userPostMapper.countUserPostById, postId)
  return row
}



/**
 * 批量删除岗位信息
 * 
 * @param postIds 需要删除的岗位ID
 * @return 结果
 */
let deletePostByIds = async (postIds = '') => {
  let ids = postIds.split(',')
  for (var i = 0; i < ids.length; i++) {
    let postId = ids[i]
    let post = await selectPostById(postId)
    let postCount = await countUserPostById(postId)
    if (Number(postCount.countNum) > 0) throw { code: 500, msg: `${post.postName}已分配,不能删除` }
  }
  let db = postMapper.deletePostByIds(ids)
  await dbconfig.sqlConnect(db.sqlString, db.value)
}




/**
 * 查询所有岗位
 * 
 * @return 岗位列表
 */
let selectPostAll = async () => {
  return await dbconfig.sqlConnect(postMapper.selectPostAll)
}


/**
 * 根据用户ID获取岗位选择框列表
 * 
 * @param userId 用户ID
 * @return 选中岗位ID列表
 */
let selectPostListByUserId = async (userId) => {
  let list = await dbconfig.sqlConnect(postMapper.selectPostListByUserId, userId)
  return list.filter(i => i.postId).map(item => item.postId)
}


module.exports = {
  selectPostListByUserId,
  selectPostAll,
  startPage,
  selectPostList,
  checkPostNameUnique,
  checkPostCodeUnique,
  insertPost,
  selectPostById,
  updatePost,
  deletePostByIds
}