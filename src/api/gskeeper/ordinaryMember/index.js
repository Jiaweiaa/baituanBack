import request from "@/utils/request";
let querystring = require("querystring");

// 审核
export const auditGsMem = params => {
  return request({
    url: `/keepMem/vue/member/auditGsMem`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 获取会员列表
export const comMemList = params => {
  return request({
    url: `/keepMem/vue/member/comMemList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取会员信息
export const comMemPage = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/member/comMemPage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

