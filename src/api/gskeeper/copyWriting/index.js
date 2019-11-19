import request from "@/utils/request";
let querystring = require("querystring");

// 文案列表
export const list = params => {
  return request({
    url: `/keepMem/doc/docList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 查看编辑详情
export const goUpdate = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/doc/docUpdatePage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑保存
export const doUpdate = params => {
  return request({
    url: `/keepMem/doc/docUpdate`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增保存
export const doAdd = params => {
  return request({
    url: `/keepMem/doc/addDoc`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除通知
export const doDel = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/doc/delDoc`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

