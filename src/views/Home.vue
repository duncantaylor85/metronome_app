<template>
  <div class="home">
    <v-app-bar flat>
      <div class="d-flex">
        <v-card>
          <v-btn><v-icon large>mdi-pause</v-icon></v-btn>
          <v-btn><v-icon large>mdi-play</v-icon></v-btn>
          <v-btn><v-icon large>mdi-stop</v-icon></v-btn>

          <!-- <v-btn
            
            v-for="mode in menuButtonModes"
            :key="mode"
            @click="selectMode(mode)"
          >
            {{ menuData.menuButtons[mode].label }}
          </v-btn> -->
        </v-card>
        <v-card>
          <v-tabs>
            <v-tab
              v-for="mode in menuButtonModes"
              :key="mode"
              @click="selectMode(mode)"
              >{{ menuData.menuButtons[mode].label }}</v-tab
            >
          </v-tabs>
        </v-card>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-row class="d-flex flex-wrap">
          <MusicRendering />
          <!-- <v-btn v-if="barCount == 0"
            ><v-icon @click="displayAddBarsDialog"
              >mdi-plus-circle</v-icon
            ></v-btn
          >
          <v-img
            v-for="(bar, index) in barCount"
            :key="index"
            class="mb-7"
            max-width="177"
            src="@/assets/singlebar.jpg"
            ><p class="ml-1 my-0 font-weight-bold">
              {{ getTimeSigNumeratorOf(bar) }}
            </p>
            <p class="ml-1 my-0 font-weight-bold">
              {{ getTimeSigDenominatorOf(bar) }}
            </p>
            <div class="d-flex">
              <v-btn
                small
                fab
                v-if="menuData.subButtonStatus.visibility"
                @click="menuData.subButtonStatus.executeFunction(bar)"
                ><v-icon>{{ menuData.subButtonStatus.icon }}</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </div>
          </v-img> -->
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="addBarsData.dialog" max-width="400">
            <v-card>
              <v-card-title>Add Bars:</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model.number="addBarsData.amountOfBars"
                  label="How many bars?"
                ></v-text-field>
                <v-text-field
                  label="Numerator"
                  v-model.number="addBarsData.numerator"
                ></v-text-field>
                <v-select
                  :items="addBarsData.denominators"
                  label="Denominator"
                  v-model.number="addBarsData.denominatorSelected"
                  value="4"
                ></v-select>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="addBarsData.dialog = false" text color="blue"
                  >Cancel</v-btn
                >
                <v-btn @click="addBars" text color="blue">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import MusicRendering from "@/components/MusicRendering.vue"

import {
  TimeSignature,
  BPM,
  BarSequence,
  BasicDuration,
} from "@/libraries/DomainModel.js";

import { mutators, getters } from "@/store/store.js";

export default {
  name: "Home",
  data() {
    return {
      menuData: {
        menuButtons: [],
        subButtonStatus: {},
      },
      addBarsData: {
        amountOfBars: 4,
        numerator: 4,
        denominators: [1, 2, 4, 8, 16, 32],
        denominatorSelected: 4,
        dialog: false,
      },
    };
  },
  methods: {
    addBars() {
      // Replaced $store.mutators
      mutators.addBars({
        timeSig: new TimeSignature(
          this.addBarsData.numerator,
          BasicDuration.fromInteger(this.addBarsData.denominatorSelected)
        ),
        bpm: new BPM(
          120,
          BasicDuration.fromInteger(this.addBarsData.denominatorSelected)
        ),
        amountOfBars: this.addBarsData.amountOfBars,
      });
      this.addBarsData.dialog = false;
      console.log(this.barCount);
    },
    deleteBar(barNumber) {
      mutators.deleteBar(barNumber);
    },
    displayAddBarsDialog() {
      this.addBarsData.dialog = true;
    },

    selectMode(mode) {
      this.menuData.subButtonStatus = this.menuData.menuButtons[
        mode
      ].subButtonStatus;
    },

    assignSubButtonStatus(visibility, icon, executeFunction) {
      return {
        visibility,
        icon,
        executeFunction,
      };
    },
    initialiseMenuButtons(
      label,
      mode,
      subButtonIcon,
      subButtonExecuteFunction
    ) {
      return {
        label,
        mode,
        subButtonStatus: this.assignSubButtonStatus(
          subButtonIcon !== "",
          subButtonIcon,
          subButtonExecuteFunction
        ),
      };
    },
  },
  created() {
    this.menuData.menuButtons = [];
    const menuButtonsToLoad = [
      // note: (barNumber) => this.addBar(barNumber)    is equivalent to    this.addBar
      // so if we want we can reduce those to just direct references, e.g.
      //  this.initialiseMenuButtons("Add", "add", "mdi-plus-circle", this.addBar),
      this.initialiseMenuButtons("Home", "home", "", (barNumber) => {}),
      this.initialiseMenuButtons(
        "Add",
        "add",
        "mdi-plus-circle",
        this.displayAddBarsDialog
      ),
      this.initialiseMenuButtons("Edit", "edit", "mdi-pencil", this.editBar),
      this.initialiseMenuButtons(
        "Delete",
        "delete",
        "mdi-minus-circle",
        this.deleteBar
      ),
    ];

    menuButtonsToLoad.forEach((menuButton) => {
      this.menuData.menuButtons[menuButton.mode] = menuButton;
    });
  },
  computed: {
    menuButtonModes() {
      return Object.keys(this.menuData.menuButtons);
    },
    // barCount: function() {
    //   return getters.getBarCount();
    // },
  },
  components: {
    "MusicRendering": MusicRendering
  }
};
</script>
