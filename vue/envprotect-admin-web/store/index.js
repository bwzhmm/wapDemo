import Vue from "vue";
import Vuex from "vuex";
import "babel-polyfill"
import { service } from "@env/utils/request.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: "",                // 用户信息
    userId: "", // 用户id
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, res) {
      state.userInfo = res;
      state.userId = res.ID;
    },
  },
  actions: {
    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        let path = "authweb.AU_USER.CURRUSER";
        service({}, path).then(res => {
          if (res.success) {
            commit("setUserInfo", res.data);
          }
        });
      })
    },
  }
})
