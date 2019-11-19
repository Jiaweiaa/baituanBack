import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const getMemListWithPage = params => {
  return request({
    url: `/basic/member/getMemListWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 禁用
export const editMemStatus = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/member/editMemStatus`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
