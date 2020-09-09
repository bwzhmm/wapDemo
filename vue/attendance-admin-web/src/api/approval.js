import service from "@/utils/util";
// 加班申请
export function fetchOvertimeList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Overtime/list',
    data,
  })
}

export function addOvertime(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Overtime/insert',
    data,
  })
}

export function selectById(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Overtime/selectByid',
    data,
  })
}

export function approve(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Overtime/update',
    data,
  })
};

//请假 调休
export function fetchRestList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Rest/list',
    data,
  })
};

export function getRestById(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Rest/selectByid',
    data,
  })
};

export function getRestHoliday(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/getRestHoliday',
    data,
  })
};

export function InsertRestList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Rest/insert',
    data,
  })
};

export function approveRest(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Rest/handle',
    data,
  })
};

export function getRestDays(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Record/getRestDays',
    data,
  })
};


//  绩效考核
export function fetchPerformanceList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Performance/list',
    data,
  })
};

export function addPerformance(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Performance/insertBatch',
    data,
  })
}