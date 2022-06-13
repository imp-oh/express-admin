# Express  ⚡

## 项目启动
```
  pnpm dev
```

## 文件目录

```
--| config
----| dbconfig.js  => 数据库配置
----| header.js => 请求头配置
----| index.js => 公共依赖
----| interceptor.js => 拦截器
----| routes.js => 路由配置
----| static.js => 静态配置
```



# 修改数据库
 config =>dbconfig.js 




## api文档 
```
官方配置地址 https://apidocjs.com/#params
其他教程 https://www.jianshu.com/p/7e1b057b047c/   https://www.jianshu.com/p/34eac66b47e3

项目terminal执行命令行：
  apidoc -i routes/ -o public/apidoc/

```


## 防止SQL注入
相关链接`https://www.cnblogs.com/rysinal/p/8350783.html`

### 方法一：使用escape()对传入参数进行编码：
```js
// 参数编码方法escape()有如下三个：
mysql.escape(param)
connection.escape(param)
pool.escape(param)

// 方法三： 使用escapeId()编码SQL查询标识符：
mysql.escapeId(identifier)
connection.escapeId(identifier)
pool.escapeId(identifier)

//方法四： 使用mysql.format()转义参数：
// 例如：
var userId = 1;
var sql = "SELECT * FROM ?? WHERE ?? = ?";
var inserts = ['users', 'id', userId];
sql = mysql.format(sql, inserts); // SELECT * FROM users WHERE id = 1

```




# 加密使用方式
``` js

/** 生成密钥 */
  var key = new NodeRSA({ b: 1024 }); //生成512位秘钥
  key.setOptions({ encryptionScheme: 'pkcs1' })
  var pubkey = key.exportKey('pkcs8-public'); //导出公钥
  var prikey = key.exportKey('pkcs8-private'); //导出私钥

  console.log(pubkey)
  console.log('-------------------')
  console.log(prikey)





  var key = new NodeRSA({ b: 512 }); //生成512位秘钥
  var pubkey = key.exportKey('pkcs8-public'); //导出公钥
  var prikey = key.exportKey('pkcs8-private'); //导出私钥
  var pubKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIoqyekvHO20d0lnr82P5iNPgwvFbo4KG3asYtfofne+cJhTTomPTTohiIhvALtcAbT1+Mdc1ByW0qfddhJBgKMCAwEAAQ=='
  var priKey = 'MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAiirJ6S8c7bR3SWevzY/mI0+DC8Vujgobdqxi1+h+d75wmFNOiY9NOiGIiG8Au1wBtPX4x1zUHJbSp912EkGAowIDAQABAkBrLAOQR8Ylr+0zWCUqyyrVSvC4ab12mepxpAfLuACZOk2r2sXqEJSO7rKot6fEFvQUSWGxofnOOq26MWzfOjlJAiEA19q/21mgryuUkmZwdE+oa4QslOWM8jkcVe1pZggFMscCIQCj3TG0TBXYDDUoVWYzNLslDDvZ6yFPiMJijrIW6m2nRQIhAJEWbQ0wcmwr2+KHzqCvhmI2Zozyusl5j81GFilJzMyzAiEAiuiDrhehnNgcZ+idDmNxEeLhCcatIkMIpYvZpFtuQRECIBGPkR84Fr4IMltf4iqpeMPX+eg6/OkYHxQeayi1Hgnz'
  var pubKey1 = new NodeRSA(pubKey, 'pkcs8-public'); //导入公钥
  var priKey1 = new NodeRSA(priKey, 'pkcs8-private'); //导入私钥
  const jia = pubKey1.encrypt('jiang', 'base64')
  console.log(jia)

  const jie = priKey1.decrypt(jia, 'utf8')
  console.log('---解密')
  console.log(jie)
```







# pkg 打包地址
```
打包命令 ： pkg -t win package.json

# 相关地址 
https://www.npmjs.com/package/pkg
https://www.yisu.com/zixun/182832.html
```

# pkg 打包遇到的问题
####  TypeError [ERR_INVALID_ARG_TYPE]: The &quot;path&quot; argument must be of type string. Received typ
```js

// 报错信息 TypeError [ERR_INVALID_ARG_TYPE]: The &quot;path&quot; argument must be of type string. Received typ
// 相关链接 https://www.codeee.top/web/2021-05-28/464.html
//  我们打包成pkg 报错，这个时候我们就找到【node_modules/express/lib/view.js】
// 添加一个 全局的    var _path = require('path');
// 在往下找到 105行左右  
// 将 var loc = resolve(root, name);   替换成 var loc = _path.resolve(root, name);

```  



# redis 使用
var redis = require('redis');

var client = redis.createClient('6379', '127.0.0.1');

client.auth("password");
client.set('hello','This is a value');
client.expire('hello',10) //设置过期时间
client.exists('key') //判断键是否存在
client.del('key1')
client.get('hello');

 

