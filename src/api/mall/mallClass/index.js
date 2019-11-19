import request from "@/utils/request";
let querystring = require("querystring");


//获取树表数据
export const getCategoryTreeData = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/category/getCategoryTreeData`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//根据id查询该分类全部数据
export const findPropertysetByCategoryId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/category/findPropertysetByCategoryId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
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
export const deleteCategory = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/category/deleteCategory`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//平级移动
export const categoryMove = params => {
  return request({
    url: `/product/category/categoryMove`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//升级
export const categoryAdjustGradeUp = params => {
  return request({
    url: `/product/category/categoryAdjustGradeUp`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 降级
export const categoryAdjustGradeDown = params => {
  return request({
    url: `/product/category/categoryAdjustGradeDown`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//获取商品分类所关联的属性集
export const findCategoryById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/product/category/findCategoryById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
//通过分类绑定属性集
export const relateCategoryAndPropertyset = params => {
  return request({
    url: `/product/category/relateCategoryAndPropertyset`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};