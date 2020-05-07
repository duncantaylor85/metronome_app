<template>
    <div class="music-renderer">
        <v-btn v-if="barCount == 0"
            ><v-icon @click="displayAddBarsDialog"
              >mdi-plus-circle</v-icon
            ></v-btn
          >
          <v-img
            v-for="(bar, index) in barCount"
            :key="index"
            class="mb-7"
            max-width="177"
            src="@/assets/singlebar.jpg"
            ><p class="ml-1 my-0 font-weight-bold">
              {{ getTimeSigNumeratorOf(bar) }}
            </p>
            <p class="ml-1 my-0 font-weight-bold">
              {{ getTimeSigDenominatorOf(bar) }}
            </p>
            <div class="d-flex">
              <v-btn
                small
                fab
                v-if="menuData.subButtonStatus.visibility"
                @click="menuData.subButtonStatus.executeFunction(bar)"
                ><v-icon>{{ menuData.subButtonStatus.icon }}</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </div>
          </v-img>
    </div>
</template>
<script>
import { getters } from "@/store/store.js"
export default {
  name: "MusicRendering",
  data() {
      return { }
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
  },
  computed: {
    barCount: function() {
      return getters.getBarCount();
    },
  }
}
</script>