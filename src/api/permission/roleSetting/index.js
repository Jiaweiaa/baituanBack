import request from "@/utils/request";
let querystring = require("querystring");

// 获取树状列表
export const getMenuList = params => {
  return request({
    url: `/basic/menu/getMenuList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 新增菜单
export const saveMenu = params => {
  return request({
    url: `/basic/menu/saveMenu`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 删除菜单
export const deleteMenuById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/menu/deleteMenuById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 编辑菜单
export const editMenu = params => {
  return request({
    url: `/basic/menu/editMenu`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 检测菜单编码是否已存在
export const checkMenuCode = params => {
  return request({
    url: `/basic/menu/checkMenuCode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//检测菜单名称唯一性
export const checkMenuName = params => {
  return request({
    url: `/basic/menu/checkMenuName`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 检测菜单url唯一性
export const checkMenuUrl = params => {
  return request({
    url: `/basic/menu/checkMenuUrl`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 查询菜单下权限
export const getActionUnderMenu = params => {
  return request({
    url: `/basic/action/getActionUnderMenu`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
