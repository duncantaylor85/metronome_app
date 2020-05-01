<template>
  <div class="delete-bars">
    <h1>Delete Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        delete: {{ bars }} bars exist
        <v-btn fab><v-icon x-large>mdi-minus-circle</v-icon></v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getters } from "@/store/store.js"
export default {
  name: "DeleteBars",
  computed: {
    bars() {
      return getters.getBarCount();
    },
  },
};
</script>
