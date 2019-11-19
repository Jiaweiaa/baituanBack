import request from "@/utils/request";

//查询列表数据
export const getTree = params => {
  return request.post(`/basic/menu/getTree`, params);
};

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
