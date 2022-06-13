/*
 * @Author: Ghost

 * @Date: 2020-10-12 12:37:33
 * @LastEditTime: 2021-12-21 11:17:57
 * @Description: 静态配置
 */

var { express, app, path, __dirPaht } = require('../config/index')




// 静态资源
app.use(express.static(path.join(__dirPaht, './public/')));


// 生成环境切换文件夹
// if (process.env.NODE_ENV === 'production') {
//   app.set('views', 'dist');
// }

// app.set('views', 'views');
// app.set('view engine', 'ejs');


