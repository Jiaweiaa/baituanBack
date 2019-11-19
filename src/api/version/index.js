import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const pageQuery = params => {
  return request({
    url: `/rescue/version/pageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
