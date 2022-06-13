const userService = require('@/system/service/sysUserServiceImpl')
const { isUserAdmin, isRolesAdmin } = require('@/utils/permissions')
const userConstants = require('@/enums/userConstants')
const { formatTime } = require('@/utils/validate')
const tokenService = require('@/system/service/tokenService')
const { bcryptEncrypt, bcryptDecrypt, rsaDecrypt } = require('@/utils/crypto')
const configUpload = require('@/utils/upload')
const fs_promises = require('fs/promises')
const path = require('path')
const config = require('@/config')

let errorTile = (user_name, title) => { return { msg: `修改用户'${user_name}'失败，${title}已存在`, code: 500 } }
/**
 * 个人信息 业务处理
 */
let profile = async (req, res) => {
    let loginUser = req.loginUser
    let { user } = loginUser

    delete user.password
    user.admin = isUserAdmin(user.userId)
    user.deptId = Number(user.deptId)
    let roleGroup = await userService.selectUserRoleGroup(loginUser.userName)
    let postGroup = await userService.selectUserPostGroup(loginUser.userName)


    res.send({
        code: 200,
        data: user,
        roleGroup,
        postGroup,
        msg: "查询成功"
    })
}


/**
 * 修改用户
 */
let updateProfile = async (req, res) => {
    let loginUser = req.loginUser
    let { user } = loginUser
    let { phonenumber, email, nickName, sex } = req.body
    let putData = {
        userId: user.userId,
        phonenumber,
        email,
        nickName,
        sex,
        updateBy: user.userName,
        updateTime: formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    if (phonenumber && userConstants.NOT_UNIQUE === await userService.checkPhoneUnique(req.body)) throw errorTile(user.userName, '手机号')
    if (email && userConstants.NOT_UNIQUE === await userService.checkEmailUnique(req.body)) throw errorTile(user.userName, '邮箱账号')

    // 更新用户缓存
    if (await userService.updateUserProfile(putData) > 0) {
        user.nickName = nickName
        user.phonenumber = phonenumber
        user.email = email
        user.sex = sex
        tokenService.setLoginUser(req.loginUser)
    }


    res.send({
        code: 200,
        msg: "操作成功"
    })

}


/**
 * 重置密码
 */
let updatePwd = async (req, res) => {
    let { user } = req.loginUser
    let { newPassword, oldPassword } = req.body

    const oldPasswordDecrypt = rsaDecrypt(oldPassword)
    const newPasswordDecrypt = rsaDecrypt(newPassword)

    if (!bcryptDecrypt(oldPasswordDecrypt, user.password)) throw { msg: '修改密码失败，旧密码错误', code: 500 }
    if (oldPasswordDecrypt === newPasswordDecrypt) throw { msg: '新密码不能与旧密码相同', code: 500 }

    let bcryptPassword = bcryptEncrypt(newPasswordDecrypt)
    if (await userService.resetUserPwd(user.userName, bcryptPassword) > 0) {
        user.password = bcryptPassword
        tokenService.setLoginUser(req.loginUser)
    }
    res.send({
        code: 200,
        msg: "操作成功"
    })
}


/**
 * 头像上传
 */
let avatar = async (req, res) => {
    let { user } = req.loginUser

    let olAvatar = path.join(config.base, '/public', user.avatar)
    if (configUpload.access(olAvatar)) await fs_promises.unlink(olAvatar) // 删除文件

    let { files } = await configUpload.upload(req, db => {
        console.log(db.mimetype)
        return db.mimetype && db.mimetype.includes("image") && db.name === 'avatarfile'
    }, '/profile/avatar')

    let file = files.avatarfile
    let [, mimetype] = file.mimetype.split('/')
    let fileType = ['jpeg', 'jpg', 'png', 'gif', 'ico', 'image']
    if (!fileType.includes(mimetype)) {
        await fs_promises.unlink(file.filepath)
        throw { code: 500, msg: '文件类型错误' }
    }
    let newFileName = file.filepath + '.' + mimetype
    await fs_promises.rename(file.filepath, newFileName)

    let [, avatarPaht] = newFileName.split('\\public')
    if (await userService.updateUserAvatar(user.userName, avatarPaht)) {
        user.avatar = avatarPaht
        tokenService.setLoginUser(req.loginUser)
    }

    res.send({
        code: 200,
        msg: "操作成功",
        imgUrl: avatarPaht
    })
}


module.exports = {
    avatar,
    updatePwd,
    updateProfile,
    profile,
}