import request from "@/utils/request";
let querystring = require("querystring");

//列表接口
export const orderList = params => {
  return request({
    url: `/trade/orderBack/orderList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

//删除属性集
export const orderDetail = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/orderBack/orderDetail`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 发货
export const orderSendConfrim = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/orderBack/orderSendConfrim`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};



// 打印
export const printReceipt = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/printTicket/printReceipt`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 店铺列表
export const findStoreNameList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/orderBack/findStoreNameList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 团长供应商立碑
export const getCaptainAndSupplierList = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/orderBack/getCaptainAndSupplierList`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 导出excel
export const excleOut = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/excle/excleOut`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};


// 获取所有物流公司
export const getLogisticsCompany = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/orderBack/getLogisticsCompany`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
