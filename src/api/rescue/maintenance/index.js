import request from "@/utils/request";
let querystring = require("querystring");

// 批量审批
export const withdraw2WeChat = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/repair/getRepairOrderWithPage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const getRepairOrderWithPage = params => {
  return request({
    url: `/rescue/repair/getRepairOrderWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


