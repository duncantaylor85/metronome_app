<template>
  <div class="edit-bars">
    <h1>Edit Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        edit: {{ bars }} bars exist
        <v-btn fab><v-icon x-large>mdi-pencil</v-icon></v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getters } from "@/store/store.js"
export default {
  name: "EditBars",
  computed: {
    bars() {
      return getters.barCount // just using the getter property for a laugh;
    },
  },
};
</script>
