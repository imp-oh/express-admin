var NodeRSA = require('node-rsa')

/**
 *  生成密钥
 */
let getKey = () => {
  var key = new NodeRSA({ b: 1024 }); //生成512位秘钥
  key.setOptions({ encryptionScheme: 'pkcs1' })
  var pubkey = key.exportKey('pkcs8-public'); //导出公钥
  var prikey = key.exportKey('pkcs8-private'); //导出私钥

  console.log(pubkey)
  console.log('-------------------')
  console.log(prikey)
}



/**
 * 解密rsa
 */
 rsaDecrypt = (key) => {
  var priKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJZ6QPrHxuBkWctu' +
    'KIX0DIfpaJ3LuKvSWWCr1FeQ6nnFHDCvETZRL9kG5y2TnvYDpZpTgOp9Gn3Y+GpF' +
    'BmBdCyQAACCDd/dv/dLV0fxA8hrkaQVPRKyojusIhoQVHsjt2jHsOprEBAo0fa+S' +
    'HTfqz8YsDzm7bB9olOt1Xx4TS3gDAgMBAAECgYBGREJRmLZSlCmmKAN+Qa8UTDcQ' +
    '8E+E1I3t6W8XkNEdGaEHTsi/z3uDYYjULInfIWbUQMgDN3YGbCncHe1TVD9d0Xzt' +
    'a5ncy1YjPErqCMPlqkn2EYPpa9nbwXBpL3BvhjyiKs8z/pt6btS+aurnvyoEcD99' +
    'mmvNFOXxG9gPLLtyGQJBANF9T1D226hwIJcyXm0NXSVrJBsfGpNM2O2zR2e+OK2p' +
    '8lz/GrEIr2Aj/BLiSbpK5lyDlNcSEXSPVtmaZ19UwB0CQQC34uaKdB9XZuTKuPXX' +
    'MKKOwLXeNhepEZbf6F7iP5aT2xZVBjlZGE5wJGvRiFpkiSkatRQB8cc2FwN1GmPM' +
    'G96fAkEAugLaerm3MUjep2JCFfLX0nHgDXUA0+pYdDfMH4H4MbvFSG379VYQ4v0Q' +
    'xnPHo3L+OQddEdspRKZCJ9XCFBPcwQJAOV5CimNb+8qQCmbV28LClEKu+pppm0dv' +
    'iH9YSsGH2qz5NKFydsdMgVP7hy1A9iiMeFaR3WFuwwM/AuOuytjPBQJARpEe5fBi' +
    '4+/YXnpxLk6mshO/qzIpumMlvwBP6yYBvbJ5h/XZFa/XV4eg6H3YTwXJQPOnhEIx' +
    'j0Sce4gV+xstbg=='
  var priKey = new NodeRSA(priKey, 'pkcs8-private'); //导入私钥
  priKey.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。

  return priKey.decrypt(key, 'utf8')
}





/**
 *  加密rsa
 */
rsaEncrypt = (key) => {
  var result = crypto.createHash('md5').update(key).digest("hex")
  return result
}
