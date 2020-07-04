import Vue from "vue";
import { BarSequence, SimpleBeatSequenceCreator } from "@/libraries/DomainModel.js";
import { PlaybackCoordinator } from "../libraries/PlaybackModel";


/*
  Adapted from https://vuedose.tips/tips/creating-a-store-without-vuex-in-vue-js-2-6/
  
  The store is kept private by not exporting it, so it's not available directly to code outside
  
  all modifications and retrievals have to be done via `mutators` and `getters`

  usage: 
  import {mutators, getters} from "@/store/store.js"
  
  then
  mutators.addBars({ timeSig, bpm, amountOfBars})
  mutators.deleteBar(barNumber)
  mutators.editBar({ barNumber, newTimeSig, newBpm })

  getters.getTimeSigOf(barNumber)
  getters.getTempoOf(barNumber)
  getters.getBarCount()

*/

const store = Vue.observable({
  barSequence: new BarSequence(),
  playback: new PlaybackCoordinator()
});

export const mutators = {
  addBars({ timeSig, bpm, amountOfBars }) {
    store.barSequence.addBarsToEnd(timeSig, bpm, amountOfBars);
  },
  deleteBar(barNumber) {
    store.barSequence.deleteBar(barNumber);
  },
  // to replace the bar at the given bar number, call with an object containing the bar number, a replacement TimeSignature, and a replacement BPM
  // requires 1 <= barNumber <= getBarCount()
  editBar({ barNumber, newTimeSig, newBpm }) {
    store.barSequence.replaceBar(barNumber, newTimeSig, newBpm);
  },
};

export const getters = {
  getTimeSigOf(barNumber) {
    return store.barSequence.getTimeSigOf(barNumber);
  },
  getTempoOf(barNumber) {
    return store.barSequence.getTempoOf(barNumber);
  },
  getBarCount() {
    return store.barSequence.getBarCount();
  },
  getTimeRepresentation() {
    return store.barSequence.getTimeRepresentation(new SimpleBeatSequenceCreator())
  }

};

export const playbackModel = {
  setup
}
