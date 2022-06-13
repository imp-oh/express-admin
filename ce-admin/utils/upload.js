const fs = require('fs');
const { IncomingForm } = require("formidable");
const path = require('path')
const config = require('@/config')


/**
 * 
 * @param {*} req 
 * @param {*} filter  => 文件限制
 * @param {*} filePath  => 文件存储路径地址
 * @returns 
 */
let upload = (req, filter, filePath) => {
    if (req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
        let dirPath = path.join(config.base, './public/', filePath)
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
        let options = {
            keepExtensions: true,
            keepExtensions: false,
            uploadDir: dirPath,
            maxFieldsSize: 20 * 1024 * 1024,
            filter: ({ name, originalFilename, mimetype }) => {
                return filter({ name, originalFilename, mimetype }) //自定义文件过滤
            }
        }
        var form = new IncomingForm(options);
        form.on('error', (err) => {
            throw { code: 500, msg: '文件上传错误' }
        });

        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) return reject(err)
                resolve({ fields, files })
            })
        })
    } else {
        throw { code: 500, msg: 'set multipart/form-data' }
    }
}




let access = (dir) => {
    try {
        fs.accessSync(dir)
        return true
    } catch (error) {
        return false
    }
}



module.exports = {
    upload, access
}