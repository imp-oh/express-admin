const gitceService = require('../service/gitceService')

/**
 *  首页文章
 */
let list = async (req, res) => {
    let rows = []
    let total = await gitceService.selectTotal(req.query)
    if (total > 0) rows = await gitceService.selectDeptList(req.query)

    res.send({
        code: 200,
        msg: "查询成功",
        rows,
        total
    })
}


module.exports = {
    list
}