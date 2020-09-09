

const menu = {
  state: {

    allmenus: [],
    submenus: []

  },
  getters: {
    allmenus: state => state.allmenus,
    submenus: state => state.submenus,
  },
  mutations: {

    SET_AllMenus: (state, allmenus) => {
      state.allmenus = allmenus
    },
    SET_SubMenus: (state, submenus) => {
      state.submenus = submenus
    }
  },
  actions: {

  }
}
// allmenus: [{ "children": [{ "LEVELCODE": "001001", "PID": "100", "DISPLAYURL": "home", "ID": "100100", "text": "个人中心", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "个人中心" }], "LEVELCODE": "001", "ID": "100", "text": "home", "ISLEAF": "0", "NAME": "home" }, { "children": [{ "LEVELCODE": "002001", "PID": "200", "DISPLAYURL": "abnormalTable", "ID": "200100", "text": "异常申请", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "异常申请" }, { "LEVELCODE": "002002", "PID": "200", "DISPLAYURL": "overtimeTable", "ID": "200200", "text": "加班申请", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "加班申请" }, { "LEVELCODE": "002003", "PID": "200", "DISPLAYURL": "leaveTable", "ID": "200300", "text": "请假调休", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "请假调休" }, { "LEVELCODE": "002004", "PID": "200", "DISPLAYURL": "performanceTable", "ID": "200400", "text": "绩效考核", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "绩效考核" }], "LEVELCODE": "002", "ID": "200", "text": "approve", "ISLEAF": "0", "NAME": "approve" }, { "children": [{ "LEVELCODE": "003001", "PID": "300", "DISPLAYURL": "staffManageTable", "ID": "300100", "text": "员工管理", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "员工管理" }, { "LEVELCODE": "003002", "PID": "300", "DISPLAYURL": "staffCareTable", "ID": "300200", "text": "员工关怀", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "员工关怀" }, { "LEVELCODE": "003003", "PID": "300", "DISPLAYURL": "quitManageTable", "ID": "300300", "text": "离职管理", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "离职管理" }], "LEVELCODE": "003", "ID": "300", "text": "employee", "ISLEAF": "0", "NAME": "employee" }, { "children": [{ "LEVELCODE": "004001", "PID": "400", "DISPLAYURL": "monthReport", "ID": "400100", "text": "月度报表", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "月度报表" }, { "LEVELCODE": "004002", "PID": "400", "DISPLAYURL": "annualReport", "ID": "400200", "text": "年度绩效", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "年度绩效" }], "LEVELCODE": "004", "ID": "400", "text": "report", "ISLEAF": "0", "NAME": "report" }, { "children": [{ "LEVELCODE": "005001", "PID": "500", "DISPLAYURL": "editPassword", "ID": "500100", "text": "重置密码", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "重置密码" }, { "LEVELCODE": "005002", "PID": "500", "DISPLAYURL": "accountManage", "ID": "500200", "text": "账号管理", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "账号管理" }, { "LEVELCODE": "005003", "PID": "500", "DISPLAYURL": "systemSet", "ID": "500300", "text": "系统设置", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "系统设置" }, { "LEVELCODE": "005004", "PID": "500", "DISPLAYURL": "authManage", "ID": "500400", "text": "权限管理", "leaf": true, "URL": "", "ISLEAF": "1", "NAME": "权限管理" }], "LEVELCODE": "005", "ID": "500", "text": "set", "ISLEAF": "0", "NAME": "set" }],
// submenus: ["home", "abnormalTable", "overtimeTable"]

export default menu;
