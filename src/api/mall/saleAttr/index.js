import request from "@/utils/request";
let querystring = require("querystring");


//列表接口
export const propertyListData = params => {
  return request({
    url: `/product/property/propertyListData`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 新增
export const saveProperty = params => {
  return request({
    url: `/product/property/saveProperty`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//校验属性名
export const checkPropertyName = params => {
  return request({
    url: `/product/property/checkPropertyName`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//校验属性名称可见值
export const checkPropertyDisplayName = params => {
  return request({
    url: `/product/property/checkPropertyDisplayName`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//查看属性值
export const propertyValuesListData = params => {
  let data = querystring.encode(params)
  return request({
    url: `/product/property/propertyValuesListData`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//下拉框接口
export const groupNameListData = params => {
  return request({
    url: `/product/property/groupNameListData`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//删除 
export const delProperty = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/delProperty`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//编辑
export const updateProperty = params => {
  return request({
    url: `/product/property/updateProperty`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
