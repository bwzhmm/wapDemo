// 小时转为 多少天小时
export function getDayAndHour(HOUR) {
  // console.log('HOUR', HOUR)
  let days = 0, hours = 0, str = '';
  if (HOUR >= 8) {
    days = parseInt(HOUR / 8);//除 取整为天
    hours = HOUR % 8;
    str = hours ? `${days}天${hours}小时` : `${days}天`;
  } else {

    str = HOUR == 4 ? '半天' : `${HOUR}小时`;
  }
  // console.log('str', str)
  return str;
};

// 日期去掉-
export function stringDay(day) {
  // console.log('d', day)
  return day ? day.replace(/-/g, "") : day;
};

// 司龄
export function dataDiffYear(start, end) {
  let tempDate,
    years;
  if (start) {
    start = Date.parse(start);
    end = Date.parse(end);
    tempDate = Math.abs(end - start);
    years = parseInt((tempDate / (365 * 24 * 3600 * 1000)));
    return years < 1 ? '未满一年' : years;
  }
}
// 连续天
export function dataDiffDay(start, end) {
  let tempDate,
    days;
  if (start) {
    start = Date.parse(start);
    end = Date.parse(end);
    tempDate = Math.abs(end - start);
    days = (tempDate / (24 * 3600 * 1000)) + 1;
    return days;
  }
}

// 当前月份
export function nowMonth(day) {
  let nowDate = new Date();
  let month = nowDate.getMonth() + 1;
  month = month < 9 ? `0${month}` : `${month}`
  return month;
};

// 当前月份汉字
export function nowChMonth(day) {
  let nowDate = new Date();
  let month = nowDate.getMonth();
  let chMonthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  month = chMonthArr[month];
  return month;
};

// 最近一个月的数组  ["20200510", "20200512"]
export function rangeMonth(format) {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  let endmonth = end.getMonth() + 1, endDay = end.getDate(), startmonth = start.getMonth() + 1, startDay = start.getDate();
  endmonth = endmonth < 9 ? `0${endmonth}` : `${endmonth}`;
  endDay = endDay < 9 ? `0${endDay}` : `${endDay}`;

  startmonth = startmonth < 9 ? `0${startmonth}` : `${startmonth}`;
  startDay = startDay < 9 ? `0${startDay}` : `${startDay}`;
  let endstr = end.getFullYear() + format + endmonth + format + endDay,
    startstr = start.getFullYear() + format + startmonth + format + startDay;
  let range = [startstr, endstr];
  console.log('rang', range)
  return range;
};

//当前年月日 //2020630
export function nowYMD(format) {
  let nowDate = new Date();
  let month = nowDate.getMonth() + 1, day = nowDate.getDate();
  month = month < 9 ? `0${month}` : `${month}`;
  day = day < 9 ? `0${day}` : `${day}`
  let str = nowDate.getFullYear() + format + month + format + day;
  return str;
};

// 当前年月 202006
export function nowYearMonth(format) {
  let nowDate = new Date();
  let month = nowDate.getMonth() + 1;
  month = month < 9 ? `0${month}` : `${month}`
  let str = nowDate.getFullYear() + format + month;
  return str;
};

// 时间 或日期 中间加 ： 或 -
export function formatStr(time, format, flag) {
  let timeStr = '' + time;
  switch (timeStr.length) {
    case 4:
      timeStr = timeStr.slice(0, 2) + format + timeStr.slice(2)  //mm-dd
      break;
    case 6:
      if (flag) {
        timeStr = timeStr.slice(0, 2) + format + timeStr.slice(2, 4) + format + timeStr.slice(4, 6);// 保留6位
      } else {
        timeStr = timeStr.slice(0, 2) + format + timeStr.slice(2, 4); //hh:mm:ss 去掉ss
      }
      break;
  }
  return timeStr;
};

// 去掉时间的：，补00
export function formatTimeStr(time, format) {
  let timeStr = '' + time;
  switch (timeStr.length) {
    case 5:
      timeStr = timeStr.replace(/:/g, "") + '00'  //hhmmss 
      break;
  }
  return timeStr;
}

