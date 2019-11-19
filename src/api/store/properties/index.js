import request from "@/utils/request";
let querystring = require("querystring");


//获取属性集列表
export const getModulePropertySet = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/getModulePropertySet`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取详情
export const getModulePropertyByPropertySetId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/customizeModule/getModulePropertyByPropertySetId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 保存店铺模板
export const saveTemplate = params => {
  return request({
    url: `/store/customizeModule/saveTemplate`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
