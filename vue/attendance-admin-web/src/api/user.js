
import service from "@/utils/util";

// 离职管理 
export function fetchResignList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Resignation/list',
    data,
  })
}

export function addResign(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/Resignation/insert',
    data,
  })
};

// 员工管理 
export function fetchUserList(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/list',
    data,
  })
};

export function fetchUserById(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/selectByid',
    data,
  })
};

export function updateUser(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/update',
    data,
  })
};

// 密码
export function editPassword(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/changePWD',
    data,
  })
};

export function resetPassword(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/resetPWD',
    data,
  })
};

// 同步用户
export function syncUser(data) {
  return service.postAjax({
    code: 'check',
    url: '/check/rest/User/sync',
    data,
  })
}


//获取该用户拥有的菜单
export function fetchUserMenu(data) {
  return service.postAjax({
    code: "appportal",
    url: '/appportalweb/rest/Portal/getUserMenu',
    data,
  })
}

//获取当前登录的用户
export function fetchCurrentUser(data) {
  return service.postAjax({
    code: "appportal",
    url: '/appportalweb/rest/Idsclient/getCurrentUser',
    data,
  })
}

//外派驻场

export function fetchExpatriateList(data) {
  return service.postAjax({
    code: "check",
    url: '/check/rest/Expatriate/list',
    data,
  })
}

export function insertExpatriate(data) {
  return service.postAjax({
    code: "check",
    url: '/check/rest/Expatriate/insert',
    data,
  })
}
export function updateExpatriate(data) {
  return service.postAjax({
    code: "check",
    url: '/check/rest/Expatriate/update',
    data,
  })
}

export function selectByIdExpatriate(data) {
  return service.postAjax({
    code: "check",
    url: '/check/rest/Expatriate/selectByid',
    data,
  })
}

export function deleteExpatriate(data) {
  return service.postAjax({
    code: "check",
    url: '/check/rest/Expatriate/delete',
    data,
  })
}