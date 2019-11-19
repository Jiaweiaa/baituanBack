import request from "@/utils/request";
let querystring = require("querystring");

//删除
export const deleteKeyword = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/rescueEvaluateKeyword/deleteKeyword`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const getEvaluateKeyword = params => {
  return request({
    url: `/rescue/rescueEvaluateKeyword/getEvaluateKeyword`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑保存
export const saveOrEditKeyword = params => {
  return request({
    url: `/rescue/rescueEvaluateKeyword/saveOrEditKeyword`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
