import request from "@/utils/request";
let querystring = require("querystring");

// 获取图片列表
export const queryImagePage = params => {
  return request({
    url: `/store/storeImage/queryImagePage `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

//新增或修改图片
export const saveOrEditStoreImage = params => {
  return request({
    url: `/store/storeImage/saveOrEditStoreImage `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//删除图片
export const deleteImageById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeImage/deleteImageById `,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//获取图片分组列表
export const getImgGroupList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/store/storeImage/getImgGroupList `,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

//删除图片分组
export const deleteImgGroup = params => {
  return request({
    url: `/store/storeImage/deleteImgGroup `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//新增或编辑图片分组
export const insertOrEditImageGroup = params => {
  return request({
    url: `/store/storeImage/insertOrEditImageGroup `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};