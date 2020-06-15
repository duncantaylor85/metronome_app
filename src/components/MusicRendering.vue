<template>
  <div class="music-renderer">
    <v-container>
      <v-row class="d-flex flex-wrap">
        <v-btn small fab v-if="barCount == 0 && subButtonStatus.noBarsBehaviour"
          ><v-icon @click="subButtonStatus.noBarsBehaviour">{{ subButtonStatus.icon }}</v-icon></v-btn
        >
        <v-img v-for="(bar, index) in barCount" :gradient="gradient[index]" @click="highlightNormal(bar)" :key="index" class="mb-7" max-width="177" src="@/assets/singlebar.jpg"
          ><p class="ml-1 my-0 font-weight-bold">
            {{ getTimeSigNumeratorOf(bar) }}
          </p>
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
import { getters } from "@/store/store.js";
import { bus } from "../main";
export default {
  name: "MusicRendering",
  data() {
    return {
      lastBarSelectedIndex: -1,
      gradient: [],
    };
  },
  methods: {
    getTimeSigNumeratorOf: function(bar) {
      // replaces $store.getters
      return getters.getTimeSigOf(bar).getNumerator();
    },
    getTimeSigDenominatorOf: function(bar) {
      // replaces $store.getters
      return getters.getTimeSigOf(bar).getDenominatorAsNumber();
    },
    insertHighlight(barNumberIndex, stringColour) {
      this.gradient.splice(barNumberIndex, 1, stringColour);
    },

    highlight(barNumber, colour) {
      let barNumberIndex = barNumber - 1;
      if (barNumberIndex === this.lastBarSelectedIndex) {
        if (this.gradient[barNumberIndex] === colour) {
          this.insertHighlight(barNumberIndex, "");
        } else {
          this.insertHighlight(barNumberIndex, 1, colour);
        }
      } else {
        this.insertHighlight(barNumberIndex, colour);
        if (this.lastBarSelectedIndex !== -1) {
          this.insertHighlight(this.lastBarSelectedIndex, "");
        }
      }
      this.lastBarSelectedIndex = barNumberIndex;
    },
    highlightNormal(barNumber) {
      this.highlight(barNumber, "rgba(100,115,201,.33), rgba(100,115,201,.33)");
    },
    highlightCountIn(barNumber) {
      this.highlight(barNumber, "rgba(211, 223, 0,.33), rgba(211, 223, 0,.33)");
    },
    getBarHighlighter() {
      return { highlightNormal: this.highlightNormal, highlightCountIn: this.highlightCountIn };
    },
  },
  computed: {
    barCount: function() {
      return getters.getBarCount();
    },
  },
  created() {
    bus.$on("change-gradient-array", () => {
      let tempArray = new Array(this.barCount);
      let gradient = tempArray.fill("");
      this.gradient = gradient;
    });
  },
  props: ["subButtonStatus"],
};
</script>
