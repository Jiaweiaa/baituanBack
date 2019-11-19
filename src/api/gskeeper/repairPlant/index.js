import request from "@/utils/request";
let querystring = require("querystring");


// 获取修配厂列表
export const getGarList = params => {
  return request({
    url: `/keepMem/vue/gar/getGarList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取通知详情
export const garageInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/gar/garageInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

