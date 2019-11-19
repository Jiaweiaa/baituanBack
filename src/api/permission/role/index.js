import request from "@/utils/request";
let querystring = require("querystring");

//查询列表数据
export const getTree = params => {
  return request.post(`/basic/menu/getTree`, params);
};

//角色管理列表
export const queryRoleListWithPage = params => {
  return request({
    url: `/basic/role/queryRoleListWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//角色管理新建
export const roleSave = params => {
  return request({
    url: `/basic/role/saveRole`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
//角色管理删除
export const deleteRoleById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/role/deleteRoleById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 验证编码是否存在
export const checkRoleCode = params => {
  return request({
    url: `/basic/role/checkRoleCode`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 编辑角色
export const editRoleById = params => {
  return request({
    url: `/basic/role/editRole`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 验证姓名是否存在
export const checkRoleName = params => {
  return request({
    url: `/basic/role/checkRoleName`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

// 确认按钮级权限
export const saveAction = params => {
  return request({
    url: `/basic/action/saveAction`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};


// 获取菜单树
export const getMenuTreeByRoleId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/role/getMenuTreeByRoleId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};

// 获取按钮权限树
export const getActionTreeByRoleId = params => {
  let data = querystring.encode(params);
  return request({
    url: `/basic/role/getActionTreeByRoleId`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
};
// 角色绑定菜单
export const roleBindMenu = params => {
  return request({
    url: `/basic/role/roleBindMenu`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
// 角色绑定权限
export const roleBindAction = params => {
  return request({
    url: `/basic/role/roleBindAction`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};
