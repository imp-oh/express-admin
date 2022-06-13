/*
 * @Author: Ghost
 * @Email: codeeetop@qq.com
 * @Date: 2022-03-16 13:18:06
 * @LastEditTime: 2022-03-18 12:14:58
 * @Description: 全局方法配置
 */


module.exports = {
  base: process.cwd(),
  rsa: {
    public: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD95HeIuhQ5XT/fzcJm3Z1ix32XDmK2O4MZ23268kUnl7FvVdO//A9ew23p0x6epebXPqAPKQ8pUlnNFaj0cY+dRP/XOcyfnews7Gd5RVnRxpjHc3bfES1445FzrhKK3YSLvtNU1vCWYZENUtiw3mVkbYxQ7e3EXZggAZNlHesOawIDAQAB',
    private: 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAP3kd4i6FDldP9/NwmbdnWLHfZcOYrY7gxnbfbryRSeXsW9V07/8D17DbenTHp6l5tc+oA8pDylSWc0VqPRxj51E/9c5zJ+d7CzsZ3lFWdHGmMdzdt8RLXjjkXOuEordhIu+01TW8JZhkQ1S2LDeZWRtjFDt7cRdmCABk2Ud6w5rAgMBAAECgYEA2I/xOenm6EtW+XKL2Kw93AznXlrB7kjy+bJUG4sdW7kzexENblv1TFKMRX90RcSjE4RyiJvwN8HroVhRZjgbU0qjFQc9SoKYv2wNvZafZOohTh0eem1P1xiwRLRcqwaKY08ZLI7SmqKNQQ2n4ZAjwxUxmOZBF/aau1TdrcOSOfECQQD/3MR0p3c9dprzjkJajR1IyhquRPc2VmYc382Djn3omCL+7KLpw3ogHrlRFKalacHJ8+mCScrMzArB990PNZLZAkEA/gdtorN6DG2qda5Wi9o4qcwXRjvsVacQdzSZSkcXPcupZFcrcuEXvn2zb3khs6OywS0KizdksiDdMT3U3mGY4wJAaGA4KFp0szciKP88pFHyw1HnJnZt3tXKHDdUUDmdtXfytsnz/6bFuDqwYJorDUmiS29cL9FIkNkf/lbN8DlrqQJAf9GdCNDmCHrl2nDue1BCUq2uyFg+gpqdXl3JA+bheuaPRT3XTuaT2/XD48M/gfRMbYcMVyB4Omju42gJRBw3oQJBAJ6Hl9KF4F4txPN3x9UuNg32zIelIbmuLlLG2r5E6XQ2YQmJRohvMZnzyyZeb+OL6RaOXw+HxUh3/c9xEQ5a5VE=',
  },
  jsonwebtoken: {
    // 设置密钥
    secretKey: 'api.gitce.top.',

  },
  /**
   * 通用常量信息
   */
  constants: {
    // 登录token名称
    LOGIN_TOKEN_KEY: "login_tokens_ce:",
    SYS_CONFIG_KEY: "sys_config_ce:", //参数管理 cache key
    SYS_DICT_KEY: "sys_dict_ce:",
  },

  // 令牌有效时间
  token: {
    expireTime: 60, // 分钟
  }

}
