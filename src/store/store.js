import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    bars: [
      {
        timeSig: { numerator: 4, denominator: 4 },
        bpm: { perMinute: 120, denominator: 4 },
      },
      {
        timeSig: { numerator: 4, denominator: 4 },
        bpm: { perMinute: 120, denominator: 4 },
      },
      {
        timeSig: { numerator: 3, denominator: 4 },
        bpm: { perMinute: 120, denominator: 4 },
      },
      {
        timeSig: { numerator: 3, denominator: 4 },
        bpm: { perMinute: 120, denominator: 4 },
      },
    ],
  },
  getters: {
    getBars: (state) => {
      return state.bars;
    },
  },
  mutations: {
    addBar: (state, payload) => {
      for (let i = 0; i < payload.amountOfBars; i++) {
        let newObject = { timeSig: payload.timeSig, bpm: payload.bpm };
        state.bars.push(newObject);
      }
    },
  },
  actions: {
    addBar: (context, payload) => {
      context.commit("addBar", payload);
    },
  },
});
