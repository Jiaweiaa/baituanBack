import request from "@/utils/request";
let querystring = require("querystring");

// 发送优惠券-优惠券发送详情
export const sendDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/coupon/send/sendDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 发送优惠券-发送优惠券分页列表
export const sendList = params => {
  return request({
    url: `/trade/offer/coupon/send/sendList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 发送优惠券-会员分组信息
export const memberGroupList = params => {
  return request({
    url: `/trade/offer/coupon/send/memberGroupList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 可选优惠券
export const availableCoupon = params => {
  return request({
    url: `/trade/offer/coupon/send/availableCoupon`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 发送优惠券-会员筛选
export const memberList = params => {
  return request({
    url: `/trade/offer/coupon/send/memberList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 发送优惠券-发送
export const doSendCoupon = params => {
  return request({
    url: `/trade/offer/coupon/send/doSendCoupon`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


