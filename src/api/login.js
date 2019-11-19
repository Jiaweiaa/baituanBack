import request from "@/utils/request";
import { PcCookie, enums } from "@/utils";
import store from '@/store/';
let querystring = require("querystring");
let deviceId = new Date().getTime();

// 登陆
export const login = params => {
  let paramsData = querystring.encode(params);
  return request({
    url: "/basic/auth/admin/form",
    method: "post",
    data: paramsData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      deviceId
    },
    auth: {
      username: "cloudmall-client-basic-html",
      password: "cloudmallClientSecret"
    }
  });
};

// 短信验证码登陆
export const mobile = params => {
  let data = querystring.encode(params);
  return request({
    url: "/basic/auth//mobile",
    method: "post",
    headers: {
      deviceId,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
      username: "cloudmall-client-basic-auth",
      password: "cloudmallClientSecret"
    },
    data: data
  });
};

// 修改密码
export const modifyUserPwd = params => {
  let data = querystring.encode(params);
  return request({
    url: "/basic/user/modifyUserPwd",
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    data: params
  });
};

// 获取菜单
export const loginAfter = params => {
  let data = {
    applicationId:1
  }
  data = querystring.encode(data);
  return request({
    url: "/basic/user/loginAfter",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
};
// 图片验证码
export const getImg = params => {
  return request({
      url: "/basic/auth/code/image",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      deviceId
    }
  });
  localStorage.setItem('time',new Date().getTime());
};

// 登出功能
export const logout = params => {
  const token = JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)).access_token
  return request({
    url: "/basic/user/logout",
    method: "post",
    data: {
      accessToken:token
    }
  })
};

// 获取短信验证码
export const sms = params => {
  let data = querystring.encode(params);
  return request({
    url: "/basic/auth/code/sms",
    method: "post",
    headers: {
      deviceId,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
};

// 获取登陆权限
export const getUserActionAfterLogin = params => {
  let data = querystring.encode(params);
  return request({
    url: "/basic/user/getUserActionAfterLogin",
    method: "post",
    headers: {
      deviceId,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
};
//Token续租
export const refreshToken = params => {
  let data = querystring.encode({
      refreshToken: store.getters.getRefreshToken,
      accessToken: store.getters.getAccessToken
    });
  return request({
    url: "/basic/auth/user/refreshToken",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
      username: "cloudmall-client-basic-auth",
      password: "cloudmallClientSecret"
    },
    data: data
  });
};

