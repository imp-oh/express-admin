/*
 * @Author: Chen
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-17 09:23:30
 * @LastEditTime: 2022-03-17 09:59:43
 * @Description: ...每位新修改者自己的信息
 */
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD95HeIuhQ5XT/fzcJm3Z1ix32XDmK2O4MZ23268kUnl7FvVdO//A9ew23p0x6epebXPqAPKQ8pUlnNFaj0cY+dRP/XOcyfnews7Gd5RVnRxpjHc3bfES1445FzrhKK3YSLvtNU1vCWYZENUtiw3mVkbYxQ7e3EXZggAZNlHesOawIDAQAB'
const privateKey = ''

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

