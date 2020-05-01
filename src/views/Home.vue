<template>
  <div class="home">
    <h1>Playback</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        home: {{ bars }} bars exist
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { mutators, getters } from "@/store/store.js"
export default {
  name: "Home",
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    bars() {
      return getters.getBarCount();
    },
  },
};
</script>
