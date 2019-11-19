import request from "@/utils/request";
let querystring = require("querystring");

//删除
export const delRescueRepairWarranty  = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/repair/delRescueRepairWarranty`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const getRescueRepairWarranty = params => {
  return request({
    url: `/rescue/repair/getRescueRepairWarranty`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增/编辑保存
export const saveOrEditRepairWarranty = params => {
  return request({
    url: `/rescue/repair/saveOrEditRepairWarranty`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
