let gitceRouter = require('./api/gitce')


let routers = [
    {
        path: "/gitce",
        children: [
            {
                path: '/dept/list',
                method: 'get',
                component: gitceRouter.list,
                preAuthorize: {
                    hasPermi: 'system:dept:list'
                }
            },
        ]
    }
]


module.exports = routers