<template>
  <div class="home">
    <h1>Playback</h1>
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    bars() {
      return this.$store.getters.getBars;
    },
  },
};
</script>
