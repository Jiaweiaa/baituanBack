/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 17:53:41
 * @LastEditTime: 2019-08-22 17:07:31
 * @LastEditors: Please set LastEditors
 */
import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
// export const asyncRouterMap = this.$store.state.menu.menuList;

// asyncRouterMap.map(v => {

//   if(v.hasMenu){
//       v.map(h => {

//       })
//   }
//   return v;
// });

export const constantRouterMap = [
  {
    path: "/",
    redirect: "/login",
    hidden: true
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },

  // 首页统计
  {
    path: "/overview",
    component: Layout,
    redirect: "/overview/index",
    name: "overview",
    meta: { title: "总览", icon: "example", isVisited: true },
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/views/overview/index"),
        meta: { title: "总览首页", icon: "table", isVisited: true }
      }
    ]
  },
  //用户权限
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/role",
    name: "permission",
    meta: { title: "用户权限", icon: "el-icon-user-solid" },
    children: [
      {
        path: "role",
        name: "role",
        component: () => import("@/views/permission/role/index"),
        meta: { title: "角色管理", icon: "el-icon-user-solid", isVisited: true }
      },
      {
        path: "roleWay",
        name: "roleWay",
        redirect: "/permission/roleWay/roleSetting",
        component: () => import("@/views/permission/roleTemplate/index"),
        meta: { title: "角色权限设置", icon: "tree", isVisited: true },
        children: [
          {
            hidden: true,
            path: "activeManager",
            name: "activeManager",
            component: () => import("@/views/permission/activeManager/index"),
            meta: { title: "权限管理", icon: "table", isVisited: false }
          },
          {
            hidden: true,
            path: "roleSetting",
            name: "roleSetting",
            component: () => import("@/views/permission/roleSetting/index"),
            meta: { title: "菜单管理", icon: "table", isVisited: true }
          }
        ]
      },
      {
        path: "userManage",
        name: "userManage",
        component: () => import("@/views/permission/userManage/index"),
        meta: { title: "用户管理", icon: "tree", isVisited: true }
      },
      {
        path: "distributeRole",
        name: "distributeRole",
        component: () => import("@/views/permission/distributeRole/index"),
        meta: { title: "分配用户角色", icon: "tree", isVisited: true }
      }
    ]
  },
  //店铺管理
  {
    path: "/store",
    component: Layout,
    redirect: "/store/storeList",
    name: "store",
    meta: { title: "店铺管理", icon: "example" },
    children: [
      {
        path: "storeList",
        name: "storeList",
        component: () => import("@/views/store/storeList/index"),
        meta: { title: "店铺列表", icon: "table", isVisited: true }
      },
      {
        path: "storeGoods",
        name: "storeGoods",
        component: () => import("@/views/store/storeGoods/index"),
        meta: { title: "店铺商品", icon: "table", isVisited: true }
      },
      {
        path: "information",
        name: "information",
        component: () => import("@/views/store/information/index"),
        meta: { title: "店铺信息", icon: "table", isVisited: true }
      },

      {
        path: "propertiesTemplate",
        name: "propertiesTemplate",
        redirect: "/store/propertiesTemplate/properties",
        meta: { title: "属性集管理", icon: "table", isVisited: true },
        component: () => import("@/views/store/properties/template"),
        children: [
          {
            path: "properties",
            name: "properties",
            component: () => import("@/views/store/properties/index"),
            meta: { title: "自定义店铺属性集", icon: "table", isVisited: true }
          },
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/store/properties/detail"),
            meta: { title: "属性集详情", isVisited: false }
          }
        ]
      },
      {
        path: "selfStore",
        name: "selfStore",
        redirect: "/store/selfStore/selfStoreList",
        component: () => import("@/views/store/selfStore/templateVue"),
        meta: { title: "自定义店铺", icon: "table", isVisited: true },
        children: [
          {
            path: "selfStoreList",
            name: "selfStoreList",
            component: () => import("@/views/store/selfStore/index"),
            meta: { title: "自定义店铺列表", icon: "table", isVisited: true }
          },
          {
            hidden: true,
            path: "selfStoreDetail",
            name: "selfStoreDetail",
            component: () => import("@/views/store/selfStore/addOrEdit"),
            meta: { title: "自定义店铺设置", isVisited: false }
          }
        ]
      },
      {
        path: "parameter",
        name: "parameter",
        component: () => import("@/views/store/parameter/index"),
        meta: { title: "参数设置", icon: "table", isVisited: true }
      },
      {
        path: "navigationTemplate",
        name: "navigationTemplate",
        redirect: "/store/navigationTemplate/navigation",
        meta: { title: "导航菜单", icon: "table", isVisited: true },
        component: () => import("@/views/store/navigationTemplate/index"),
        children: [
          {
            path: "navigation",
            name: "navigation",
            component: () => import("@/views/store/navigation/index"),
            hidden: true,
            meta: { title: "导航数据", isVisited: true }
          },
          {
            path: "navigationDetail",
            name: "navigationDetail",
            component: () => import("@/views/store/navigationDetail/index"),
            hidden: true,
            meta: { title: "编辑导航", isVisited: false }
          }
        ]
      },
      {
        path: "brand",
        name: "brand",
        component: () => import("@/views/store/brand/index"),
        meta: { title: "品牌管理", icon: "table", isVisited: true }
      }
    ]
  },
  // 救援管理
  {
    path: "/rescue",
    component: Layout,
    redirect: "/rescue/rescueCars",
    name: "rescue",
    meta: { title: "救援管理", icon: "example" },
    children: [
      {
        path: "telephoneRescue",
        name: "telephoneRescue",
        component: () => import("@/views/rescue/telephoneRescue"),
        meta: { title: "电话救援", icon: "table", isVisited: true }
      },
      {
        path: "maintenance",
        name: "maintenance",
        component: () => import("@/views/rescue/maintenance"),
        meta: { title: "维修单管理", icon: "table", isVisited: true }
      },
      {
        path: "rescueCars",
        name: "rescueCars",
        component: () => import("@/views/rescue/rescueCars"),
        meta: { title: "维修车型", icon: "table", isVisited: true }
      },
      {
        path: "advance",
        name: "advance",
        component: () => import("@/views/rescue/advance"),
        meta: { title: "提现管理", icon: "table", isVisited: true }
      },
      {
        path: "rescueType",
        name: "rescueType",
        component: () => import("@/views/rescue/rescueType"),
        meta: { title: "维修类型", icon: "table", isVisited: true }
      },
      {
        path: "appraise",
        name: "appraise",
        component: () => import("@/views/rescue/appraise"),
        meta: { title: "评价设置", icon: "table", isVisited: true }
      },
      {
        path: "cancellation",
        name: "cancellation",
        component: () => import("@/views/rescue/cancellation"),
        meta: { title: "取消原因", icon: "table", isVisited: true }
      },
      {
        path: "rescueProject",
        name: "rescueProject",
        component: () => import("@/views/rescue/rescueProject"),
        meta: { title: "维修项目", icon: "table", isVisited: true }
      },
      {
        path: "repair",
        name: "repair",
        component: () => import("@/views/rescue/repair"),
        meta: { title: "修配厂管理", icon: "table", isVisited: true }
      },
      {
        path: "orderList",
        name: "orderList",
        component: () => import("@/views/rescue/orderList"),
        meta: { title: "救援订单列表", icon: "table", isVisited: true }
      }
    ]
  },
  //商品管理
  {
    path: "/mall",
    component: Layout,
    redirect: "/mall/mallClass",
    name: "mall",
    meta: { title: "商品管理", icon: "example" },
    children: [
      {
        path: "newProduct",
        name: "newProduct",
        component: () => import("@/views/mall/newProduct/index"),
        meta: {
          title: "新建中的商品",
          icon: "table",
          isVisited: true,
          noCache: true
        }
      },
      {
        path: "warehouseProduct",
        name: "warehouseProduct",
        component: () => import("@/views/mall/warehouseProduct/index"),
        meta: {
          title: "仓库中的商品",
          icon: "table",
          isVisited: true,
          noCache: true
        }
      },
      {
        path: "sellProduct",
        name: "sellProduct",
        component: () => import("@/views/mall/sellProduct/index"),
        meta: {
          title: "上架中的商品",
          icon: "table",
          isVisited: true,
          noCache: true
        }
      },
      {
        hidden: true, // (默认 false)
        path: "ProductAdd",
        name: "ProductAdd",
        component: () => import("@/views/mall/newProduct/ProductAdd"),
        meta: {
          title: "新建商品",
          icon: "table",
          isVisited: false,
          noCache: true
        }
      },
      {
        path: "mallClass",
        name: "mallClass",
        component: () => import("@/views/mall/mallClass/index"),
        meta: { title: "商品分类", icon: "table", isVisited: true }
      },
      {
        path: "filterOptionTemplate",
        name: "filterOptionTemplate",
        redirect: "/mall/filterOptionTemplate/filterOptionManage",
        meta: { title: "筛选项管理", icon: "table", isVisited: true },
        component: () => import("@/views/mall/filterOptionTemplate/index"),
        children: [
          {
            path: "filterOptionManageDetail",
            name: "filterOptionManageDetail",
            component: () =>
              import("@/views/mall/filterOptionManageDetail/index"),
            hidden: true,
            meta: { title: "筛选项操作", isVisited: false }
          },
          {
            path: "filterOptionManage",
            name: "filterOptionManage",
            component: () => import("@/views/mall/filterOptionManage/index"),
            hidden: true,
            meta: { title: "筛选项管理列表", isVisited: true }
          }
        ]
      },
      {
        path: "saleAttr",
        name: "saleAttr",
        component: () => import("@/views/mall/saleAttr/index"),
        meta: { title: "销售属性", icon: "table", isVisited: true }
      },
      {
        //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
        hidden: true, // (默认 false)
        path: "saleAttrDetail",
        name: "saleAttrDetail",
        component: () => import("@/views/mall/saleAttrDetail/index"),
        meta: {
          title: "销售属性值列表",
          icon: "table",
          noCache: true,
          isVisited: true
        }
      },
      {
        path: "goodsAttr",
        name: "goodsAttr",
        component: () => import("@/views/mall/goodsAttr/index"),
        meta: { title: "商品属性集", icon: "table", isVisited: true }
      }
    ]
  },
  // 促销管理
  {
    path: "/promotion",
    component: Layout,
    redirect: "/promotion/bundlingSales",
    name: "promotion",
    meta: { title: "促销管理", icon: "example", isVisited: true },
    children: [
      {
        path: "ladderConcessionsTemplate",
        name: "ladderConcessionsTemplate",
        component: () =>
          import(
            "@/views/promotion/ladderConcessions/ladderConcessionsTemplate"
          ),
        redirect: "/promotion/ladderConcessionsTemplate/ladderConcessionsView",
        meta: { title: "阶梯优惠", icon: "table", isVisited: true },
        children: [
          {
            path: "ladderConcessionsView",
            name: "ladderConcessionsView",
            component: () =>
              import(
                "@/views/promotion/ladderConcessions/ladderConcessionsView"
              ),
            meta: { title: "阶梯优惠列表", icon: "table", isVisited: true }
          },
          {
            path: "newLadderConcessions",
            name: "newLadderConcessions",
            component: () =>
              import(
                "@/views/promotion/ladderConcessions/newLadderConcessions"
              ),
            meta: {
              title: "阶梯优惠详情",
              icon: "table",
              isVisited: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: "sendCouponTemplate",
        name: "sendCouponTemplate",
        redirect: "/promotion/sendCouponTemplate/sendCouponView",
        component: () =>
          import("@/views/promotion/sendCoupon/sendCouponTemplate"),
        meta: { title: "发送优惠券", icon: "table", isVisited: true },
        children: [
          {
            hidden: true, // (默认 false)
            path: "sendCouponView",
            name: "sendCouponView",
            component: () =>
              import("@/views/promotion/sendCoupon/sendCouponView"),
            meta: { title: "发送优惠券列表", icon: "table", isVisited: true }
          },
          {
            hidden: true, // (默认 false)
            path: "newSendCoupon",
            name: "newSendCoupon",
            component: () =>
              import("@/views/promotion/sendCoupon/newSendCoupon"),
            meta: {
              title: "发送优惠券详情",
              icon: "table",
              isVisited: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: "couponTemplate",
        name: "couponTemplate",
        redirect: "/promotion/couponTemplate/couponView",
        component: () => import("@/views/promotion/coupon/couponTemplate"),
        meta: { title: "优惠券", icon: "table", isVisited: true },
        children: [
          {
            path: "couponView",
            name: "couponView",
            component: () => import("@/views/promotion/coupon/couponView"),
            meta: { title: "优惠券列表", icon: "table", isVisited: true }
          },
          {
            hidden: true, // (默认 false)
            path: "newCoupon",
            name: "newCoupon",
            component: () => import("@/views/promotion/coupon/newCoupon"),
            meta: {
              title: "优惠券详情",
              icon: "table",
              isVisited: false,
              noCache: true
            }
          },
          {
            path: "achieveList",
            name: "achieveList",
            component: () => import("@/views/promotion/coupon/achieveList"),
            meta: { title: "领取清单", icon: "table", isVisited: true }
          },
          {
            path: "usedList",
            name: "usedList",
            component: () => import("@/views/promotion/coupon/usedList"),
            meta: { title: "使用清单", icon: "table", isVisited: true }
          }
        ]
      },
      {
        path: "flashSaleTemplate",
        name: "flashSaleTemplate",
        redirect: "/promotion/flashSaleTemplate/flashSale",
        meta: { title: "限时抢购", icon: "table", isVisited: true },
        component: () =>
          import("@/views/promotion/flashSale/flashSaleTemplate"),
        children: [
          {
            path: "flashSale",
            name: "flashSale",
            component: () =>
              import("@/views/promotion/flashSale/flashSaleView"),
            meta: { title: "限时抢购列表", icon: "table", isVisited: true }
          },
          {
            hidden: true, // (默认 false)
            path: "newFlashSale",
            name: "newFlashSale",
            component: () => import("@/views/promotion/flashSale/newFlashSale"),
            meta: {
              title: "限时抢购详情",
              icon: "table",
              isVisited: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: "groupBuyingTemplate",
        name: "groupBuyingTemplate",
        redirect: "/promotion/groupBuyingTemplate/groupBuyFirstView",
        meta: { title: "团购管理", icon: "table", isVisited: true },
        component: () =>
          import("@/views/promotion/groupBuying/groupBuyingTemplate"),
        children: [
          {
            path: "groupBuyFirstView",
            name: "groupBuyFirstView",
            component: () =>
              import("@/views/promotion/groupBuying/groupBuyFirstView"),
            meta: { title: "团购列表", icon: "table", isVisited: true }
          },
          {
            path: "groupBuyingView",
            name: "groupBuyingView",
            component: () =>
              import("@/views/promotion/groupBuying/groupBuyingView"),
            meta: { title: "团购活动列表", icon: "table", isVisited: true }
          },
          {
            hidden: true, // (默认 false)
            path: "newGroupBuying",
            name: "newGroupBuying",
            component: () =>
              import("@/views/promotion/groupBuying/newGroupBuying"),
            meta: {
              title: "团购详情",
              icon: "table",
              isVisited: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: "bundlingTemplate",
        name: "bundlingTemplate",
        redirect: "/promotion/bundlingTemplate/bundlingView",
        meta: { title: "捆绑销售", icon: "table", isVisited: true },
        component: () =>
          import("@/views/promotion/bundlingSales/bundlingTemplate"),
        children: [
          {
            path: "bundlingView",
            name: "bundlingView",
            component: () =>
              import("@/views/promotion/bundlingSales/bundlingView"),
            meta: { title: "捆绑销售列表", icon: "table", isVisited: true }
          },
          {
            hidden: true, // (默认 false)
            path: "newBundling",
            name: "newBundling",
            component: () =>
              import("@/views/promotion/bundlingSales/newBundling"),
            meta: { title: "捆绑销售详情", icon: "table", isVisited: true }
          }
        ]
      },
      {
        path: "integralTemplate",
        name: "integralTemplate",
        redirect: "/promotion/integralTemplate/integral",
        meta: { title: "", icon: "table", isVisited: true },
        component: () => import("@/views/promotion/integral/template"),
        children: [
          {
            path: "integral",
            name: "integral",
            component: () => import("@/views/promotion/integral/index"),
            meta: {
              title: "积分管理",
              icon: "table",
              isVisited: true,
              noCache: true
            }
          },
          {
            hidden: true, // (默认 false)
            path: "lookIntegral",
            name: "lookIntegral",
            component: () => import("@/views/promotion/integral/lookView"),
            meta: { title: "活动积分", icon: "table", isVisited: false }
          }
        ]
      },
      {
        path: "shoppingTemplate",
        name: "shoppingTemplate",
        redirect: "/promotion/shoppingTemplate/shopping",
        meta: { title: "", icon: "table", isVisited: true },
        component: () => import("@/views/promotion/shoppingBean/template"),
        children: [
          {
            path: "shopping",
            name: "shopping",
            component: () => import("@/views/promotion/shoppingBean/index"),
            meta: {
              title: "购物豆管理",
              icon: "table",
              isVisited: true,
              noCache: true
            }
          },
          {
            hidden: true, // (默认 false)
            path: "shoppingDetail",
            name: "shoppingDetail",
            component: () => import("@/views/promotion/shoppingBean/lookView"),
            meta: { title: "购物豆活动详情", icon: "table", isVisited: false }
          }
        ]
      }
    ]
  },
  // 大管家
  {
    path: "/gskeeper",
    component: Layout,
    redirect: "/gskeeper/notice",
    name: "gskeeper",
    meta: { title: "大管家", icon: "example", isVisited: true },
    children: [
      {
        path: "bannerManager",
        name: "bannerManager",
        component: () => import("@/views/gskeeper/bannerManager/index"),
        meta: { title: "轮播图管理", icon: "table", isVisited: true }
      },
      {
        path: "repairPlant",
        name: "repairPlant",
        component: () => import("@/views/gskeeper/repairPlant/index"),
        meta: { title: "修配厂管理", icon: "table", isVisited: true }
      },
      {
        path: "openingOrder",
        name: "openingOrder",
        component: () => import("@/views/gskeeper/openingOrder/index"),
        meta: { title: "开单管理", icon: "table", isVisited: true }
      },
      {
        path: "gaoshanMember",
        name: "gaoshanMember",
        component: () => import("@/views/gskeeper/gaoshanMember/index"),
        meta: { title: "高山会员", icon: "table", isVisited: true }
      },
      {
        path: "ordinaryMember",
        name: "ordinaryMember",
        component: () => import("@/views/gskeeper/ordinaryMember/index"),
        meta: { title: "普通会员", icon: "table", isVisited: true }
      },
      {
        path: "copyWriting",
        name: "copyWriting",
        component: () => import("@/views/gskeeper/copyWriting/index"),
        meta: { title: "文案模块", icon: "table", isVisited: true }
      },
      {
        path: "noticeList",
        name: "noticeList",
        component: () => import("@/views/gskeeper/noticeList/index"),
        meta: { title: "通知列表", icon: "table", isVisited: true }
      },
      {
        path: "vehicleType",
        name: "vehicleType",
        component: () => import("@/views/gskeeper/vehicleType/index"),
        meta: { title: "车辆类型", icon: "table", isVisited: true }
      },
      {
        path: "maintain",
        name: "maintain",
        component: () => import("@/views/gskeeper/maintain/index"),
        meta: { title: "保养管理", icon: "table", isVisited: true }
      },
      {
        path: "feedback",
        name: "feedback",
        component: () => import("@/views/gskeeper/feedback/index"),
        meta: { title: "意见反馈", icon: "table", isVisited: true }
      }
    ]
  },
  // 素材管理
  {
    path: "/resources",
    component: Layout,
    redirect: "/resources/picture",
    name: "resources",
    meta: { title: "素材管理", icon: "example", isVisited: true },
    children: [
      {
        path: "picture",
        name: "picture",
        component: () => import("@/views/resources/picture/index"),
        meta: { title: "图片管理", icon: "table", isVisited: true }
      }
    ]
  },
  // 版本管理
  {
    path: "/version",
    component: Layout,
    redirect: "/version/versionIndex",
    name: "resources",
    meta: { title: "版本管理", icon: "example", isVisited: true },
    children: [
      {
        path: "versionIndex",
        name: "versionIndex",
        component: () => import("@/views/version/index"),
        meta: { title: "系统版本", icon: "table", isVisited: true }
      }
    ]
  },
  // 商城管理
  {
    path: "/homeView",
    component: Layout,
    redirect: "/homeView/homeViewSet",
    name: "homeView",
    meta: { title: "商城设置", icon: "example", isVisited: true },
    children: [
      {
        path: "homeViewSet",
        name: "homeViewSet",
        component: () => import("@/views/homeView/index"),
        meta: { title: "首页设置", icon: "table", isVisited: true }
      },
      {
        path: "purchaseHomeView",
        name: "purchaseHomeView",
        component: () => import("@/views/purchaseHomeView/index"),
        meta: { title: "采购首页设置", icon: "table", isVisited: true }
      },
      {
        path: "articleTemplate",
        name: "articleTemplate",
        redirect: "/homeView/articleTemplate/article",
        component: () => import("@/views/article/template"),
        meta: { title: "专题列表", icon: "table", isVisited: true },
        children: [
          {
            path: "article",
            name: "article",
            component: () => import("@/views/article/list"),
            meta: {
              title: "专题列表",
              icon: "table",
              isVisited: true,
              noCache: true
            }
          }
        ]
      }
    ]
  },
  // 分销管理
  {
    path: "/distribution",
    component: Layout,
    redirect: "/distribution/provinceFactor",
    name: "distribution",
    meta: { title: "分销管理", icon: "example", isVisited: true },
    children: [
      {
        path: "provinceFactor",
        name: "provinceFactor",
        component: () => import("@/views/distribution/provinceFactor"),
        meta: { title: "省代理列表", icon: "table", isVisited: true }
      },
      {
        path: "commissionRate",
        name: "commissionRate",
        component: () => import("@/views/distribution/commissionRate"),
        meta: { title: "佣金比例列表", icon: "table", isVisited: true }
      },
      {
        path: "commissionRecord",
        name: "commissionRecord",
        component: () => import("@/views/distribution/commissionRecord"),
        meta: { title: "佣金记录列表", icon: "table", isVisited: true }
      },
      {
        path: "subsidyList",
        name: "subsidyList",
        component: () => import("@/views/distribution/subsidy"),
        meta: { title: "补贴金发放记录", icon: "table", isVisited: true }
      },
      {
        path: "userWithdrawRecord",
        name: "userWithdrawRecord",
        component: () => import("@/views/distribution/userWithdrawRecord"),
        meta: { title: "用户提现记录", icon: "table", isVisited: true }
      },
      {
        path: "urbanOperation",
        name: "urbanOperation",
        component: () => import("@/views/distribution/urbanOperation"),
        meta: { title: "城市运营中心", icon: "table", isVisited: true }
      },
    ]
  },
  // 交易管理
  {
    path: "/transaction",
    component: Layout,
    redirect: "/transaction/orderTemplate",
    name: "transaction",
    meta: { title: "交易管理", icon: "example", isVisited: true },
    children: [
      {
        path: "orderTemplate",
        name: "orderTemplate",
        redirect: "/transaction/orderTemplate/orderList",
        meta: { title: "订单", icon: "table", isVisited: true },
        component: () => import("@/views/transaction/orderList/template"),
        children: [
          {
            path: "orderList",
            name: "orderList",
            component: () => import("@/views/transaction/orderList/orderList"),
            meta: { title: "订单列表", icon: "table", isVisited: true }
          },
          {
            path: "orderDetail",
            name: "orderDetail",
            component: () =>
              import("@/views/transaction/orderList/orderDetail"),
            meta: { title: "订单详情", icon: "table", isVisited: false }
          }
        ]
      },
      {
        path: "returnGoodsTemplate",
        name: "returnGoodsTemplate",
        redirect: "/transaction/returnGoodsTemplate/returnList",
        meta: { title: "退货", icon: "table", isVisited: true },
        component: () => import("@/views/transaction/returnGoods/template"),
        children: [
          {
            path: "returnList",
            name: "returnList",
            component: () =>
              import("@/views/transaction/returnGoods/returnList"),
            meta: { title: "退换货列表", icon: "table", isVisited: true }
          },
          {
            path: "returnDetail",
            name: "returnDetail",
            component: () =>
              import("@/views/transaction/returnGoods/returnDetail"),
            meta: { title: "退换货详情", icon: "table", isVisited: false }
          }
        ]
      }
    ]
  },
  // 物流
  {
    path: "/logisticsTools",
    component: Layout,
    redirect: "/logisticsTools/freightTemplate",
    name: "logisticsTools",
    meta: { title: "物流工具", icon: "example", isVisited: true },
    children: [
      {
        path: "freightTemplate",
        name: "freightTemplate",
        redirect: "/logisticsTools/freightTemplate/freightView",
        meta: { title: "运费管理", icon: "table", isVisited: true },
        component: () => import("@/views/logisticsTools/freight/freightView"),
        children: [
          {
            path: "freightView",
            name: "freightView",
            component: () =>
              import("@/views/logisticsTools/freight/freightView"),
            meta: { title: "运费列表", icon: "table", isVisited: true }
          },
          {
            path: "newFreight",
            name: "newFreight",
            component: () =>
              import("@/views/logisticsTools/freight/newFreight"),
            meta: { title: "新增运费", icon: "table", isVisited: false }
          }
        ]
      }
    ]
  },
  // 高山
  {
    path: "/gaoshan",
    component: Layout,
    redirect: "/gaoshan/dictionary",
    name: "gaoshanView",
    meta: { title: "高山管理", icon: "example", isVisited: true },
    children: [
      {
        path: "dictionaryTemplate",
        name: "dictionaryTemplate",
        redirect: "/gaoshan/dictionaryTemplate/dictionary",
        meta: { title: "团长管理", icon: "table", isVisited: true },
        component: () => import("@/views/gaoshan/dictionary/template"),
        children: [
          {
            path: "dictionary",
            name: "dictionary",
            component: () => import("@/views/gaoshan/dictionary/index"),
            meta: { title: "数据字典", icon: "table", isVisited: true }
          },
          {
            path: "childDictionary",
            name: "childDictionary",
            component: () => import("@/views/gaoshan/dictionary/childView"),
            meta: { title: "字典详情", icon: "table", isVisited: false }
          }
        ]
      },
      {
        path: "organization",
        name: "organization",
        component: () => import("@/views/gaoshan/organization/index"),
        meta: { title: "组织架构", icon: "table", isVisited: true }
      }
    ]
  },
  //会员管理
  {
    path: "/member",
    component: Layout,
    redirect: "/member/memberGroup",
    name: "member",
    meta: { title: "会员管理", icon: "example", isVisited: true },
    children: [
      {
        path: "memberGroup",
        name: "memberGroup",
        component: () => import("@/views/member/memberGroup/index"),
        meta: { title: "会员分组", icon: "table", isVisited: true }
      },
      {
        path: "testTable",
        name: "testTable",
        component: () => import("@/views/member/testTable/index"),
        meta: { title: "合并单元格测试", icon: "table", isVisited: true }
      },
      {
        path: "memberList",
        name: "memberList",
        component: () => import("@/views/member/memberList/index"),
        meta: { title: "会员列表", icon: "table", isVisited: true }
      }
    ]
  },
  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" }
      }
    ]
  },
  //团购
  {
    path: "/teamBuy",
    component: Layout,
    redirect: "/teamBuy/teamTemplate",
    name: "teamBuy",
    meta: { title: "团购管理", icon: "example" },
    children: [
      {
        path: "teamTemplate",
        name: "teamTemplate",
        redirect: "/teamBuy/teamTemplate/team",
        meta: { title: "团长管理", icon: "table", isVisited: true },
        component: () => import("@/views/teamBuy/team/template"),
        children: [
          {
            path: "team",
            name: "team",
            component: () => import("@/views/teamBuy/team/index"),
            meta: { title: "团长列表", icon: "tree", isVisited: true }
          },
          {
            path: "newTeam",
            name: "newTeam",
            component: () => import("@/views/teamBuy/team/newTeam"),
            meta: { title: "新建团长", icon: "table", isVisited: true }
          }
        ]
      },
      {
        path: "vendorTemplate",
        name: "vendorTemplate",
        redirect: "/teamBuy/vendorTemplate/vendor",
        meta: { title: "团长管理", icon: "table", isVisited: true },
        component: () => import("@/views/teamBuy/vendor/template"),
        children: [
          {
            path: "vendor",
            name: "vendor",
            component: () => import("@/views/teamBuy/vendor/index"),
            meta: { title: "供应商列表", icon: "tree", isVisited: true }
          },
          {
            path: "newVendor",
            name: "newVendor",
            component: () => import("@/views/teamBuy/vendor/newVendor"),
            meta: { title: "新建供应商列表", icon: "table", isVisited: true }
          },
          {
            path: "editVendor",
            name: "editVendor",
            component: () => import("@/views/teamBuy/vendor/editVendor"),
            meta: { title: "编辑供应商列表", icon: "table", isVisited: true }
          }
        ]
      },
      {
        path: "withdraw",
        name: "withdraw",
        component: () => import("@/views/teamBuy/withdraw/index"),
        meta: { title: "提现管理", icon: "tree", isVisited: true }
      },
      {
        path: "commission",
        name: "commission",
        component: () => import("@/views/teamBuy/commission/index"),
        meta: { title: "佣金列表", icon: "tree", isVisited: true }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  mode: "hash", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
