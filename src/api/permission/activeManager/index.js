import request from "@/utils/request";
let querystring = require("querystring");

// 查询菜单下权限
export const getActionUnderMenu = params => {
  return request({
    url: `/basic/action/getActionUnderMenu`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 新增权限
export const saveAction = params => {
  return request({
    url: `/basic/action/saveAction`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 删除权限
export const deleteActionById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/action/deleteActionById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 检测权限编码是否已存在
export const checkActionCode = params => {
  return request({
    url: `/basic/action/checkActionCode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 检测权限URL唯一性
export const checkActionUrl = params => {
  return request({
    url: `/basic/action/checkActionUrl`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
