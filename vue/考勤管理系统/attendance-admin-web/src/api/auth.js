import service from "@/utils/util";

 // 系统设置
export function fetchSets(data) {
  return service.postAjax({
    url: '/check/rest/Setting/get',
    data,
  })
};

export function saveSets(data) {
  return service.postAjax({
    url: '/check/rest/Setting/save',
    data,
  })
};

// 部门列表 
export function fetchOrgList(data) {
  return service.postAjax({
    url: '/check/rest/Auth/orgList',
    data,
  })
};

export function saveOrgManager(data) {
  return service.postAjax({
    url: '/check/rest/Auth/saveOrgManager',
    data,
  })
};

// 角色

export function addRole(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/save',
    data,
  })
};

// 角色列表
export function getRoleUserTree(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/getRoleUserTree',
    data,
  })
};

//角色权限
export function getRole(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/getRole',
    data,
  })
};

//保存角色权限
export function saveAuth(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/saveAuth',
    data,
  })
};

//角色用户
export function getUserRole(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/getUser',
    data,
  })
};

//保存角色用户
export function saveUserRole(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/saveUser',
    data,
  })
};

//删除角色
export function deleteRole(data) {
  return service.postAjax({
    url: '/authweb/rest/Role/deleteRole',
    data,
  })
};

