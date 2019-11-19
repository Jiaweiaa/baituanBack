import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const propertySetList = params => {
  return request({
    url: `/product/property/propertySetList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
//新增或修改属性集
export const createOrUpdatePropertySet = params => {
  return request({
    url: `/product/property/createOrUpdatePropertySet`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
//获取属性集的详情
export const toPropertySetEdit = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/toPropertySetEdit`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
//删除属性集
export const delPropertySet = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/property/delPropertySet`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};


