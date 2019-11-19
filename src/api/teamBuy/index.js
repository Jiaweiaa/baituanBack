import request from "@/utils/request";
let querystring = require("querystring");

// 团长列表接口
export const findCaptainWithPage = params => {
  return request({
    url: `/shop/captain/findCaptainWithPage   `,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 团长编辑审核状态
export const editApprovalStatus = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/editApprovalStatus`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 团长编辑状态
export const editCaptainStatus = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/editCaptainStatus`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 团长查看详情
export const captainDetile = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/captainDetile`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};


// 团长新增团长
export const saveOrEditCaptain = params => {
  return request({
    url: `/shop/captain/saveOrEditCaptain`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 供应商新增
export const addSupplier = params => {
  return request({
    url: `/shop/supplier/addSupplier`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 供应商编辑保存
export const updateSupplierDetail = params => {
  return request({
    url: `/shop/supplier/updateSupplierDetail`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 供货商通过编辑详情
export const getSupplierById = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/supplier/getSupplierById`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};


// 团长获取用户
export const getCustomerInfoList = params => {
  return request({
    url: `/shop/supplier/getCustomerInfoList`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// 供应商列表
export const getSupplierListWithPage = params => {
  return request({
    url: `/shop/supplier/getSupplierListWithPage`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
// 供货商通过
export const refuseSupplier = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/supplier/refuseSupplier`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 批量通过
export const passSupplier = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/supplier/passSupplier`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 删除供应商
export const deleteSupplier = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/supplier/deleteSupplier`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 删除团长
export const deleteCaptain = params => {
  let data = querystring.encode(params);
  return request({
    url: `/shop/captain/deleteCaptain`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
