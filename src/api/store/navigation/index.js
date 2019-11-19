import request from "@/utils/request";
let querystring = require("querystring");


//获取树表数据
export const getStoreNavigationTree = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/navigation/getStoreNavigationTree`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//编辑分类
export const updateCategory = params => {
  return request({
    url: `/product/category/updateCategory`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//插入同级分类
export const saveSiblingCategory = params => {
  return request({
    url: `/product/category/saveSiblingCategory`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//插入子分类
export const saveSubCategory = params => {
  return request({
    url: `/product/category/saveSubCategory`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//删除分类
export const deleteNavigationById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/navigation/deleteNavigationById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//平级移动
export const moveNavigation = params => {
  return request({
    url: `/store/navigation/moveNavigation`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//升级
export const navigationAdjustGradeUp = params => {
  return request({
    url: `/store/navigation/navigationAdjustGradeUp`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 降级
export const navigationAdjustGradeDown = params => {
  return request({
    url: `/store/navigation/navigationAdjustGradeDown`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//编辑及新增
export const insertOrEditStoreNavigation = params => {
  return request({
    url: `/store/navigation/insertOrEditStoreNavigation`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
