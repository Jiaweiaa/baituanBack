/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-12 16:57:30
 * @LastEditTime: 2019-10-12 16:57:30
 * @LastEditors: your name
 */
import request from "@/utils/request";
let querystring = require("querystring");



//获取仓库中的商品列表
export const repertoryManagem = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/repertoryManagement`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//复制商品
export const copyPlatformStoreProduct = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/copyPlatformStoreProduct`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//商品批量上架
export const groundingItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/groundingItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//商品定时上架
export const groundingByTimeItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/groundingByTimeItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//批量删除商品
export const delItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/delItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
