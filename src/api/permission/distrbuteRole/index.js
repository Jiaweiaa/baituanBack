import request from "@/utils/request";
let querystring = require("querystring");

// 列表页
export const getBindUser = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/role/getBindUser`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

