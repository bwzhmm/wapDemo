

const user = {
  state: {
    userInfo: {
      NAME: ''
    },
  },
  getters: {
    userInfo: state => state.userInfo,
  },
  mutations: {

    SET_UserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },

  },
  actions: {

  }
}

// let data = {
//   ID: "1",
//   LOGINNAME: "admin",
//   NAME: "超级管理员"
// };

export default user;
