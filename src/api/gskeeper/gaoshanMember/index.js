import request from "@/utils/request";
let querystring = require("querystring");

// 列表
export const gsMemList = params => {
  return request({
    url: `/keepMem/vue/member/gsMemList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
