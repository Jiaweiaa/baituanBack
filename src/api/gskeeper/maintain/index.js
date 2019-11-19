import request from "@/utils/request";
let querystring = require("querystring");


// 获取数据列表
export const selectVehicleTypeUpKeep = params => {
  return request({
    url: `/keepMem/vue/vehicle/selectVehicleTypeUpKeep`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增保养
export const addVehicleTypeUpKeep = params => {
  return request({
    url: `/keepMem/vue/vehicle/addVehicleTypeUpKeep`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑保养
export const updateVehicleTypeUpKeep = params => {
  return request({
    url: `/keepMem/vue/vehicle/updateVehicleTypeUpKeep`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 保养详情
export const getVehicleTypeUpKeepDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/vehicle/getVehicleTypeUpKeepDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除保养设置
export const delVehicleTypeUpkeep = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/vue/vehicle/delVehicleTypeUpkeep`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
