import request from "@/utils/request";
let querystring = require("querystring");

// 分页列表
export const allPageQuery = params => {
  return request({
    url: `/rescue/garageManage/allPageQuery`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取所有维修项目
export const repairProject = params => {
  return request({
    url: `/rescue/dic/repairProject`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取所有维修类型
export const vehicleType = params => {
  return request({
    url: `/rescue/dic/vehicleType`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 加盟/退出联合服务站
export const joinOrOutGaurantee = params => {
  return request({
    url: `/rescue/garageManage/joinOrOutGaurantee`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 审批修配厂
export const auditGarage = params => {
  return request({
    url: `/rescue/garageManage/auditGarage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};



// 查看详情
export const garageInfo = params => {
  let data = querystring.encode(params);
  return request({
    url: `/rescue/garageManage/garageInfo`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑修配厂
export const garageEditBySystem = params => {
  return request({
    url: `/rescue/garageManage/garageEditBySystem`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
