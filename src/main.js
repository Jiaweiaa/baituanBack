import Vue from 'vue'
import ElSearchTablePagination from 'el-search-table-pagination'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import 'element-ui/lib/theme-chalk/index.css';
import { hasPermission, isShowLabelNum } from "./utils/hasPermission";
import infiniteScroll from 'vue-infinite-scroll';
import 'babel-polyfill'

import VueAMap from 'vue-amap'


VueAMap.initAMapApiLoader({
  key: '382aecfb47b3d683b8ba684719a0dde6',
  plugin: [
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'Geocoder',
    'AMap.Geolocation',
    'AMap.CitySearch',
    'AMap.CircleMarker',
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.DistrictSearch'
  ],
  v: '1.4.4'
});
Vue.use(VueAMap);
setTimeout(() => {
  localStorage.clear();
  Vue.use(VueAMap);
  // 初始化vue-amap
  VueAMap.initAMapApiLoader({
    key: '382aecfb47b3d683b8ba684719a0dde6',
    // 插件集合
    plugin: [
      'AMap.OverView',
      'AMap.ToolBar',
      'AMap.MapType',
      'Geocoder',
      'AMap.Geolocation',
      'AMap.CitySearch',
      'AMap.CircleMarker',
      'AMap.Autocomplete',
      'AMap.PlaceSearch',
      'AMap.Scale',
      'AMap.PolyEditor',
      'AMap.CircleEditor'
    ],
    v: '1.4.4'
  });
});


/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */

Vue.prototype.hasPerm = hasPermission;
Vue.prototype.isShowLabelNum = isShowLabelNum;
Vue.prototype.imageLibrary = new Vue;
Vue.use(ElementUI);
Vue.use(infiniteScroll);
Vue.use(ElSearchTablePagination);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  filters: {
      filterOpening: function (value) {
        console.log(Value)
      }
  },
  render: h => h(App)
})
