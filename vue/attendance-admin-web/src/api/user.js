
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


//获取菜单
export function fetchUserMenu(data) {
  return service.postAjax({
    code: "appportal",
    url: '/appportalweb/rest/Portal/getUserMenu',
    data,
  })
}

export function fetchCurrentUser(data) {
  return service.postAjax({
    code: "appportal",
    url: '/appportalweb/rest/Idsclient/getCurrentUser',
    data,
  })
}


export function login(params) {
  return service({
    url: '/user/login',
    method: 'get',
    data: params
  })
}
export function logout(params) {
  return service({
    url: '/user/logout',
    method: 'get',
    data: params
  })
}


export function getUserInfo(params) {
  return service({
    url: '/user/info/get',
    method: 'get',
    data: params
  })
}

export function getUserList(reqData) {
  return service({
    url: '/user/list/get',
    method: 'get',
    data: reqData
  })
}


