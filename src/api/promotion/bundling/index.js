import request from "@/utils/request";
let querystring = require("querystring");



// 列表分页查询-捆绑销售
export const bundleList = params => {
  return request({
    url: `/product/bundle/bundleList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};




// 自动生成捆绑销售编码-捆绑销售
export const getKbcode = params => {
  return request({
    url: `/product/bundle/getKbcode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 通过商品编码获取商品信息
export const validateBundleCode = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/bundle/validateBundleCode`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 保存-捆绑销售
export const saveBundle = params => {
  return request({
    url: `/product/bundle/saveBundle`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 详情查询-捆绑销售
export const bundleDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/bundle/bundleDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除-捆绑销售
export const deleteBundle = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/bundle/deleteBundle`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 强制停止-捆绑销售
export const stopBundle = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/bundle/stopBundle`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
