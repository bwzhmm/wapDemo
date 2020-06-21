import request from '@/utils/axios'

import service from "@/utils/util";

 // 离职管理 
export function fetchResignList(data) {
  return service.postAjax({
    url: '/check/rest/Resignation/list',
    data,
  })
}

export function addResign(data) {
  return service.postAjax({
    url: '/check/rest/Resignation/insert',
    data,
  })
};

 // 员工管理 
export function fetchUserList(data) {
  return service.postAjax({
    url: '/check/rest/User/list',
    data,
  })
};

export function fetchUserById(data) {
  return service.postAjax({
    url: '/check/rest/User/selectByid',
    data,
  })
};

export function updateUser(data) {
  return service.postAjax({
    url: '/check/rest/User/update',
    data,
  })
};

// 密码
export function editPassword(data) {
  return service.postAjax({
    url: '/check/rest/User/changePWD',
    data,
  })
};

export function resetPassword(data) {
  return service.postAjax({
    url: '/check/rest/User/resetPWD',
    data,
  })
};




export function login(params) {
  return request({
    url: '/user/login',
    method: 'get',
    data:params
  })
}
export function logout(params) {
  return request({
    url: '/user/logout',
    method: 'get',
    data:params
  })
}


export function getUserInfo(params) {
  return request({
    url: '/user/info/get',
    method: 'get',
    data:params
  })
}

export function getUserList(reqData) {
  return request({
    url:'/user/list/get',
    method: 'get',
    data: reqData
  })
}


