import request from "@/utils/request";
let querystring = require("querystring");
// 新增或修改属性值时获取必要数据
export const toSaveOrUpdate = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/toSaveOrUpdate`,
    method: "post",
    data: data,
    headers: {
       "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

//列表接口
export const propertyValuesListData = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/propertyValuesListData`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
// 新增
export const saveOrUpdatePropertyValue = params => {
  return request({
    url: `/product/property/saveOrUpdatePropertyValue`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//校验属性值
export const checkPropertyValueValue = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/checkPropertyValueValue`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//校验属性值可见值
export const checkPropertyValueDisplayValue = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/checkPropertyValueDisplayValue`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//校验属性值排序号
export const checkPropertyValueSort = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/checkPropertyValueSort`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

//删除 
export const delPropertyValue = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/delPropertyValue`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
