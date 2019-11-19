import request from "@/utils/request";
let querystring = require("querystring");

// 删除树
export const deleteOrganization = params => {
  let data = querystring.encode(params);
  return request({
    url: `/gaoshan/organization/deleteOrganization`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 树数据
export const getOrganizationTree = params => {
  return request({
    url: `/gaoshan/organization/getOrganizationTree`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新建树
export const createOrganization = params => {
  return request({
    url: `/gaoshan/organization/createOrganization`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑树
export const updateOrganization = params => {
  return request({
    url: `/gaoshan/organization/updateOrganization`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
