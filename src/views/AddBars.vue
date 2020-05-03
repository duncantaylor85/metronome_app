<template>
  <div class="add-bars">
    <h1>Add Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <v-img
          v-for="(bar, i) in barCount"
          :key="i"
          class="mb-7"
          max-width="177"
          src="@/assets/singlebar.jpg"
        >
          <p class="ml-1 my-0 font-weight-bold">
            {{ getTimeSigNumeratorOf(bar) }}
          </p>
          <p class="ml-1 my-0 font-weight-bold">
            {{ getTimeSigDenominatorOf(bar) }}
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
import {
  TimeSignature,
  BPM,
  BarSequence,
  BasicDuration,
} from "@/libraries/DomainModel.js";

// Added import to import the store mutations and getters
import { mutators, getters } from "@/store/store.js";

export default {
  name: "AddBars",
  data() {
    return {
      amountOfBars: 4,
      numerator: 4,
      denominators: [1, 2, 4, 8, 16, 32],
      denominatorSelected: 4,
      dialog: false,
    };
  },
  methods: {
    addBar() {
      // Replaced $store.mutators
      mutators.addBars({
        timeSig: new TimeSignature(
          this.numerator,
          BasicDuration.fromInteger(this.denominatorSelected)
        ),
        bpm: new BPM(120, BasicDuration.fromInteger(this.denominatorSelected)),
        amountOfBars: this.amountOfBars,
      });
      this.dialog = false;
    },
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
      // replaces $store.getters
      return getters.getBarCount();

      // Or we could use the line
      // return getters.barCount
      // using the getter definition in the file
    },
  },
};
</script>
