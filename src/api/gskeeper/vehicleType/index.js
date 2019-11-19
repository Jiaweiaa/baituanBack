import request from "@/utils/request";
let querystring = require("querystring");


// 获取数据列表
export const getVehicleTypeTree = params => {
  return request({
    url: `/keepMem/vue/vehicle/getVehicleTypeTree`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 新增车辆类型
export const addVehicleType = params => {
  return request({
    url: `/keepMem/vue/vehicle/addVehicleType`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑车辆类型
export const updateVehicleType = params => {
  return request({
    url: `/keepMem/vue/vehicle/updateVehicleType`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 车辆类型详情
export const getVehicleTypeDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/vehicle/getVehicleTypeDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除车辆类型
export const delVehicleType = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/vehicle/delVehicleType`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
