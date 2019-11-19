import Cookies from 'js-cookie';
//构造此应用中的cookie类
class PcCookie {
  constructor() {
    this.expireTime = 7200; //过期时间
  }
  //构造set方法
  set(cookieParam) {
    let {key, value, success} = cookieParam;
    PcCookie.checkKey(key);
    Cookies.set(key, value);
    success && success();
  }
  //构造get方法
  get(key) {
    PcCookie.checkKey(key);
    return Cookies.get(key);
  }
  // 构造删除方法
  delete(cookieParam) {
    const {key,success} = cookieParam;
    PcCookie.checkKey(key);
    Cookies.remove(key);
    success && success();
  }
  // 构造获取所有cookie方法
  geteAll() {
    return Cookies.get();
  }
  // 检查这个cookie值是否存在的方法
  static checkKey(key) {
    if (!key) {
      throw new Error('没有找到key。');
    }
    if (typeof key === 'object') {
      throw new Error('key不能是一个对象。');
    }
  }
}

export default new PcCookie();
