import request from "@/utils/request";
let querystring = require("querystring");

// 意见反馈列表
export const feedbackList = params => {
  return request({
    url: `/keepMem/common/feedbackList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
