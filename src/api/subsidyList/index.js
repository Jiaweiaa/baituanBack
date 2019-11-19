import request from "@/utils/request";
let querystring = require("querystring");


// 补贴金发放记录
export const getScoreLogPage = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memRelationShip/getScoreLogPage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

