<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!--/**-->
    <!--*-->
    <!--*-->
    <!--*   meta:-->
    <!--icon: "tree"-->
    <!--isVisited: true-->
    <!--title: "用户管理"-->

    <!--name: "userManage"-->
    <!--path: "userManage"-->
    <!--*-->
    <!--* @type {*|string|Array}-->
    <!--*/-->

    <template v-if="hasOneShowingChild(item.subMenu , item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.vueRouter)">
        <el-menu-item :index="resolvePath(onlyOneChild.vueRouter)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :meta="Object.assign({}, item.meta,onlyOneChild.meta)" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.vueRouter)" popper-append-to-body>
      <template slot="title">
        <item :meta="item.meta" />
      </template>
      <sidebar-item
        v-for="child in item.subMenu"
        :is-nest="true"
        :item="child"
        :key="child.vueRouter"
        :base-path="resolvePath(child.vueRouter)"
        class="nest-menu" />
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  mounted() {

  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if(children == []) return;
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
