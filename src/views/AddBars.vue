<template>
  <div class="add-bars">
    <h1>Add Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <v-img
          v-for="(bar, index) in bars"
          :key="index"
          class="mb-7"
          max-width="177"
          src="@/assets/singlebar.jpg"
        >
          <p class="ml-1 my-0 font-weight-bold">
            {{ bar.timeSig.numerator }}
          </p>
          <p class="ml-1 my-0 font-weight-bold">
            {{ bar.timeSig.denominator }}
          </p>
        </v-img>
        <v-btn @click="dialog = true" fab
          ><v-icon x-large>mdi-plus-circle</v-icon></v-btn
        >
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title>Add Bars:</v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="amountOfBars"
                label="How many bars?"
              ></v-text-field>
              <v-text-field
                label="Numerator"
                v-model.number="numerator"
              ></v-text-field>
              <v-select
                :items="denominators"
                label="Denominator"
                v-model.number="denominatorSelected"
                value="4"
              ></v-select>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialog = false" text color="blue">Cancel</v-btn>
              <v-btn @click="addBar" text color="blue">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "AddBars",
  data() {
    return {
      amountOfBars: 1,
      numerator: 4,
      denominators: [1, 2, 4, 8, 16, 32],
      denominatorSelected: 4,
      dialog: false,
    };
  },
  methods: {
    addBar() {
      this.$store.dispatch("addBar", {
        timeSig: {
          numerator: this.numerator,
          denominator: this.denominatorSelected,
        },
        bpm: { perMinute: 120, denominator: this.denominatorSelected },
        amountOfBars: this.amountOfBars,
      });
      this.dialog = false;
    },
  },
  computed: {
    bars() {
      return this.$store.getters.getBars;
    },
  },
};
</script>
