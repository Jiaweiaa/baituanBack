import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import menu from "./modules/menu";
import tagsView from "./modules/tagsView";
import createPersistedState from "vuex-persistedstate";
import getters from "./getters";


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    menu
  },
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        user: val.user,
        menu: val.menu
      }
    }
  })]
});

export default store;
