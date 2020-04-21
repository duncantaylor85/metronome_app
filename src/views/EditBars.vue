<template>
  <div class="edit-bars">
    <h1>Edit Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <v-img
          v-for="(bar, index) in bars"
          :key="index"
          class="mb-7"
          max-width="177"
          src="@/assets/singlebar.jpg"
          ><p class="ml-1 my-0 font-weight-bold">{{ bar.timeSig.numerator }}</p>
          <p class="ml-1 my-0 font-weight-bold">
            {{ bar.timeSig.denominator }}
          </p>
        </v-img>
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
    },
  },
};
</script>
