import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { Message } from "element-ui";
import { PcCookie, enums } from "@/utils";  //getToken from cookie

NProgress.configure({ showSpinner: false }); // NProgress configuration
const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (PcCookie.get(enums.USER.AUTH_TOKEN) ) {
    if (to.path == "/login") {
      if(store.state.menu.menuList[0]) {
        next(store.state.menu.menuList[0].url);
      }else {
        next();
      }

      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});
//我是小伟，我爱吃粑粑，ohhhhhhh！ yeah！
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
