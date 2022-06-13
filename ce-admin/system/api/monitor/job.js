/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-12 14:17:33
 * @LastEditTime: 2022-04-12 14:47:49
 * @Description: 调度任务信息操作处理
 * @RequestMapping("/monitor/job")
 */
const { formatTime } = require('@/utils/validate')
const jobService = require('@/system/service/sysJobServiceImpl')

/**
 * 查询定时任务列表
 * @PreAuthorize("@ss.hasPermi('monitor:job:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
  let total = await jobService.startPage(req.query)
  let list = []
  if (total > 0) list = await jobService.selectJobList(req.query)
  res.send({
    msg: '查询成功',
    code: 200,
    rows: list,
    total: total
  })
}

/**
 * 获取定时任务详细信息
 * @PreAuthorize("@ss.hasPermi('monitor:job:query')")
 * @GetMapping(value = "/{jobId}")
 */
let getInfo = async (req, res) => {
  let { jobId } = req.params
  let info = await jobService.selectJobById(jobId)
  res.send({
    code: 200,
    msg: '操作成功',
    data: info
  })
}

/**
 * 新增定时任务
 * @PreAuthorize("@ss.hasPermi('monitor:job:add')")
 */
let add = async (req, res) => {
    
}

/**
 * 修改定时任务
 * @PreAuthorize("@ss.hasPermi('monitor:job:edit')")
 */
let edit = async (req, res) => {}

/**
 * 定时任务状态修改
 *  @PreAuthorize("@ss.hasPermi('monitor:job:changeStatus')")
 *  @PutMapping("/changeStatus")
 */
let changeStatus = async (req, res) => {}

/**
 * 定时任务立即执行一次
 * @PreAuthorize("@ss.hasPermi('monitor:job:changeStatus')")
 * @PutMapping("/run")
 */
let run = async (req, res) => {}

/**
 * 删除定时任务
 * @PreAuthorize("@ss.hasPermi('monitor:job:remove')")
 * @DeleteMapping("/{jobIds}")
 */
let remove = async (req, res) => {}

module.exports = {
  remove,
  add,
  getInfo,
  list
}
