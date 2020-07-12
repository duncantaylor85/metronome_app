<template>
  <div class="add-bars-dialog">
    <v-row justify="center">
      <v-dialog v-model="toggleAddBarsModal" max-width="400" @click:outside="closeDialog">
        <v-card>
          <v-card-title>Add Bars:</v-card-title>
          <v-card-text>
            <v-text-field v-model.number="addBarsData.amountOfBars" label="How many bars?"></v-text-field>
            <v-text-field label="Numerator" v-model.number="addBarsData.numerator"></v-text-field>
            <v-select :items="addBarsData.denominators" label="Denominator" v-model.number="addBarsData.denominatorSelected" value="4"></v-select>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" text color="blue">Cancel</v-btn>
            <v-btn @click="addBars" text color="blue">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mutators, getters } from "@/store/store.js";
import { TimeSignature, BPM, BasicDuration } from "@/libraries/DomainModel.js";
import { bus } from "../main";

export default {
  name: "AddBarsDialog",
  props: ["toggleAddBarsModal"],
  data() {
    return {
      addBarsData: {
        amountOfBars: 4,
        numerator: 4,
        denominators: [1, 2, 4, 8, 16, 32],
        denominatorSelected: 4,
      },
    };
  },
  methods: {
    addBars() {
      mutators.addBars({
        timeSig: new TimeSignature(this.addBarsData.numerator, BasicDuration.fromInteger(this.addBarsData.denominatorSelected)),
        bpm: new BPM(120, BasicDuration._4th),
        amountOfBars: this.addBarsData.amountOfBars,
      });

      bus.$emit("change-gradient-array");
      bus.$emit("change-userMark-array");
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>
