import request from "@/utils/request";
let querystring = require("querystring");

// 获取店铺列表
export const storeList = params => {
  return request({
    url: `/store/storeInfo/storeList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取发布渠道, 语言
export const toSaveStore = params => {
  return request({
    url: `/store/storeInfo/toSaveStore`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 保存新增
export const saveOrUpdateStore = params => {
  return request({
    url: `/store/storeInfo/saveOrUpdateStore`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 校验scmCode
export const checkScmCode = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeInfo/checkScmCode`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 校验店名
export const checkStoreName = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeInfo/checkStoreName`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 校验二级域名
export const checkSubdomain = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeInfo/checkSubdomain`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 查询编辑信息
export const toUpdateStore = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeInfo/toUpdateStore`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取店铺模板列表
export const getTemplateList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/getTemplateList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 设置使用模板
export const setUsingTemplate = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/setUsingTemplate`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除模板
export const delTemplate = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/delTemplate`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 模板详情
export const editDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/editDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
