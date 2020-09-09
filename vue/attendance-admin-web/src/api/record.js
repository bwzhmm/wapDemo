import service from "@/utils/util";

// 考勤记录
export function fetchTodayInfo(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/todayInfo',
    data,
  })
};
export function fetchPersonalRecord(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/personalInfo',
    data,
  })
};

export function fetchRecordList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/list',
    data,
  })
};

export function fetchRecordById(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/selectByid',
    data,
  })
};

// 考勤记录中 异常申请提交
export function abnormalApply(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/excApply',
    data,
  })
};

// 审批里 异常申请list
export function fetchAbnormalList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/excList',
    data,
  })
};

//异常审批
export function approveAbnormal(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/excHandle',
    data,
  })
};

//月份 统计报表
export function fetchMonthStatistic(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/monthStatistic',
    data,
  })
};


//同步考勤记录
export function syncRecord(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/sync',
    data,
  })
};

