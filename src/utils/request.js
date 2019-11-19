import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "../store";
import { PcCookie, enums } from "@/utils";

export function refreshToken() {
  return axios({
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: `${process.env.BASE_API}/basic/auth/user/refreshToken`,
    auth: {
      username: "cloudmall-client-basic-html",
      password: "cloudmallClientSecret"
    },
    params: {
      refreshToken: store.state.user.refreshToken.refresh_token,
      accessToken: store.state.user.authToken.access_token
    }
  });
}

async function refreshMyToken() {
  let result = await refreshToken();
  if (result.data.code == "200") {
    store.commit("UPDATE_AUTHTOKEN", result.data.result);
  } else {
    store.commit("DETELE_AUTHTOKEN");
    store.commit("DETELE_USERINFO");
  }
  debugger;
  location.reload();
  // console.log(878);
  // console.log(result, 666);
}
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 40000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    //不校验token的接口白名单
    const whiteApiList = [
      `/basic/auth/admin/form`,
      `/basic/auth/mobile`,
      `/basic/auth/code/sms`,
      `/basic/auth/code/image`
    ];
    if (!whiteApiList.includes(config.url)) {
      store
        .dispatch("get_access_token")
        .then(res => {
          if (res != "") {
            config.headers.Authorization = "Bearer " + res;
          } else {
            MessageBox.confirm(
              "你的登录状态已失效，可以取消继续留在该页面，或者重新登录",
              "提示",
              {
                confirmButtonText: "重新登录",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              store
                .dispatch("LogOut")
                .then(() => {
                  PcCookie.delete({
                    key: enums.USER.AUTH_TOKEN
                  });
                  location.reload(); // 为了重新实例化vue-router对象 避免bug
                })
                .catch(err => {
                  PcCookie.delete({
                    key: enums.USER.AUTH_TOKEN
                  });
                });
            });
          }
        })
        .catch(err => {
          console.log("cuowu");
        });
    }

    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log(response.headers);
    //此标识为true的时候是需要刷新token了
    if (response.headers["renew-header"]) {
      refreshMyToken();
      //  refreshToken()
      //     .then(res => {

      //       if (res.data.code == "200") {
      //         store.commit("UPDATE_AUTHTOKEN",res.data.result);

      //       } else {
      //         store.commit("DETELE_AUTHTOKEN");
      //         store.commit("DETELE_USERINFO");
      //       }
      //       location.reload(); // 为了重新实例化vue-router对象 避免bug
      //     })
      //     .catch(err => {
      //       location.reload(); // 为了重新实例化vue-router对象 避免bug
      //     });
      // console.log(986);
    }
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    // if (res.code != "200") {
    //   Message({
    //     message: res.message,
    //     type: "error",
    //     duration: 5 * 1000
    //   });
    // }
    // console.log(response);
    if (response.data == "") {
      MessageBox.confirm(
        "你的登录状态已失效，可以取消继续留在该页面，或者重新登录",
        "提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        PcCookie.delete({
          key: enums.USER.AUTH_TOKEN
        });
        location.reload();
      });
    }

    return response.data;
  },
  error => {
    if (error.response.data.error == "invalid_token") {
      refreshMyToken();
      // refreshToken()
      //   .then(res => {
      //     if (res.data.code == "200") {
      //       store.commit("UPDATE_AUTHTOKEN", JSON.parse(res.data.result));
      //     } else {
      //       store.commit("DETELE_AUTHTOKEN");
      //       store.commit("DETELE_USERINFO");
      //     }
      //     location.reload(); // 为了重新实例化vue-router对象 避免bug
      //     //  location.reload(); // 为了重新实例化vue-router对象 避免bug
      //   })
      //   .catch(err => {
      //     location.reload(); // 为了重新实例化vue-router对象 避免bug
      //   });
    }
    // console.log(error.response.data);
    if (error.response) {
      switch (error.response.data.status) {
        case 401:
          Message({
            message: error.response.data.message,
            type: "error",
            duration: 5 * 1000
          });
          break;
        case 415:
          Message({
            message: error.response.data.message,
            type: "error",
            duration: 5 * 1000
          });
          break;
        case 500:
          Message({
            message: error.response.data.message,
            type: "error",
            duration: 5 * 1000
          });
          break;
      }
      // console.log(error.response.status);
      if (error.response.status == 401) {
        MessageBox.confirm(
          "你的登录状态已失效，可以取消继续留在该页面，或者重新登录",
          "提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          PcCookie.delete({
            key: enums.USER.AUTH_TOKEN
          });
          location.reload();
          // store
          //   .dispatch("LogOut")
          //   .then(() => {
          //     PcCookie.delete({
          //       key: enums.USER.AUTH_TOKEN
          //     });
          //     location.reload(); // 为了重新实例化vue-router对象 避免bug
          //   })
          //   .catch(err => {
          //     PcCookie.delete({
          //       key: enums.USER.AUTH_TOKEN
          //     });
          //   });
        });
      }
    } else {
      Message({
        message: "链接超时！请稍后再试！",
        type: "error",
        duration: 5 * 1000
      });
    }

    return Promise.reject(error);
  }
);

export default service;
