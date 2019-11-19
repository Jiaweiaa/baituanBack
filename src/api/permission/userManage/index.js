import request from "@/utils/request";
let querystring = require("querystring");

// 用户管理分页
export const queryUserWithPage = params => {
  return request({
    url: `/basic/user/queryUserWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 修改用户禁用启用状态
export const modifyUserStatusById = params => {
  return request({
    url: `/basic/user/modifyUserStatusById`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 查看登陆账号是否存在
export const checkLoginName = params => {
  return request({
    url: `/basic/user/checkLoginName`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 查看邮箱是否存在
export const checkEmail = params => {
  return request({
    url: `/basic/user/checkEmail`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 查看邮箱是否存在
export const saveOrUpdateUser = params => {
  return request({
    url: `/basic/user/saveOrUpdateUser`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 删除数据
export const deleteUserById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/user/deleteUserById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 获取绑定和角色列表
export const getBindRoleByUserId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/user/getBindRoleByUserId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 绑定
export const userBindRole = params => {
  return request({
    url: `/basic/user/userBindRole`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
