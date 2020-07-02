
import { Message, Loading } from 'element-ui';//引入elm组件
import axios from 'axios';
import qs from 'qs';
let Axios = axios;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
let global = {
  url: {}
};

global.url['appportal'] = window.global.ApiUrl;
global.url['check'] = window.global.ApiUrl;
global.url['authweb'] = window.global.ApiUrl;

/** Function : ajax方法封装修改 */
let startAjax = function (options) {
  return new Promise(function (resolve, reject) {
    if (options && options.url && options.code) {
      getRealUrl(options.code, options.url).then(function (data) {
        // console.log('data', data)
        let ajaxSettings = {
          url: data,
          method: 'POST',
          headers: {
            "IDSTGC": getCookie("IDSTGC") || '127219c604ff44dea900aa33779e0e2d',
          },
          data: options.isRep ? (options.data) : (qs.stringify(options.data) || ''),
        }
        return Axios(ajaxSettings).then(function (data) {
          let orgindata = data;
          let res = data.data;
          if (res.login === false) {
            // console.log('resa', res)
            resolve(res);
            // Message.error('未登录');
            // setting.tips(res.message);
            redirectToLogin();
            // alert('no login');
          } else {
            if (res.success === false) {
              Message.error(res.errInf.metailBusInf || '接口出错了');
              // setting.tips(res.message);
              // setting.tips(res.errInf.metailBusInf);
              // orgindata.login = false;
              resolve(orgindata);
            } else {
              resolve(res);
            }
          }
        }).catch(function (data) {
          reject(data);
        })
      }).catch(function (data) {
        reject(data);
      });
    } else {
      reject('参数错误！');
      // setting.tips('参数错误！');
    }
  })
}
/** Function :获取cookie */
let getCookie = function (name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
/** Function : 登录页面  */
let redirectToLogin = function (Url) {
  if (Url) {
    return Url;
  } else {
    let pathName = window.location.href.split('attendance')[0];
    let url = pathName + '/idsweb/';//http://160.255.0.67:8888/attendance
    let purl = document.location.href;//
    purl = document.location.href.split('#')[0];
    // let herfUrl = 'http://172.20.1.236:80/check/rest/Idsclient/reqLogin?reqUrl=' + encodeURIComponent(purl);
    let herfUrl = 'http://160.255.0.67:8888/check/rest/Idsclient/reqLogin?reqUrl=' + encodeURIComponent(purl);
    // alert(herfUrl)
    if (process.env.NODE_ENV === "production") {
      location.href = herfUrl;
    }
  }
}
/** Function : 时间函数封装  */
let formatTime = function (time, format) {
  let timeLength = '' + time;
  let tf = function (d) {
    return d >= 10 ? d : '0' + d;
  }
  let dateObj;
  switch (timeLength.length) {
    case 14 || 17:
      dateObj = new Date(parseInt(timeLength.substring(0, 4)),
        parseInt(timeLength.substring(4, 6)) - 1,
        parseInt(timeLength.substring(6, 8)),
        parseInt(timeLength.substring(8, 10)),
        parseInt(timeLength.substring(10, 12)),
        parseInt(timeLength.substring(12, 14)));
      break;
    case 13:
      dateObj = new Date(time);
      break;
    case 8:
      dateObj = new Date(parseInt(timeLength.substring(0, 4)),
        parseInt(timeLength.substring(4, 6)) - 1,
        parseInt(timeLength.substring(6, 8))
      );
      break;
    default:
      throw "Ow<这是一条来自common的提示：format参数输入错误";
  }
  let timeString = format.replace(/YYYY/gi, dateObj.getFullYear() + '')
    .replace(/MM/g, tf(dateObj.getMonth() + 1))
    .replace(/DD/gi, tf(dateObj.getDate()))
    .replace(/hh/gi, tf(dateObj.getHours()))
    .replace(/mm/g, tf(dateObj.getMinutes()))
    .replace(/ss/gi, tf(dateObj.getSeconds()));
  return timeString;
}
//返回当前时间的年月日
var ymd = function (time) {
  var myDate = new Date(time);
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {//月
    month = "0" + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {//日
    strDate = "0" + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  return myDate.getFullYear() + month + strDate + '000000';
}
//将时间数组中的时间换成自己想要的格式["20190821000000", "20190828000000"]
var formattimevalue = function (type, timeArr) {
  switch (type) {
    case 'Y':
      return timeArr[0].slice(0, 4) + ' - ' + timeArr[1].slice(0, 4)
      break;
    case 'M':
      return timeArr[0].slice(0, 4) + '-' + timeArr[0].slice(4, 6) + ' - ' + timeArr[1].slice(0, 4) + '-' + timeArr[1].slice(4, 6)
      break;
    default:
      return timeArr[0].slice(0, 4) + '-' + timeArr[0].slice(4, 6) + '-' + timeArr[0].slice(6, 8) + ' - ' + timeArr[1].slice(0, 4) + '-' + timeArr[1].slice(4, 6) + '-' + timeArr[1].slice(6, 8)
      break;
  }
}
//将字符串格式的时间再转成数组的
var formattimevalueback = function (type, str) {
  var strArr = []
  switch (type) {
    case 'Y':
      str = str.split(' - ');
      strArr[0] = str[0] + '0101000000';
      strArr[1] = str[1] + '1231000000';
      return strArr
      break;
    case 'M':
      str = str.split(' - ');
      strArr[0] = str[0].replace(/-/g, '') + '01000000';
      strArr[1] = str[1].replace(/-/g, '') + '28000000';
      return strArr
      break;
    default:
      str = str.split(' - ');
      strArr[0] = str[0].replace(/-/g, '') + '000000';
      strArr[1] = str[1].replace(/-/g, '') + '000000';
      return strArr
      break;
  }
}
//当天向前推7天
var getBeforeDate = function () {
  var newDate = new Date();
  var befminuts = newDate.getTime() - 24 * 60 * 60 * 1000 * 7;//计算前几天用减，计算后几天用加，最后一个就是多少天的数量 n为向前或者向后天数
  var beforeDat = new Date;
  beforeDat.setTime(befminuts);
  var befMonth = beforeDat.getMonth() + 1;
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
  var befDate = beforeDat.getDate();
  var da = befDate >= 10 ? befDate : '0' + befDate;
  var newDate = beforeDat.getFullYear() + '-' + mon + '-' + da;
  return newDate
}
//前一年
var getBeforeYear = function () {
  var newDate = new Date();
  var befminuts = newDate.getTime() - 24 * 60 * 60 * 1000 * 365;//计算前几天用减，计算后几天用加，最后一个就是多少天的数量 n为向前或者向后天数
  var beforeDat = new Date;
  beforeDat.setTime(befminuts);
  var befMonth = beforeDat.getMonth() + 1;
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
  var befDate = beforeDat.getDate();
  var da = befDate >= 10 ? befDate : '0' + befDate;
  var newDate = beforeDat.getFullYear() + '-' + mon + '-' + da;
  return newDate
}

let formatMins = function (num) {
  if (typeof parseInt(num) === 'number') {
    num = parseInt(num);
  } else {
    throw "Ow<这是一条来自common的提示：传入的参数类型不正确，需要一个数字/数字字符串";
  }
  let tf = function (d) {
    return d >= 10 ? d : '0' + d;
  }
  let SS = parseInt(num % 60);
  let HH = parseInt(num / 3600);
  let MM = parseInt((num - HH * 3600) / 60)
  return `${tf(HH)}:${tf(MM)}:${tf(SS)}`;

}
//格式化姓名，只显示姓，其他*显示  eg：张*
var formatName = function (name) {
  return name.charAt(0) + Array(name.length).join('*');
}
// 数组转tree
function tree(list = [], ID, PID) {
  const data = JSON.parse(JSON.stringify(list)) // 浅拷贝不改变源数据
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item.ID] = item
  })
  data.forEach(item => {
    const parent = map[item.PID]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
//当天向前推30天，并返回[一个月之前的时间，今天的时间]
var getBeforeDate = function () {
  var newDate = new Date();
  var befminuts = newDate.getTime() - 24 * 60 * 60 * 1000 * 30;//计算前几天用减，计算后几天用加，最后一个就是多少天的数量 n为向前或者向后天数
  var beforeDat = new Date;
  beforeDat.setTime(befminuts);
  var befMonth = beforeDat.getMonth() + 1;
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
  var befDate = beforeDat.getDate();
  var da = befDate >= 10 ? befDate : '0' + befDate;
  var befHour = beforeDat.getHours();
  var hour = befHour >= 10 ? befHour : '0' + befHour;
  var befMin = beforeDat.getMinutes();
  var min = befMin >= 10 ? befMin : '0' + befMin;
  var befSend = beforeDat.getSeconds();
  var send = befSend >= 10 ? befSend : '0' + befSend;
  var BeforeDate = '' + beforeDat.getFullYear() + + mon + da + hour + min + send;
  var NowDate = nowday();
  return [BeforeDate, NowDate];
}
//获取今天的时间
var nowday = function () {
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {//月
    month = "0" + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {//日
    strDate = "0" + strDate;
  }
  var hour = myDate.getHours(); // 时
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  var seconds = myDate.getSeconds(); // 分
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return '' + myDate.getFullYear() + month + strDate + hour + minutes + seconds;
}
/** Function : 获取url */
let getRealUrl = function (code, url) {
  return new Promise(function (resolve, reject) {
    let realUrl = global.url[code] ? global.url[code] : false;
    if (!realUrl) {
      startAjax({
        code: 'appportal',
        url: 'Portal/getPhyAppByCODEs',
        data: { CODEs: JSON.stringify([code]) },
      }).then(function (data) {
        let res = data;
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            // global.url[res.data[i].CODE] = res.data[i].URL+'rest/';
            global.url[res.data[i].CODE] = res.data[i].URL;
          }
          resolve(global.url[code] + url);
        } else {
          reject('fail!');
          // setting.tips('获取Url失败！');
        }
        resolve(global.url[code] + url)
      }).catch(function (data) {
        reject('fail!');
        reject(data);
      })
    } else {
      resolve(global.url[code] + url)
    }
  });
}
//基础平台的sql验证
// 方法的验证
var tableSql = function (action, tableName) {
  if (action == "add") {
    return "CREATE TABLE `" + tableName + "` (`ID`  varchar(32) NOT NULL ,PRIMARY KEY (`ID`));";
  }
  if (action == "delete") {
    return "DROP TABLE IF EXISTS `" + tableName + "`;";
  }
}
//对象属性的验证
var columnSql = function (action, tableName, oldAttr, newAttr) {
  var sql = "ALTER TABLE `" + tableName + "` ";
  if (action == "add") {
    if (newAttr.CODE == 'ID' || newAttr.CODE == 'id') {
      return '';
    }
    sql = sql + "ADD COLUMN `" + newAttr.CODE + "` " + newAttr.TYPE;
    if (newAttr.LENGTH) {
      sql = sql + "(" + newAttr.LENGTH + ")";
    }
    if (newAttr.ISNULL == "1") {
      sql = sql + " NOT NULL";
    } else {
      sql = sql + " NULL";
    }
    if (newAttr.ISKEY == "1") {
      sql = sql + ",ADD PRIMARY KEY (`" + newAttr.CODE + "`);";
    } else {
      sql = sql + ";";
    }
    return sql;
  } else if (action == "update") {
    if (newAttr.ISKEY == "1" && newAttr.ISKEY != oldAttr.ISKEY) {
      sql = sql + " ADD PRIMARY KEY (`" + newAttr.CODE + "`),";
    }
    if (newAttr.ISKEY == "0" && newAttr.ISKEY != oldAttr.ISKEY) {
      sql = sql + " DROP PRIMARY KEY,";
    }
    if (oldAttr.CODE == newAttr.CODE) {
      sql = sql + "MODIFY COLUMN `" + oldAttr.CODE + "` " + newAttr.TYPE;
      if (newAttr.LENGTH) {
        sql = sql + "(" + newAttr.LENGTH + ")";
      }
      if (newAttr.ISNULL == "1") {
        sql = sql + " NOT NULL;";
      } else {
        sql = sql + " NULL;";
      }
    } else {
      sql = sql + "CHANGE COLUMN " + "`" + oldAttr.CODE + "` " + " `" + newAttr.CODE + "` " + newAttr.TYPE;
      if (newAttr.LENGTH) {
        sql = sql + "(" + newAttr.LENGTH + ")";
      }
      if (newAttr.ISNULL == "1") {
        sql = sql + " NOT NULL;";
      } else {
        sql = sql + " NULL;";
      }
    }
    return sql;
  } else if (action == "delete") {
    if (oldAttr.ISKEY == "1") {
      sql = sql + "DROP PRIMARY KEY,";
    }
    sql = sql + "DROP COLUMN `" + oldAttr.CODE + "`;";
    return sql;
  }
}
//索引的sql
var indexSql = function (action, tableName, index) {
  var sql = "ALTER TABLE `" + tableName + "` ";
  if (action == "update") {
    sql = sql + "DROP INDEX `" + index.CODE + "`,ADD INDEX `" + index.CODE + "` (";
    index.attrs.forEach(m => {
      sql = sql + "`" + m + "`,";
    });
    sql = sql.substring(0, sql.length - 1);
    sql = sql + ") USING BTREE;";
  }
  if (action == "add") {
    sql = sql + "ADD INDEX `" + index.CODE + "` (";
    index.attrs.forEach(m => {
      sql = sql + "`" + m + "`,";
    });
    sql = sql.substring(0, sql.length - 1);
    sql = sql + ") USING BTREE;";
  }
  if (action == "delete") {
    sql = sql + "DROP INDEX `" + index.CODE + "`;";
  }
  return sql;
}
// 递归循环
var recursiveFunction = function (data) {
  var str = []
  const getStr = function (list) {
    list.forEach(function (row) {
      if (row.children) {
        getStr(row.children)
      } else {
        str.push(row.ID)
      }
    })
  }
  getStr(data)
  return str
}
// 取两个对象的交集
var getIntersectionData = function (dataA, dataB) {
  outLoop: for (let i = dataA.length - 1; i >= 0; i--) {
    for (let j = 0; j < dataB.length; j++) {
      if (dataA[i].id === dataB[j].id) {
        continue outLoop;
      }
    }
    dataA.splice(i, 1);
  }
  return dataA;
}

export default {
  getRandomNum() {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 16; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  scanqrcode(callback) {
    return qrcode(callback)
  },
  recursiveFunction(data) {
    return recursiveFunction(data)
  },
  getIntersectionData(dataA, dataB) {
    return getIntersectionData(dataA, dataB)
  },
  //基础平台的sql的验证
  //对象方法的验证
  tableSql(action, tableName) {
    return tableSql(action, tableName)
  },
  //对象属性的验证
  columnSql(action, tableName, oldAttr, newAttr) {
    return columnSql(action, tableName, oldAttr, newAttr)
  },
  indexSql(action, tableName, index) {
    return indexSql(action, tableName, index)
  },
  //返回当前的年月日
  formatMYD(time) {
    return ymd(time)
  },
  formattimevalue(type, time) {
    return formattimevalue(type, time)
  },
  formattimevalueback(type, time) {
    return formattimevalueback(type, time)
  },

  getnowday() {
    return nowday()
  },
  //返回当前时间的30天
  getBeforeDate() {
    return getBeforeDate()
  },
  getBeforeYear() {
    return getBeforeYear()
  },
  //已知tan的值，求出角度
  angle(tan) {
    return Math.atan(tan) * 180 / Math.PI
  },
  //将秒数转成分钟数
  formatmintomins(s) {
    return Math.floor(s / 60) + '分' + s % 60 + '秒'
  },
  //生成tree
  formatTree(data, key, parentKey, map) {
    return new tree(data, key, parentKey, map)
  },
  //勾股定理
  dist(a, b) {
    return Math.sqrt(a * a + b * b);
  },
  /** Function : 时间函数封装  */
  formatTime(time, format) {
    return formatTime(time, format);
  },
  /** Function : 重写ajax  */
  postAjax(options) {
    return startAjax(options);
  },
  /** Function : 获取真实url,promise对象注意！文件导出 */
  getUrlByCode(code, url) {
    return getRealUrl(code, url);
  },
  /** Function : 获取cookie ,  */
  getCookieByName(cookiename) {
    return getCookie(cookiename);
  },
  /** Function : 获取Url参数 ,  */
  getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); // 解码
    return '';
  },
  /** Function : 把秒数转换为hh:mm:ss形式 , Created By HarryC on 2019/3/1 0001 */
  formatSeconds(num) {
    return formatMins(num);
  },
  //格式化姓名，只显示姓，其他*显示  eg：张*
  formatName(name) {
    return formatName(name);
  },
  utf16Str(utf16Str) {
    var utf8Arr = [];
    var byteSize = 0;
    for (var i = 0; i < utf16Str.length; i++) {
      //获取字符Unicode码值
      var code = utf16Str.charCodeAt(i);

      //如果码值是1个字节的范围，则直接写入
      if (code >= 0x00 && code <= 0x7f) {
        byteSize += 1;
        utf8Arr.push(code);

        //如果码值是2个字节以上的范围，则按规则进行填充补码转换
      } else if (code >= 0x80 && code <= 0x7ff) {
        byteSize += 2;
        utf8Arr.push((192 | (31 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      } else if ((code >= 0x800 && code <= 0xd7ff)
        || (code >= 0xe000 && code <= 0xffff)) {
        byteSize += 3;
        utf8Arr.push((224 | (15 & (code >> 12))));
        utf8Arr.push((128 | (63 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      } else if (code >= 0x10000 && code <= 0x10ffff) {
        byteSize += 4;
        utf8Arr.push((240 | (7 & (code >> 18))));
        utf8Arr.push((128 | (63 & (code >> 12))));
        utf8Arr.push((128 | (63 & (code >> 6))));
        utf8Arr.push((128 | (63 & code)))
      }
    }

    return utf8Arr
  },
  /** Function : 正则表达式  */
  regExps: {
    chinese: /^[\u4e00-\u9fa5]{0,}$/, // 匹配中文字符
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, // email地址
    account: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, // 字母开头，允许 5-16 字节，允许字母数字下划线
    pwd: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, // 中文、英文、数字及下划线
    url: /^[http|ftp|https]:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/, // url地址
    qq: /^[1-9]\d{4,9}$/, // QQ
    phone: /^((0\d{2,3}-\d{7,8})|(1[358479]\d{9})|(\d{8}))$/,
    yphone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, // 手机号码
    floatNum: /^([1-9]\d{0,3}?(\.\d{1,2})?|0|0\.\d{1,2})$/, // max=9999.99
    num: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,//有1~3位小数的正实数
    znum: /^[1-9]\d*$/,//有1~3位小数的正实数
    isbn: /^(\d[- ]*){12}[\dxX]$/, //验证标准的13位isbn号
    URL: "rest",
    PREURL: '',
    identity: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,  //身份证号码
    sqlcode: /^[a-zA-Z_]{1,}$/,//字母加下划线
  }
}

