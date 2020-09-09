//全局常量数据
export const ENV = {
    CONTEXTID: "485e2d2c255243f29007de7e36f3a3e2",// 上下文id
    // ORGID: "eac0c783dbd64650b820a0fcc8e6eb22",// 所属部门
    ORGID: "",// 所属部门
};

export const NavMenu = [{
    title: "企业信息",
    path: "enterprise-details",
},
{
    title: "环境测评信息",
    path: "env-evaluate-details",
},
{
    title: "污染防治信息",
    path: "pollute-prevent-details",
},
{
    title: "其他测评信息",
    path: "other-evaluate-details",
},
];
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

//一维数组转成树结构
export function toTree(tarArray) {
    var obj = {}
    tarArray.map((item, index) => {
        obj[item.ID] = item
    })
    var newArr = [];
    for (var i = 0; i < tarArray.length; i++) {
        var item = tarArray[i]
        var parent = obj[item.PID]
        if (parent) {
            if (parent.children) {
                parent.children.push(item)
            } else {
                parent.children = []
                parent.children.push(item)
            }
        } else {
            newArr.push(item)
        }
    }
    return newArr;
}

//比较日期大小
export function compareDate(date1, date2) {
    var date1 = date1 ? new Date(date1) : new Date();
    var date2 = date2 ? new Date(date2) : new Date();
    if (date1.getTime() > date2.getTime()) {
        return true;
    } else {
        return false;
    }
}

// 日期去掉-
export function stringDay(day) {
    return day ? day.replace(/-/g, "") : day;
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
        case 8:
            timeStr = timeStr.slice(0, 4) + format + timeStr.slice(4, 6) + format + timeStr.slice(6, 8);  //yyyy-mm-dd
            break;
    }
    return timeStr;
};

// 获取url参数
export function getUrlVar(variable) {
    let query = window.location.href;
    let vars = query.split("?");
    let val;
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) { val = pair[1]; }
    }
    return val;
}