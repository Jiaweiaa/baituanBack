import request from "@/utils/request";
let querystring = require("querystring");

// 通过标题分页查询列表
export const addBanner = params => {
  return request({
    url: `/keepMem/vue/banner/addBanner`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 批量停用/启用轮播图片
export const changeBannersStatus = params => {
  return request({
    url: `/keepMem/vue/banner/changeBannersStatus`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 轮播详情
export const findBannerInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/banner/findBannerInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 通过标题分页查询列表
export const findBannerList = params => {
  return request({
    url: `/keepMem/vue/banner/findBannerList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 更新轮播图片
export const updateBanner = params => {
  return request({
    url: `/keepMem/vue/banner/updateBanner`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
