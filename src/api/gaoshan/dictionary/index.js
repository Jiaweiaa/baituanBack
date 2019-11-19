import request from "@/utils/request";
let querystring = require("querystring");

// 数据字典删除
export const deleteDic = params => {
  let data = querystring.encode(params);
  return request({
    url: `/gaoshan/gsDic/deleteDic`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 数据字典删除
export const deleteDicInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/gaoshan/gsDic/deleteDicInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 数据字典详情分页查询
export const infoPageQuery = params => {
  return request({
    url: `/gaoshan/gsDic/infoPageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 数据字典分页查询
export const pageQuery = params => {
  return request({
    url: `/gaoshan/gsDic/pageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 数据字典详情保存
export const saveDicInfo = params => {
  return request({
    url: `/gaoshan/gsDic/saveDicInfo`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 数据字典保存（新增/编辑）
export const saveDic = params => {
  return request({
    url: `/gaoshan/gsDic/saveDic`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


