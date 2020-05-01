import Vue from "vue";
import {  BarSequence  } from "@/libraries/DomainModel.js"

/*
  Adapted from https://vuedose.tips/tips/creating-a-store-without-vuex-in-vue-js-2-6/
  
  The store is kept private by not exporting it, so it's not available directly to code outside
  
  all modifications and retrievals have to be done via `mutators` and `getters`

  usage: 
  import {mutators, getters} from "@/store/store.js"
  
  then
  mutators.addBars({ timeSig, bpm, amountOfBars})

  getters.getTimeSigOf(barNum)
  getters.getBarCount()

  Also 
  `getters.barCount` is equivalent to `getters.getBarCount()`,
  it's testing out a getter property, from
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get

  (just because the syntax is a little bit nicer, wanted to see if it worked!)
*/


const store = Vue.observable({
    barSequence: new BarSequence()
});


export const mutators = {
  addBars({ timeSig, bpm, amountOfBars }) {
    store.barSequence.addBarsToEnd(timeSig, bpm, amountOfBars)
  }
}

export const getters = {
  getTimeSigOf: function (barNum) {
    return store.barSequence.getTimeSigOf(barNum)
  },
  getBarCount: function () {
    return store.barSequence.getBarCount()
  },

  // Just a test of getter properties, see comment block at top
  get barCount() {
    return store.barSequence.getBarCount()
  }
}
