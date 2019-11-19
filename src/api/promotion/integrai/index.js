import request from "@/utils/request";
let querystring = require("querystring");

// 积分活动列表
export const activeList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/scoreBack/activeList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 积分活动列表
export const codeList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/scoreBack/codeList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 保存积分活动
export const saveActive = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/scoreBack/saveActive`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 改变状态
export const EnableOrDisableCode = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/scoreBack/EnableOrDisableCode`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
