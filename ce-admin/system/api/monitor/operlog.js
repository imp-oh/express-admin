/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-09 22:43:30
 * @LastEditTime: 2022-04-12 14:33:52
 * @Description: ...每位新修改者自己的信息
 */
const { formatTime } = require('@/utils/validate')
const operLogService = require('@/system/service/sysOperLogServiceImpl')

/**
 * @PreAuthorize("@ss.hasPermi('monitor:operlog:list')")
 */
let list = async (req, res) => {
  let total = await operLogService.startPage(req.query)
  let list = []
  if (total > 0) list = await operLogService.selectOperLogList(req.query)
  res.send({
    code: 200,
    msg: '查询成功',
    rows: list,
    total: total
  })
}

/**
 * 日志删除
 *  @PreAuthorize("@ss.hasPermi('monitor:operlog:remove')")
 */
let remove = async (req, res) => {
  let { operIds } = req.params
  let operIdsArr = []
  if (operIds.length !== 0) operIdsArr = operIds.split(',')
  await operLogService.deleteOperLogByIds(operIdsArr)
  res.send({
    code: 200,
    msg: '操作成功'
  })
}

/**
 *  清空
 *  @PreAuthorize("@ss.hasPermi('monitor:operlog:remove')")
 */
let clean = async (req, res) => {
  await operLogService.cleanOperLog()
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
