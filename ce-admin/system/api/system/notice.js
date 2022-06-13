/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-04-09 10:02:18
 * @LastEditTime: 2022-04-09 22:43:37
 * @Description: ...每位新修改者自己的信息
 */
const { formatTime } = require('@/utils/validate')
const noticeService = require('@/system/service/sysNoticeServiceImpl')


/**
 * 获取通知公告列表
 * @PreAuthorize("@ss.hasPermi('system:notice:list')")
 * @GetMapping("/list")
 */
let list = async (req, res) => {
    let total = await noticeService.startPage()
    let list = await noticeService.selectNoticeList(req.query);
    res.send({
        code: 200,
        msg: "查询成功",
        rows: list,
        total: total
    })
}


/**
 * 根据通知公告编号获取详细信息
 *  @PreAuthorize("@ss.hasPermi('system:notice:query')")
 * @GetMapping(value = "/{noticeId}")
 */
let getInfo = async (req, res) => {
    let { noticeId } = req.params
    let data = await noticeService.selectNoticeById(noticeId)
    res.send({
        code: 200,
        msg: "操作成功",
        data: data
    })
}


/**
 * 新增通知公告
 * @PreAuthorize("@ss.hasPermi('system:notice:add')")
 */
let add = async (req, res) => {
    let { user } = req.loginUser
    req.body.createBy = user.userName
    req.body.createTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
    await noticeService.insertNotice(req.body)
    res.send({
        code: 200,
        msg: "操作成功"
    })
}

/**
 * 修改通知公告
 * @PreAuthorize("@ss.hasPermi('system:notice:edit')")
 */
let edit = async (req, res) => {
    let { user } = req.loginUser
    req.body.updateBy = user.userName
    req.body.updateTime = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
    await noticeService.updateNotice(req.body)
    res.send({
        code: 200,
        msg: "操作成功"
    })
}


/**
 * 删除通知公告
 * @PreAuthorize("@ss.hasPermi('system:notice:remove')")
 * @DeleteMapping("/{noticeIds}")
 */
let remove = async (req, res) => {
    let { noticeIds } = req.params
    await noticeService.deleteNoticeByIds(noticeIds)
    res.send({
        code: 200,
        msg: "操作成功"
    })
}

module.exports = {
    remove,
    edit,
    list,
    getInfo,
    add
}