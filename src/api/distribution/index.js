/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 17:22:19
 * @LastEditTime: 2019-10-02 10:05:24
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";
let querystring = require("querystring");

// 查省代理列表
export const getRelationShipListPage = params => {
  return request({
    url: `/basic/memRelationShip/getRelationShipListPage`,
    method: "post",
    data: params,
    headers: {
     "Content-Type": "application/json"
    },
  });
};

// 根据手机号查平台用户
export const getMemberInfoByMobile = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memRelationShip/getMemberInfoByMobile`,
    method: "post",
    data: data,
    headers: {
     "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 添加省代理
export const addFirstLevel = params => {
  return request({
    url: `/basic/memRelationShip/addFirstLevel`,
    method: "post",
    data: params,
    headers: {
     "Content-Type": "application/json"
    },
  });
};

// 添加积分
export const updateBStoreScore = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memRelationShip/updateBStoreScore`,
    method: "post",
    data: data,
    headers: {
     "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 添加zidaili
export const addOtherLevel = params => {
  return request({
    url: `/basic/memRelationShip/addOtherLevel`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};



//获取全部佣金比率数据
export const profitDistributionList = params => {
  return request({
    url: `/basic/profitDistribution/profitDistributionList`,
    method: "post",
    data: params,
    headers: {
     "Content-Type": "application/json"
    },
  });
};

//修改佣金比例
export const editRatio = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/profitDistribution/editRatio`,
    method: "post",
    data: data,
    headers: {
     "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};


//获取佣金记录列表
export const getMemRelationshipRecordingPage = params => {
  return request({
    url: `/basic/memRelationshipRecording/getMemRelationshipRecordingPage`,
    method: "post",
    data: params,
    headers: {
     "Content-Type": "application/json"
    },
  });
};

//获取用户提现记录列表
export const getWithdrawPage = params => {
  return request({
    url: `/basic/memRelationshipRecording/getWithdrawPage`,
    method: "post",
    data: params,
    headers: {
     "Content-Type": "application/json"
    },
  });
};
//同意提现
export const withdraw2WeChat = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memRelationshipRecording/withdraw2WeChat`,
    method: "post",
    data: data,
    headers: {
     "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 爆品街开关
export const updateRelationshipType = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/memRelationShip/updateRelationshipType`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
