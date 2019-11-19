import request from "@/utils/request";
let querystring = require("querystring");

//删除
export const deleteVehicle = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/repairVehicle/deleteVehicle`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 分页列表
export const pageQuery = params => {
  return request({
    url: `/rescue/repairVehicle/pageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑保存
export const saveVehicle = params => {
  return request({
    url: `/rescue/repairVehicle/saveVehicle`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
