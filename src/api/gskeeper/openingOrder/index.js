import request from "@/utils/request";
let querystring = require("querystring");

// 开单列表
export const billList = params => {
  return request({
    url: `/keepMem/vue/bill/billList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增开单
export const addBill = params => {
  return request({
    url: `/keepMem/vue/bill/addBill`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 审核单据
export const auditBill = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/bill/auditBill`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取修理厂详情
export const billInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/bill/billInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除单据
export const delBill = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/bill/delBill`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};



