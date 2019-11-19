import request from "@/utils/request";
let querystring = require("querystring");

// 获取所有优惠券
export const couponList = params => {
  return request({
    url: `/trade/offer/coupon/couponList`,
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

// 保存优惠券
export const saveCoupon = params => {
  return request({
    url: `/trade/offer/coupon/saveCoupon`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 优惠券详情
export const couponDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/coupon/couponDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除优惠券
export const deleteCoupon = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/coupon/deleteCoupon`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 强制停止
export const stopCoupon = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/offer/coupon/stopCoupon`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


// 优惠券领取清单分页查询
export const achieveList = params => {
  return request({
    url: `/trade/offer/coupon/achieveList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};



// 优惠券使用清单分页查询
export const usedList = params => {
  return request({
    url: `/trade/offer/coupon/usedList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
