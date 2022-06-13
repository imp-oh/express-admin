/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-28 10:58:49
 * @LastEditTime: 2022-03-29 17:02:45
 * @Description: ...每位新修改者自己的信息
 */

let countUserPostById = " select count(1) as countNum from sys_user_post where post_id= ? "


let batchUserPost = (postIds = [], insertId) => {
  let sqlString = `insert into sys_user_post(user_id, post_id) values ` + postIds.map(() => '(?,?) ').join(',')
  let value = postIds.map(item => `${insertId},${item}`).join(',').split(',')
  return {
    sqlString,
    value
  }
}


let deleteUserPostByUserId = "delete from sys_user_post where user_id= ? "


let deleteUserPost = (userIds = []) => {
  let sqlString = `delete from sys_user_post where user_id in (${userIds.map(() => '?').join(',')})`
  return {
    sqlString,
    value: userIds
  }
}

module.exports = {
  deleteUserPost,
  deleteUserPostByUserId,
  batchUserPost,
  countUserPostById
}
