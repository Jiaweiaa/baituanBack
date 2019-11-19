import request from "@/utils/request";
let querystring = require("querystring");

// 获取文章列表
export const getNewsPage = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/news/getNewsPage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
//删除文章
export const removeNewsById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/news/removeNewsById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 修改文章详情
export const updateNewsById = params => {
  return request({
    url: `/shop/news/updateNewsById`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
// 新增文章
export const createNews = params => {
  return request({
    url: `/shop/news/createNews`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
//获取新闻详情
export const getNewsById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/news/getNewsById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
