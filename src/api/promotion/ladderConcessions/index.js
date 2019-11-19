import request from "@/utils/request";
let querystring = require("querystring");

// 列表分页查询-捆绑销售
export const offerTierList = params => {
  return request({
    url: `/trade/offer/offerTierList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 保存-捆绑销售
export const saveOfferTier = params => {
  return request({
    url: `/trade/offer/saveOfferTier`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 阶梯优惠详情
export const offerTierDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/offerTierDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 阶梯优惠删除
export const deleteOfferTier = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/deleteOfferTier`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 强制停止
export const stopOffer = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/stopOffer`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
