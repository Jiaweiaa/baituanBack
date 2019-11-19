import request from "@/utils/request";
let querystring = require("querystring");

// 获取店铺信息
export const editStoreInfo = params => {
  return request({
    url: `/store/storeInfo/editStoreInfo`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 更新店铺信息
export const updateStoreInfo = params => {
  return request({
    url: `/store/storeInfo/updateStoreInfo`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取菜单树
export const getMenuTreeByRoleId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/role/getMenuTreeByRoleId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取店铺配置
export const getStoreConfigInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeConfig/getStoreConfigInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 更新店铺配置
export const editStoreConfig = params => {
  return request({
    url: `/store/storeConfig/editStoreConfig`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
