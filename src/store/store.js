import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    bars: 20
  },
  getters: {
    getBars: state => {
      return state.bars;
    }
  },
  mutations: {
    addBar: state => {
      state.bars++;
    }
  },
  actions: {
    addBar: context => {
      context.commit("addBar");
    }
  }
});
