// 日期去掉-
export function stringDay(day) {
  console.log('d',day)
    return day?day.replace(/-/g, ""):day;
  };
//  异常申请
const   unNormalCol =  [
        { label: "序号", key: "ID",width:"100"  },
        { label: "申请人", key: "NAME",  },
        { label: "考勤日期", key: "date",  },
        { label: "打卡时间", key: "time",  },
        { label: "原考勤结果", key: "orginRes", },
        { label: "调整结果", key: "changeRes" , },
        { label: "情况说明", key: "desc"  },
        { label: "创建时间", key: "createTime" , }
      ];
//  考勤记录
const   attendanceCol= [
  { label: "序号", key: "num" ,width:"100" },
  { label: "申请人", key: "username" , },
  { label: "考勤日期", key: "date", },
  { label: "打卡时间", key: "time"  },
  { label: "原考勤结果", key: "orginRes"  },
  { label: "调整结果", key: "changeRes" },
  { label: "情况说明", key: "desc", },
  { label: "加班时长（h）", key: "duartion"  }
      ];
//  加班申请
const   overtimeCol= [
  { label: "申请人", key: "NAME" , },
  { label: "加班日期", key: "DAY", },
  { label: "加班时长（h）", key: "HOURS"  },
  { label: "加班原因", key: "REASON"  },
  { label: "申请状态", key: "STATE",  },
  { label: "创建时间", key: "CREATETIME" },
];
//  请假调休
const   leaveCol= [
  { label: "序号", key: "num" ,width:"100" },
  { label: "申请人", key: "username" , },
  { label: "请假类型", key: "type", },
  { label: "请假时间", key: "date"  },
  { label: "请假时长", key: "duartion"  },
  { label: "请假原因", key: "changeRes" },
  { label: "申请状态", key: "desc", },
  { label: "创建时间", key: "time"  }
];
//  绩效考核
const   performanceCol= [
  { label: "姓名", key: "username" ,width:"100" },
  { label: "2020-05", key: "num" , },
  { label: "2020-04", key: "num", },
  { label: "2020-03", key: "num"  },
  { label: "2020-02", key: "num"  },
  { label: "2020-01", key: "num" },
  { label: "平均分", key: "desc", },
  { label: "总计", key: "duartion"  }
];

export {
    unNormalCol,
    attendanceCol,
    overtimeCol,
    leaveCol,
    performanceCol
}