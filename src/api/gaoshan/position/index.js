import request from "@/utils/request";
let querystring = require("querystring");

// 通过orgId 获取机构下职务列表
export const getPositionWithPage = params => {
  return request({
    url: `/gaoshan/gsPosition/getPositionWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增/编辑 职务
export const saveOrEditPosition = params => {
  return request({
    url: `/gaoshan/gsPosition/saveOrEditPosition`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 职务删除
export const deletePosition = params => {
  let data = querystring.encode(params);
  return request({
    url: `/gaoshan/gsPosition/deletePosition`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
