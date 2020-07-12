import Vue from "vue";
import { BarSequence, SimpleBeatSequenceCreator } from "@/libraries/DomainModel.js";
import { PlaybackCoordinator, PlaybackBuilder } from "../libraries/PlaybackModel";

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
  playback: new PlaybackBuilder(),
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
    return store.barSequence.getTimeRepresentation(new SimpleBeatSequenceCreator());
  },
};

export const playbackModelSetup = {
  setBarHighlighter(barHighlighter) {
    if (store.playback instanceof PlaybackCoordinator) {
      store.playback.replaceBarHighlighter(barHighlighter);
    } else {
      store.playback.setBarHighlighter(barHighlighter);
    }
  },
  setMarker(barMarker) {
    store.playback.setBarMarker(barMarker);
  },

  setClickProvider(clickProvider) {
    if (store.playback instanceof PlaybackCoordinator) return;
    store.playback.setClickProvider(clickProvider);
  },

  setup() {
    if (store.playback instanceof PlaybackCoordinator) return;
    const timeRepresentationProvider = {
      getTimeRepresentation: getters.getTimeRepresentation,
    };
    store.playback.setTimeRepProvider(timeRepresentationProvider);
    store.playback = store.playback.setup();
  },
};

export const playbackModel = {
  getCountInInterface() {
    if (store.playback instanceof PlaybackBuilder) throw `Tried to getCountInInterface without running setup on the PlaybackBuilder`;
    return store.playback.getCountInInterface();
  },
  getPlaybackInterface() {
    if (store.playback instanceof PlaybackBuilder) throw `Tried to getPlaybackInterface without running setup on the PlaybackBuilder`;
    return store.playback.getPlaybackInterface();
  },
  getUserPositionInterface() {
    if (store.playback instanceof PlaybackBuilder) throw `Tried to getUserPositionInterface without running setup on the PlaybackBuilder`;
    return store.playback.getPositionInterface();
  },
};
