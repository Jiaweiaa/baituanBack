<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :collapse="isCollapse"
      :show-timeout="200"
      :default-active="activeIndex ? activeIndex :'0-0' "
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
      :unique-opened="true"
      router
    >
      <el-submenu :index="index+ ''" v-for="(item, index) in menuList" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.menuName}}</span>
        </template>
        <el-menu-item
          @click="setActive(index + '-' + childIndex)"
          v-for="(child, childIndex) in item.subMenu"
          :key="child.id"
          :route="child.route"
          v-show="checkHidden(child)"
          :index="index + '-' + childIndex">
          {{child.menuName}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import { loginAfter } from "@/api/login";

export default {
  mounted() {
    let activeIndex = sessionStorage.getItem("menuActiveIndex");
    if(activeIndex !== '') {
      this.activeIndex = activeIndex;
    }
    this.getRoutes();
    loginAfter()
      .then(res => {
        if (res.code == "200") {
          let menuList = res.result.menuList;
          this.$store.dispatch('setMenuList', menuList);
          this.menuList = this.$store.state.menu.menuList;
          this.menuList.forEach(item => {
            item.route = {
              path: item.vueRouter
            };
            if(item.subMenu.length > 0) {
              item.subMenu.forEach(childItem => {
                childItem.route = {
                  path: item.url +  childItem.url
                };
              })
            }
          })
        }
      }).catch(err => {});

  },
  data() {
    return {
      menuList: '',
      activeIndex: '',
      indexPath: [],
      routerList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes;
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    checkHidden(val) {
     if(val !== '') {
      if(this.routerList[this.indexPath.indexOf(val.url)]) {
        if(this.routerList[this.indexPath.indexOf(val.url)].hidden) {
          return false;
        }else {
          return true;
        }
      }else {
        return true;
      }
     }else {
       return true;
      }

    },

    getRoutes() {
      this.$router.options.routes.forEach(val => {
        if(val.children) {
          val.children.forEach(val2 => {
            val2.path = '/' + val2.path;
            this.indexPath.push(val2.path);
            this.routerList.push(val2);
          })
        }
      })
    },

    setActive(index) {
      sessionStorage.setItem('menuActiveIndex', index)
    }
  }
}
</script>
<style lang="sass">
  #app .hideSidebar .el-submenu > .el-submenu__title
    padding-left: 5px!important
</style>
