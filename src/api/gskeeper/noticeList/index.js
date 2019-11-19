import request from "@/utils/request";
let querystring = require("querystring");

// 通知列表
export const noticeList = params => {
  return request({
    url: `/keepMem/notice/noticeList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 获取员工列表
export const allEmpl = params => {
  return request({
    url: `/keepMem/notice/allEmpl`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 新增保存通知
export const doAdd = params => {
  return request({
    url: `/keepMem/notice/noticeAdd`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 发送通知
export const doSend = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/notice/noticeSend`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑通知
export const goUpdate = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/notice/noticeUpdatePage`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 删除通知
export const doDel = params => {
  let data = querystring.encode(params);
  return request({
    url: `/keepMem/notice/noticeDel`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 编辑通知保存
export const doUpdate = params => {
  return request({
    url: `/keepMem/notice/noticeUpdate`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 编辑通知并发送
export const doUpdateAndSend = params => {
  return request({
    url: `/keepMem/notice/noticeUpdateAndSend`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
