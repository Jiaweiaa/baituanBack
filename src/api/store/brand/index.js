import request from "@/utils/request";
let querystring = require("querystring");

// 获取品牌列表
export const queryStoreBrandList = params => {
  return request({
    url: `/store/brand/queryStoreBrandList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增/修改门店
export const insertOrEditBrand = params => {
  return request({
    url: `/store/brand/insertOrEditBrand`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 更改品牌开关
export const updateBrandStatus = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/brand/updateBrandStatus`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除品牌
export const deleteBrand = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/brand/deleteBrand`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};



