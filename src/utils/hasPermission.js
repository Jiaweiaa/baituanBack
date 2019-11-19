import store from '../store'

// 是否有权限
export function hasPermission(permission) {
  let allBtns = store.state.user.permissionBtns;
  return allBtns.indexOf(permission) > -1;
}

// 是否显示操作
export function isShowLabelNum(data) {
  let isBok = false;
  data.map(val => {
    if(this.hasPerm(val)) {
      isBok = true;
    }
  });
  return isBok;
}
