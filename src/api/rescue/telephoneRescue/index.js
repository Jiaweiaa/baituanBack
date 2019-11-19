import request from "@/utils/request";
let querystring = require("querystring");

// 查询修配厂
export const getMobileOrderByMobile = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/rescueOrder/getMobileOrderByMobile`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 修配厂列表
export const nearAllGarage = params => {
  return request({
    url: `/rescue/garage/nearAllGaragePageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 派遣
export const assignMobileOrder = params => {
  return request({
    url: `/rescue/rescueOrder/assignMobileOrder`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 获取所有修配厂
export const findAllGarage = params => {
  return request({
    url: `/rescue/garage/findAllGarage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取分页
export const get400OnlineOrder = params => {
  return request({
    url: `/rescue/rescueOrder/get400OnlineOrder`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
