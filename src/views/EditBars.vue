<template>
  <div class="edit-bars">
    <h1>Edit Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <v-img
          v-for="n in bars"
          :key="n"
          class="mb-7"
          max-width="170"
          src="@/assets/singlebar.jpg"
        ></v-img>
        <v-btn fab><v-icon x-large>mdi-pencil</v-icon></v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "EditBars",
  computed: {
    bars() {
      return this.$store.getters.getBars;
    }
  }
};
</script>
