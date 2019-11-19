const menu = {
  state: {
    menuList: []
  },
  mutations: {
    SET_MENULIST(state, result) {
      state.menuList = result;
    }
  },
  actions: {
    setMenuList({ commit }, view) {
      commit("SET_MENULIST", view);
    },
  }
};

export default menu;
