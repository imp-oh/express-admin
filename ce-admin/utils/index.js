/*
 * @Author: Ghost

 * @Date: 2021-01-29 09:35:15
 * @LastEditTime: 2022-01-06 11:15:08
 * @Description: ...每位新修改者自己的信息
 */
const fs = require('fs');
const { IncomingForm } = require("formidable");
const path = require('path')
const { __dirPaht } = require("../config")

const delDir = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}








/** 提取script 里面代码 */
const replaceScript = (script) => {
  return new Promise((resolve) => {
    var eJS = RegExp(/<%=/)
    var reg = RegExp(/src=/)
    if (eJS.test(script) || reg.test(script)) {
      return resolve({ data: script })
    }
    script.replace(/<script.*?>([\s\S]+?)<\/script>/img, function(_, js) {
      resolve(js)
    });
  })
}




//
const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve({ code: 200 })
    })
  })
}



// 文件上传
const getFromData = (req, isUpload = false) => {
  if (req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;//获取当前月 默认0-11
    let dirPath = path.join(__dirPaht, `${req.filePath}${year}${month}`);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    let options = {
      keepExtensions: true,
      uploadDir: dirPath,
      maxFieldsSize: 20 * 1024 * 1024,
      filter: ({ name, originalFilename, mimetype }) => {
        let exe = ['.image', '.png', '.gif', '.jpg', '.jpeg', '.codeengine', '.ico', '.IMAGE', '.PNG', '.GIF', '.JPG', '.JPEG', '.CODEENGINE']
        return exe.includes(path.extname(originalFilename))
      }
    }
    var form = new IncomingForm(options);

    form.on('error', (err) => {
      console.log(err)
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, ...files })
      })
    })

  } else {
    console.log("错误")
    return new Promise((resolve, reject) => { reject({ error: 404 }) })
  }
}










module.exports = {
  delDir, replaceScript, writeFile, getFromData
}