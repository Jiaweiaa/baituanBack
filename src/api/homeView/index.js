import request from "@/utils/request";
let querystring = require("querystring");

// 获取banner图
export const getIndexBanner = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getIndexBanner`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 保存banner
export const saveOrEditBanner = params => {
  return request({
    url: `/product/mallIndexBack/saveOrEditBanner`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除banner
export const deleteBanner = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/deleteBanner`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 删除分类
export const deleteIndexCategory = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/deleteIndexCategory`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 获取热销
export const getHotSaleList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getHotSaleList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 热销保存
export const saveOrUpdateHotSale = params => {
  return request({
    url: `/product/mallIndexBack/saveOrUpdateHotSale`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除热销
export const deleteHotSale = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/deleteHotSale`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取推荐
export const getRecommendedList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getRecommendedList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 推荐保存
export const saveOrUpdateRecommended = params => {
  return request({
    url: `/product/mallIndexBack/saveOrUpdateRecommended`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除推荐
export const deleteRecommended = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/deleteRecommended`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取分类
export const getIndexCategory = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getIndexCategory`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑分类
export const editIndexCategory = params => {
  return request({
    url: `/product/mallIndexBack/editIndexCategory`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取商品导航树表
export const getStoreNavigationTree = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/navigation/getStoreNavigationTree`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 根据code获取商品
export const getItemByCode = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getItemByCode`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


//   获取首页优惠券
export const getIndexCoupon = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/getIndexCoupon`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

//   新增/编辑优惠券
export const saveOrEditCoupon = params => {
  return request({
    url: `/product/mallIndexBack/saveOrEditCoupon   `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取所有店铺
export const getAllStoreList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeInfo/getAllStoreList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取优惠券
export const allAavailableCoupon = params => {
  return request({
    url: `/trade/front/coupon/allAavailableCoupon`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除优惠券
export const deleteIndexCoupon = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/deleteIndexCoupon`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑详情
export const editCouponDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/mallIndexBack/editCouponDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
