import request from "@/utils/request";
let querystring = require("querystring");

//删除
export const delCancelKeyword = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/cancelKeyword/delCancelKeyword`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const getCancelKeyword = params => {
  return request({
    url: `/rescue/cancelKeyword/getCancelKeyword`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑保存
export const saveOrEditCancelKeyword = params => {
  return request({
    url: `/rescue/cancelKeyword/saveOrEditCancelKeyword`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
