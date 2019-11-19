import { login, logout, getInfo ,mobile} from "@/api/login";
import { PcCookie, enums } from "@/utils";
import store from "../../store/";
import axios from "axios";
export function refreshToken() {
  return axios({
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: `${process.env.BASE_API}/basic/auth/user/refreshToken`,
    auth: {
      username: "cloudmall-client-basic-auth",
      password: "cloudmallClientSecret"
    },
    params: {
      refreshToken: store.state.user.refreshToken.refresh_token,
      accessToken: store.state.user.authToken.access_token
    }
  });
}

const user = {
  state: {
    loginName: "", //登录用户名
    rememberMe: false,
    menuList: [], //菜单列表
    authToken: {
      access_token: "", //token
      expires_in: "", //有效期
      timestamp: "" //时间戳
    },
    refreshToken: {
      refresh_token: ""
    },
    permissionBtns: []
  },
  getters: {},
  mutations: {
    // 获取权限
    GET_PERMISSION(state, result) {
      state.permissionBtns = result;
    },
    //更新接口时间戳
    UPDATE_TIMESTAMP(state,timestamp){
      state.authToken.timestamp = timestamp;
      // console.log('时间戳已更新');
      // console.log(state.authToken);
    },
    //更新Token
    UPDATE_AUTHTOKEN(state, authToken) {
      const updateToken = Object.assign({}, authToken);
      delete updateToken["scope"];
      delete updateToken["jti"];
      delete updateToken["token_type"];
      delete updateToken["refresh_token"];
      delete updateToken["loginName"];
      // console.log(updateToken.access_token,888);
      state.authToken = updateToken;
      // console.log(state.authToken);
      state.refreshToken.refresh_token = authToken.refresh_token;
      PcCookie.set({
        key: enums.USER.AUTH_TOKEN,
        value: updateToken
      });
      PcCookie.set({
        key: enums.USER.REFRESH_TOKEN,
        value: user.state.refreshToken
      });
      // console.info("token:", authToken);
    },
    //删除TOKEN
    DETELE_AUTHTOKEN(state) {
      state.authToken = {};
      PcCookie.delete({
        key: enums.USER.AUTH_TOKEN
      });
    },
    // 删除用户信息
    DETELE_USERINFO(state) {
      state.loginName = "";
      PcCookie.delete({
        key: enums.USER.LOGIN_NAME
      });
    },
    //删除续租TOKEN
    DETELE_REFRESHTOKEN(state) {
      state.refreshToken.refresh_token = "";
      PcCookie.delete({
        key: enums.USER.AUTH_TOKEN
      });
    }
  },

  actions: {
    // 获取按钮级权限
    getPermission({ commit }, view) {
      commit("GET_PERMISSION", view);
    },
    //获取token
    get_access_token({ commit }) {
      return new Promise((resolve, reject) => {
        //如果不存在authToken或者token值为空,去cookie中查找是否有token值 有则将值存在vuex中
        if (!user.state.authToken || user.state.authToken.access_token === "") {

          if (PcCookie.get(enums.USER.AUTH_TOKEN)) {
            user.state.authToken = JSON.parse(
              PcCookie.get(enums.USER.AUTH_TOKEN)
            );
          } else {
            alert("cookie值被清除了");
          }
        }

        // 如果存在authToken并且token值不为空,判断是否过期需要续租
        // if (user.state.authToken) {
        //   let timestamp = user.state.authToken.timestamp; //登录时获取到的时间戳
        //   let expires_in = user.state.authToken.expires_in*1000 //过期时间
        //   let differTime = new Date().getTime() - timestamp; //此时距登录时过了多久
        //   if(differTime<1/2*expires_in){
        //       let newTimestamp = new Date().getTime();

        //       commit("UPDATE_TIMESTAMP",newTimestamp);
        //       // console.log(user.state.authToken);

        //   }
        //   //如果differTime大于过期时间的一半并小于过期时间 则续租
        //   if ( 1/2*expires_in < differTime && differTime < expires_in) {
        //     refreshToken().then(res => {
        //       if (res.data.code === 200) {
        //         commit("UPDATE_AUTHTOKEN", JSON.parse(res.data.result));
        //       } else {
        //         commit("DETELE_AUTHTOKEN");
        //         commit("DETELE_USERINFO");
        //       }
        //     });
        //   }
        // }
        resolve(user.state.authToken.access_token);
      });
    },

    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            if (response && response.code == "200") {
              const source = response.result;
              const authToken = Object.assign({}, source);
              //cookie,状态管理中记录token,过期时间,时间戳
              commit("UPDATE_AUTHTOKEN", authToken);
              user.state.loginName = source.loginName;
              PcCookie.set({
                key: enums.USER.LOGIN_NAME,
                value: user.state.loginName
              });
            }
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },

    mobileLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        mobile(userInfo)
          .then(response => {
            if (response && response.code == "200") {
              const source = response.result;
              const authToken = Object.assign({}, source);
              delete authToken["jti"];
              delete authToken["token_type"];
              delete authToken["refresh_token"];
              delete authToken["scope"];
              delete authToken["loginName"];
              //cookie,状态管理中记录token,过期时间,时间戳
              commit("UPDATE_AUTHTOKEN", authToken);
              user.state.loginName = source.loginName;
              PcCookie.set({
                key: enums.USER.LOGIN_NAME,
                value: user.state.loginName
              });
            }
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit("DETELE_AUTHTOKEN");
            commit("DETELE_USERINFO");
            location.reload(); // 为了重新实例化vue-router对象 避免bug
            resolve();
          })
          .catch(error => {
            commit("DETELE_AUTHTOKEN");
            commit("DETELE_USERINFO");
            reject(error);
          });
      });
    }
  }
};

export default user;
