/*
 * @Author: Ghost

 * @Date: 2021-03-12 11:12:58
 * @LastEditTime: 2022-03-29 13:40:59
 * @Description: ...每位新修改者自己的信息
 */

/**
 * 
 * @param {type:Object} from 
 * @param {type:Object} rule 
 */



const AsyncValidator = require('../plug-in/formIndex').default



const rules = async function(rule, form = {}) {
  // let res = this.res;
  const body = {}
  for (let i in rule) {
    body[i] = form[i]
  }
  let error = await fun(rule, body)
  if (error) throw { code: 400, msg: error.message }
}

const fun = (rule, body) => {
  const validator = new AsyncValidator(rule);
  return new Promise((resolve, reason) => {
    validator.validate(body, async (errors, fields) => {
      if (errors) {
        const [error] = errors
        console.log(error)
        resolve(error)
      }
      resolve()
    });
  })
}

module.exports = {
  rules,
}