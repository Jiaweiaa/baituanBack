import request from "@/utils/request";
let querystring = require("querystring");

// 退货/换货列表
export const pageList = params => {
  return request({
    url: `/trade/order/reApply/pageList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 审核申请列表
export const checkApplyPageList = params => {
  return request({
    url: `/trade/order/reApply/checkApplyPageList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 申请取消订单列表
export const applyCanclePageList = params => {
  return request({
    url: `/trade/order/reApply/applyCanclePageList`,
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

// 付款前取消订单
export const cancleOrderBeforePay = params => {
  return request({
    url: `/trade/order/reApply/cancleOrderBeforePay`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 付款后申请取消订单
export const cancleOrderAfterPay = params => {
  return request({
    url: `/trade/order/reApply/cancleOrderAfterPay`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 单条订单详情页
export const actOrderDetail = params => {
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

// 申请退换货
export const returnOrExchange = params => {
  return request({
    url: `/trade/order/reApply/returnOrExchange`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 付款后申请取消订单审核
export const applyCancleOrderSH = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/order/reApply/applyCancleOrderSH`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 审批
export const applyReview = params => {
  return request({
    url: `/trade/order/reApply/applyReview`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};


// 放弃退换货
export const giveUpRefund = params => {
  return request({
    url: `/trade/order/reApply/giveUpRefund`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 卖家确认收到退货
export const customConfirmReceive = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/order/reApply/customConfirmReceive`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 卖家打回退款
export const customPayReturn = params => {
  let data = querystring.encode(params);
  return request({
    url: `/trade/order/reApply/customPayReturn`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 可退换货列表
export const findAvailableOrderlines = params => {
  return request({
    url: `/trade/order/reApply/findAvailableOrderlines`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