//stirng
命令 行为 返回值 使用示例(略去回调函数)
set 设置存储在给定键中的值 OK set('key', 'value')
get 获取存储在给定键中的值 value/null get('key')
del 删除存储在给定键中的值(任意类型) 1/0 del('key')
incrby 将键存储的值加上整数increment incrby('key', increment)
decrby 将键存储的值减去整数increment decrby('key', increment)
incrbyfloat 将键存储的值加上浮点数increment incrbyfloat('key', increment)
append 将值value追加到给定键当前存储值的末尾 append('key', 'new-value')
getrange 获取指定键的index范围内的所有字符组成的子串 getrange('key', 'start-index', 'end-index')
setrange 将指定键值从指定偏移量开始的子串设为指定值 setrange('key', 'offset', 'new-string')
//list
命令 行为 返回值 使用示例(略去回调函数)
rpush 将给定值推入列表的右端 当前列表长度 rpush('key', 'value1' [,'value2']) (支持数组赋值)
lrange 获取列表在给定范围上的所有值 array lrange('key', 0, -1) (返回所有值)
lindex 获取列表在给定位置上的单个元素 lindex('key', 1)
lpop 从列表左端弹出一个值，并返回被弹出的值 lpop('key')
rpop 从列表右端弹出一个值，并返回被弹出的值 rpop('key')
ltrim 将列表按指定的index范围裁减 ltrim('key', 'start', 'end')

//set
命令 行为 返回值 使用示例(略去回调函数) sadd 将给定元素添加到集合 插入元素数量 sadd('key', 'value1'[, 'value2', ...]) (不支持数组赋值)(元素不允许重复)
smembers 返回集合中包含的所有元素 array(无序) smembers('key')
sismenber 检查给定的元素是否存在于集合中 1/0 sismenber('key', 'value')
srem 如果给定的元素在集合中，则移除此元素 1/0 srem('key', 'value')
scad 返回集合包含的元素的数量 sacd('key')
spop 随机地移除集合中的一个元素，并返回此元素 spop('key')
smove 集合元素的迁移 smove('source-key'dest-key', 'item')
sdiff 返回那些存在于第一个集合，但不存在于其他集合的元素(差集) sdiff('key1', 'key2'[, 'key3', ...])
sdiffstore 将sdiff操作的结果存储到指定的键中 sdiffstore('dest-key', 'key1', 'key2' [,'key3...])
sinter 返回那些同事存在于所有集合中的元素(交集) sinter('key1', 'key2'[, 'key3', ...])
sinterstore 将sinter操作的结果存储到指定的键中 sinterstore('dest-key', 'key1', 'key2' [,'key3...])
sunion 返回那些至少存在于一个集合中的元素(并集) sunion('key1', 'key2'[, 'key3', ...])
sunionstore 将sunion操作的结果存储到指定的键中 sunionstore('dest-key', 'key1', 'key2' [,'key3...])
//hash
命令 行为 返回值 使用示例(略去回调函数)
hset 在散列里面关联起给定的键值对 1(新增)/0(更新) hset('hash-key', 'sub-key', 'value') (不支持数组、字符串)
hget 获取指定散列键的值 hget('hash-key', 'sub-key')
hgetall 获取散列包含的键值对 json hgetall('hash-key')
hdel 如果给定键存在于散列里面，则移除这个键 hdel('hash-key', 'sub-key')
hmset 为散列里面的一个或多个键设置值 OK hmset('hash-key', obj)
hmget 从散列里面获取一个或多个键的值 array hmget('hash-key', array)
hlen 返回散列包含的键值对数量 hlen('hash-key')
hexists 检查给定键是否在散列中 1/0 hexists('hash-key', 'sub-key')
hkeys 获取散列包含的所有键 array hkeys('hash-key')
hvals 获取散列包含的所有值 array hvals('hash-key')
hincrby 将存储的键值以指定增量增加 返回增长后的值 hincrby('hash-key', 'sub-key', increment) (注：假如当前value不为为字符串，则会无输出，程序停止在此处)
hincrbyfloat 将存储的键值以指定浮点数增加

//zset
命令 行为 返回值 使用示例(略去回调函数)
zadd 将一个带有给定分支的成员添加到有序集合中 zadd('zset-key', score, 'key') (score为int)
zrange 根据元素在有序排列中的位置，从中取出元素
zrangebyscore 获取有序集合在给定分值范围内的所有元素
zrem 如果给定成员存在于有序集合，则移除
zcard 获取一个有序集合中的成员数量 有序集的元素个数 zcard('key')


keys命令组
命令 行为 返回值 使用示例(略去回调函数)
del 删除一个(或多个)keys 被删除的keys的数量 del('key1'[, 'key2', ...])
exists 查询一个key是否存在 1/0 exists('key')
expire 设置一个key的过期的秒数 1/0 expire('key', seconds)
pexpire 设置一个key的过期的毫秒数 1/0 pexpire('key', milliseconds)
expireat 设置一个UNIX时间戳的过期时间 1/0 expireat('key', timestamp)
pexpireat 设置一个UNIX时间戳的过期时间(毫秒) 1/0 pexpireat('key', milliseconds-timestamp)
persist 移除key的过期时间 1/0 persist('key')
sort 对队列、集合、有序集合排序 排序完成的队列等 sort('key'[, pattern, limit offset count])
flushdb 清空当前数据库


# pom 操作文档 
https://www.cnblogs.com/bf-blackfish/p/10907347.html




# 新版编辑器  muya