import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const getWithdrawalRecording = params => {
  return request({
    url: `/shop/withdraw/getWithdrawalRecording`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 通过
export const withdrawalType = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/withdraw/withdrawalType`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};


