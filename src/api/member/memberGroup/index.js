import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const getMemGroupList = params => {
  return request({
    url: `/basic/memGroup/getMemGroupList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
//删除会员分组
export const deleteMemGroup = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memGroup/deleteMemGroup`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
//编辑或新增
export const insertOrEditMemGroup = params => {
  return request({
    url: `/basic/memGroup/insertOrEditMemGroup`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
//检验分组名或分组等级(true可用)
export const checkNameOrLevel = params => {
  return request({
    url: `/basic/memGroup/checkNameOrLevel`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};



