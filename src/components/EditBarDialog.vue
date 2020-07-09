<template>
  <div class="edit-bar-dialog">
    <v-row justify="center">
      <v-dialog
        v-model="toggleEditBarModal"
        max-width="400"
        @click:outside="closeDialog"
      >
        <v-card>
          <v-card-title>Edit Bars:</v-card-title>
          <v-card-text>
            <v-text-field
              label="Numerator"
              v-model.number="editBarData.numerator"
            ></v-text-field>
            <v-select
              :items="editBarData.denominators"
              label="Denominator"
              v-model.number="editBarData.denominatorSelected"
              value="4"
            ></v-select>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" text color="blue">Cancel</v-btn>
            <v-btn @click="editBar" text color="blue">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mutators, getters } from "@/store/store.js";
import { TimeSignature, BPM, BasicDuration } from "@/libraries/DomainModel.js";

export default {
  name: "EditBarDialog",
  props: ["toggleEditBarModal", "barNumber", "barTimeSig"],
  data() {
    return {
      editBarData: {
        numerator: this.barTimeSig.numerator,
        denominators: [1, 2, 4, 8, 16, 32],
        denominatorSelected: this.barTimeSig.denominator,
      },
    };
  },
  watch: {
    barTimeSig() {
      this.editBarData.numerator = this.barTimeSig.numerator;
      this.editBarData.denominatorSelected = this.barTimeSig.getDenominatorAsNumber();
    },
  },
  methods: {
    editBar() {
      mutators.editBar({
        barNumber: this.barNumber,
        newTimeSig: new TimeSignature(
          this.editBarData.numerator,
          BasicDuration.fromInteger(this.editBarData.denominatorSelected)
        ),
        newBpm: new BPM(
          120,
          BasicDuration._4th
        ),
      });
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>
