import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: window.sessionStorage.getItem("userInfo"),
    isLogin: window.sessionStorage.getItem("isLogin"),
    count: 0
  },
  getters: {
    // 获取用户的信息以及是否登录
    getUserInfo(state) {
      return {
        userInfo: state.userInfo,
        isLogin: state.isLogin
      };
    },
    // 获取购物车数量
    getCount(state) {
      return state.count;
    }
  },
  mutations: {
    // 向sessionStorage里储存用户信息
    setUserInfo(state, data) {
      if (data.isLogin === 1) {
        let obj = {
          userId: data.data.id,
          userName: data.data.userName
        };
        state.isLogin = "true";
        state.userInfo = JSON.stringify(obj);
        window.sessionStorage.setItem("isLogin", true);
        window.sessionStorage.setItem("userInfo", JSON.stringify(obj));
      }
    },
    // 向sessionStorage里删除用户信息
    deleteUserInfo(state) {
      state.isLogin = false;
      window.sessionStorage.setItem("userInfo", null);
      window.sessionStorage.setItem("isLogin", false);
    },
    // 获取购物车商品总数
    setCount(state, data) {
      state.count = data;
    },
    // 增加购物车数量
    addCount(state) {
      state.count++;
    }
  },
  actions: {}
});
