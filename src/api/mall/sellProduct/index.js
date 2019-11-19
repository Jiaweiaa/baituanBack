import request from "@/utils/request";
let querystring = require("querystring");



//获取出售中的商品列表
export const saleManagement = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/saleManagement`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//商品批量下架
export const undercarriageItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/undercarriageItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//商品批量定时上架
export const groundingByTimeItem = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/groundingByTimeItem`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//批量删除商品
export const delItem = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/delItem`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
