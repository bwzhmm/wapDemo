const   accountCol= [
  { label: "序号", key: "num" ,width:"100" },
  { label: "部门", key: "username" , },
  { label: "姓名", key: "date", },
  { label: "性别", key: "duartion"  },
  { label: "登录账号", key: "account"  },
];

const   monthReportCol= [
  { label: "序号", key: "num" ,width:"100" },
  { label: "部门", key: "username" , },
  { label: "姓名", key: "date", },
  { label: "应出勤数（天）", key: "duartion"  },
  { label: "实际出勤数（天）", key: "time"  },
  { label: "迟到≤15min", key: "data"  },
  { label: "迟到≤30min", key: "leaveDate"  },
  { label: "迟到≤1h", key: "cause"  },
  { label: "迟到≥1h", key: "myphone" },
  { label: "请假总天数", key: "allDay" },
  { label: "具体请假日期", key: "curredate" },
  { label: "绩效考核", key: "fen" },

];

export {
  accountCol,
    monthReportCol,
}