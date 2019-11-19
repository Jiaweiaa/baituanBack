import request from "@/utils/request";
let querystring = require("querystring");

// 检测唯一性(检测哪个传哪个)
export const checkAttributes = params => {
  return request({
    url: `/product/filterOption/checkAttributes`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除筛选项
export const deleteFilterOption = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/filterOption/deleteFilterOption`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


// 获取全部店铺渠道信息
export const getAllStoreChannel = params => {
  return request({
    url: `/product/filterOption/getAllStoreChannel`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取筛选项列表
export const getFilterOptionList = params => {
  return request({
    url: `/product/filterOption/getFilterOptionList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取销售属性&功能属性 集合
export const getPropertyList = params => {
  return request({
    url: `/product/filterOption/getPropertyList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 根据属性id获取属性值list
export const getPropertyValueList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/filterOption/getPropertyValueList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


// 获取排序
export const getSortNo = params => {
  return request({
    url: `/product/filterOption/getSortNo`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 添加筛选项值
export const insertFilterOptionValue = params => {
  return request({
    url: `/product/filterOption/insertFilterOptionValue`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 新增/编辑 筛选项
export const insertOrEditFilterOption = params => {
  return request({
    url: `/product/filterOption/insertOrEditFilterOption`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取编辑详情
export const getEditFilterOption = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/filterOption/getEditFilterOption`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
