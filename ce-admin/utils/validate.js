/*
 * @Author: Ghost

 * @Date: 2020-10-21 13:46:46
 * @LastEditTime: 2022-03-18 13:53:46
 * @Description: ...每位新修改者自己的信息
 */
const { token } = require('@/config')


//  生成时间戳
const timeId = () => {
  return '' + new Date().getTime()
}

// 时间戳转 "2020-12-08 15:15:19"
const timestampToTime = (timestamp, format = 'yyyy-MM-dd HH:mm:ss') => {
  const time = new Date(Number(timestamp))
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()


  if (month < 10) { month = '0' + month }
  if (date < 10) { date = '0' + date }
  if (hours < 10) { hours = '0' + hours }
  if (minute < 10) { minute = '0' + minute }
  if (second < 10) { second = '0' + second }
  return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
}

// 随机数字
const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 生成19位的userID
const userId = () => {
  return (rand(100, 999) + timeId()) + rand(100, 999)
}

// 生成随机数 默认17位
const getId = (min = 1000, max = 9999) => {
  return (rand(min, max) + timeId())
}


//生成唯一订单号  雪花算法
const bigInOrderNo = (key = 1) => {
  var Snowflake = /** @class */ (function() {
    function Snowflake(_workerId, _dataCenterId, _sequence) {
      this.twepoch = 1288834974657n;
      this.workerIdBits = 5n;
      this.dataCenterIdBits = 5n;
      this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31
      this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31
      this.sequenceBits = 12n;
      this.workerIdShift = this.sequenceBits; // 值为：12
      this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
      this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
      this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095
      this.lastTimestamp = -1n;
      //设置默认值,从环境变量取
      this.workerId = 1n;
      this.dataCenterId = 1n;
      this.sequence = 0n;
      if (this.workerId > this.maxWrokerId || this.workerId < 0) {
        throw new Error('_workerId must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
      }
      if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
        throw new Error('_dataCenterId must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']');
      }

      this.workerId = BigInt(_workerId);
      this.dataCenterId = BigInt(_dataCenterId);
      this.sequence = BigInt(_sequence);
    }
    Snowflake.prototype.tilNextMillis = function(lastTimestamp) {
      var timestamp = this.timeGen();
      while (timestamp <= lastTimestamp) {
        timestamp = this.timeGen();
      }
      return BigInt(timestamp);
    };
    Snowflake.prototype.timeGen = function() {
      return BigInt(Date.now());
    };
    Snowflake.prototype.nextId = function() {
      var timestamp = this.timeGen();
      if (timestamp < this.lastTimestamp) {
        throw new Error('Clock moved backwards. Refusing to generate id for ' +
          (this.lastTimestamp - timestamp));
      }
      if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1n) & this.sequenceMask;
        if (this.sequence === 0n) {
          timestamp = this.tilNextMillis(this.lastTimestamp);
        }
      } else {
        this.sequence = 0n;
      }
      this.lastTimestamp = timestamp;
      return ((timestamp - this.twepoch) << this.timestampLeftShift) |
        (this.dataCenterId << this.dataCenterIdShift) |
        (this.workerId << this.workerIdShift) |
        this.sequence;
    };
    return Snowflake;
  }());
  var tempSnowflake = new Snowflake(1n, 1n, 0n);
  var orderNo = tempSnowflake.nextId();


  return String(orderNo).replace('1', key)
}




// 时间转换
// formatTime(element, 'yyyy-MM-dd HH:mm:ss')
const formatTime = (date, format) => {
  var timeformat = new Date(date)
  var tf = function(i) { return (i < 10 ? '0' : '') + i }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
    switch (a) {
      case 'yyyy':
        return tf(timeformat.getFullYear())
      case 'MM':
        return tf(timeformat.getMonth() + 1)
      case 'mm':
        return tf(timeformat.getMinutes())
      case 'dd':
        return tf(timeformat.getDate())
      case 'HH':
        return tf(timeformat.getHours())
      case 'ss':
        return tf(timeformat.getSeconds())
    }
  })
}



/**
 *  获取开始时间跟结束时间
 * @returns {}
 */
const loginTime = () => {
  let loginTime = new Date().getTime()
  let expireTime = loginTime + (1000 * 60 * token.expireTime)
  return {
    loginTime,
    expireTime
  }
}


module.exports = {
  getId, userId, timeId, rand, timestampToTime, bigInOrderNo, formatTime, loginTime
}




