import request from "@/utils/request";
let querystring = require("querystring");


//获取属性集列表
export const getPropertySetList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/getPropertySetList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//检查商品标题唯一性

export const checkItemTitle = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/itemCheck/checkItemTitle`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//检查商品编码唯一性
export const checkItemCode = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/itemCheck/checkItemCode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//检查SKU表格中UPC唯一性
export const checkExtentionCode = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/itemCheck/checkExtentionCode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//创建商品 准备数据
export const toCreateItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/toCreateItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
export const readyCreateItemData = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/readyCreateItemData`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//画SKU表格
export const drawSkuTable = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/drawSkuTable`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//创建或修改商品

export const createOrUpdateItem = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/createOrUpdateItem`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//编辑商品
export const editItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/editItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//获取创建中的商品列表
export const creatingManagement = params => {
  // let data = querystring.encode(params);
  return request({
    url: `/product/item/creatingManagement`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//商品批量入库
export const depotItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/depotItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
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
//商品定时上架
export const timingObtainedItem = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/item/timingObtainedItem`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
