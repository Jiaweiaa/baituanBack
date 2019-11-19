/**
 * Created by jiachenpan on 16/11/18.
 */

// export function isvalidUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

//佣金比例正则校验
export function regRadio(number) {
  var reg = new RegExp(/[^0-9.]+/g, "");
  return !reg.test(number) && number >= 0 && number <= 100;
}
//商品价格正则校验
export function regPrice(number) {
  var reg = new RegExp(/[^0-9.]+/g, "");

  return !reg.test(number) && number >= 0;
}
