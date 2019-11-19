import request from "@/utils/request";
let querystring = require("querystring");

//删除
export const deleteProject = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/repairProject/deleteProject`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const page = params => {
  return request({
    url: `/rescue/repairProject/pageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑保存
export const save = params => {
  return request({
    url: `/rescue/repairProject/saveProject`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
