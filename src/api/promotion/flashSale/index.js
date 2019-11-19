import request from "@/utils/request";
let querystring = require("querystring");

// 获取所有优惠券
export const limitDiscountList = params => {
  return request({
    url: `/trade/offer/limit/limitDiscountList`,
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

// // 通过商品编码获取商品信息
// export const findProductByCodes = params => {
//   return request({
//     url: `/trade/offer/limit/findProductByCodes`,
//     method: "post",
//     data: params,
//     headers: {
//       "Content-Type": "application/json"
//     },
//   });
// };

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
export const saveLimitDiscount = params => {
  return request({
    url: `/trade/offer/limit/saveLimitDiscount`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除-限时优惠
export const deleteLimitDiscount = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/limit/deleteLimitDiscount`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 强制停止-限时优惠
export const stopLimitDiscount = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/limit/stopLimitDiscount`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 通过商品编码获取商品信息
export const saleDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/limit/saleDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
