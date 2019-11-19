import request from "@/utils/request";
let querystring = require("querystring");

// 佣金列表
export const getCommissionRecordPage = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/getCommissionRecordPage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 团长下拉列表
export const getCaptainNamePage = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/getCaptainNamePage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
