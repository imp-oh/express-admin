/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-09 22:43:30
 * @LastEditTime: 2022-04-12 13:19:36
 * @Description: ...每位新修改者自己的信息
 */
const { formatTime } = require('@/utils/validate')
const logininforService = require('@/system/service/sysLogininforServiceImpl')

/**
 * @PreAuthorize("@ss.hasPermi('monitor:logininfor:list')")
 */
let list = async (req, res) => {
  let total = await logininforService.startPage(req.query)
  let list = await logininforService.selectLogininforList(req.query)
  res.send({
    code: 200,
    msg: '查询成功',
    rows: list,
    total: total
  })
}

/**
 * 日志删除
 * @PreAuthorize("@ss.hasPermi('monitor:logininfor:remove')")
 */
let remove = async (req, res) => {
  let { infoIds } = req.params
  let rows = []
  if (infoIds.length !== 0) rows = infoIds.split(',')
  await logininforService.deleteLogininforByIds(rows)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 *  清空
 *  @PreAuthorize("@ss.hasPermi('monitor:logininfor:remove')")
 */
let clean = async (req, res) => {
  await logininforService.cleanLogininfor()
  res.send({
    code: 200,
    msg: '操作成功'
  })
}


module.exports = {
  clean,
  remove,
  list
}
