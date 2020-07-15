<template>
  <div class="music-renderer">
    <v-container>
      <v-row class="d-flex flex-wrap">
        <v-btn small fab v-if="barCount == 0 && subButtonStatus.noBarsBehaviour"
          ><v-icon @click="subButtonStatus.noBarsBehaviour">{{ subButtonStatus.icon }}</v-icon></v-btn
        >
        <v-img v-for="(bar, index) in barCount" :gradient="gradient[index]" @click="selectBar(bar)" :key="index" class="mb-7" max-width="177" src="@/assets/singlebar.jpg"
          ><span class="ml-1 my-0 font-weight-bold">
            {{ getTimeSigNumeratorOf(bar) }}
          </span>
          <span class="indigo lighten-4" v-if="userMark[index]">▼</span>
          <p class="ml-1 my-0 font-weight-bold">
            {{ getTimeSigDenominatorOf(bar) }}
          </p>

          <v-btn class="mt-6 mr-n3" absolute top right small fab v-if="subButtonStatus.visibility" @click="subButtonStatus.executeFunction(bar)"
            ><v-icon>{{ subButtonStatus.icon }}</v-icon></v-btn
          >
        </v-img>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { getters, playbackModelSetup, playbackModel } from "@/store/store.js";
import { bus } from "../main";
export default {
  name: "MusicRendering",
  data() {
    return {
      userMark: [],
      gradient: [],
      normalHighlightColour: "rgba(100,115,201,.33), rgba(100,115,201,.33)",
      countInHighlightColour: "rgba(211, 223, 0,.33), rgba(211, 223, 0,.33)",
      userPositionInterface: null,
    };
  },
  methods: {
    markBar(barNumber) {
      this.userMark.splice(barNumber - 1, 1, true);
    },
    unmarkBar(barNumber) {
      this.userMark.splice(barNumber - 1, 1, false);
    },
    selectBar(barNumber) {
      this.userPositionInterface.changeUserPosition(barNumber);
    },
    getTimeSigNumeratorOf: function(bar) {
      // replaces $store.getters
      return getters.getTimeSigOf(bar).getNumerator();
    },
    getTimeSigDenominatorOf: function(bar) {
      // replaces $store.getters
      return getters.getTimeSigOf(bar).getDenominatorAsNumber();
    },
    insertHighlight(barNumber, stringColour) {
      this.gradient.splice(barNumber - 1, 1, stringColour);
    },
    highlightNormal(barNumber) {
      this.insertHighlight(barNumber, this.normalHighlightColour);
    },
    highlightCountIn(barNumber) {
      this.insertHighlight(barNumber, this.countInHighlightColour);
    },
    getBarMarker() {
      return {
        markBar: (barNum) => this.markBar(barNum),
        unmarkBar: (barNum) => this.unmarkBar(barNum),
      };
    },
    getBarHighlighter() {
      return {
        highlightNormal: (barNum) => this.highlightNormal(barNum),
        highlightCountIn: (barNum) => this.highlightCountIn(barNum),
        cancelHighlight: (barNum) => this.cancelHighlight(barNum),
        clearAllHighlights: () => this.clearAllHighlights(),
      };
    },
    clearAllHighlights() {
      this.clearGradientArray();
    },
    cancelHighlight(barNumber) {
      this.insertHighlight(barNumber, "");
    },
    clearGradientArray() {
      let tempArray = new Array(this.barCount);
      let gradient = tempArray.fill("");
      this.gradient = gradient;
    },
    clearUserMarkArray() {
      let tempArray = new Array(this.barCount);
      let userMark = tempArray.fill(false);
      this.userMark = userMark;
    },
  },
  computed: {
    barCount: function() {
      return getters.getBarCount();
    },
  },
  mounted() {
    this.userPositionInterface = playbackModel.getUserPositionInterface();
  },
  created() {
    bus.$on("change-gradient-array", () => this.clearGradientArray());
    bus.$on("change-userMark-array", () => this.clearUserMarkArray());
    playbackModelSetup.setBarHighlighter(this.getBarHighlighter());
    playbackModelSetup.setMarker(this.getBarMarker());
    playbackModelSetup.setup();
  },
  beforeUpdate() {},
  updated() {},
  props: ["subButtonStatus"],
};
</script>
