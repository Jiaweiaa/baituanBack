import request from "@/utils/request";
let querystring = require("querystring");


export const groupBuyList = params => {
  return request({
    url: `/trade/offer/groupBuy/groupBuyList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取所有渠道列表
export const channelList = params => {
  return request({
    url: `/trade/offer/coupon/channelList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 通过商品编码获取商品信息
export const findProductByCodes = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/api/product/findProductByCodes`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


// 保存-限时优惠
export const saveGroupBuy = params => {
  return request({
    url: `/trade/offer/groupBuy/saveGroupBuy`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除-限时优惠
export const deleteGroupBuy = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/groupBuy/deleteGroupBuy`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};



// 通过商品编码获取商品信息
export const groupBuyDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/groupBuy/groupBuyDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取一季
export const groupList = params => {
  return request({
    url: `/trade/offer/groupBuy/groupList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 通过商品编码获取商品信息
export const groupDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/groupBuy/groupDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 保存第一页修改
export const saveGroup = params => {
  return request({
    url: `/trade/offer/groupBuy/saveGroup`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除-限时优惠一级
export const deleteGroup = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/groupBuy/deleteGroup`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

