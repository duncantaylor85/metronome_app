<template>
  <div class="home">
    <v-app-bar flat>
      <div class="d-flex">
        <v-card>
          <v-btn><v-icon large>mdi-pause</v-icon></v-btn>
          <v-btn><v-icon large>mdi-play</v-icon></v-btn>
          <v-btn><v-icon large>mdi-stop</v-icon></v-btn>
        </v-card>
        <v-card>
          <v-tabs v-model="menuData.tabSelected">
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
        <MusicRendering :subButtonStatus="menuData.subButtonStatus" />
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
        tabSelected: 0,
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
    },
    deleteBar(barNumber) {
      mutators.deleteBar(barNumber);
    },
    displayAddBarsDialog() {
      this.addBarsData.dialog = true;
    },

    selectMode(mode) {
      this.menuData.subButtonStatus = this.menuData.menuButtons[mode].subButtonStatus;
    },

    assignSubButtonStatus(visibility, icon, executeFunction, noBarsBehaviour) {
      return {
        visibility,
        icon,
        executeFunction,
        noBarsBehaviour // null for no behaviour and don't draw a button; otherwise use the standard icon with the given behaviour
      };
    },
    initialiseMenuButtons(
      label,
      mode,
      subButtonIcon,
      subButtonExecuteFunction,
      subButtonNoBarsBehaviour
    ) {
      return {
        label,
        mode,
        subButtonStatus: this.assignSubButtonStatus(
          subButtonIcon !== "",
          subButtonIcon,
          subButtonExecuteFunction,
          subButtonNoBarsBehaviour
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
      this.initialiseMenuButtons("Home", "home", "", (barNumber) => {}, null),
      this.initialiseMenuButtons(
        "Add",
        "add",
        "mdi-plus-circle",
        this.displayAddBarsDialog,
        this.displayAddBarsDialog
      ),
      this.initialiseMenuButtons("Edit", "edit", "mdi-pencil", this.editBar, null),
      this.initialiseMenuButtons(
        "Delete",
        "delete",
        "mdi-minus-circle",
        this.deleteBar,
        null
      ),
    ];

    menuButtonsToLoad.forEach((menuButton) => {
      this.menuData.menuButtons[menuButton.mode] = menuButton;
    });

  },
  mounted() {
    let defaultButton = "add"
    let defaultButtonIndex = this.menuButtonModes.findIndex(v => v === defaultButton)
    this.menuData.tabSelected = defaultButtonIndex
    this.menuData.subButtonStatus = this.menuData.menuButtons[defaultButton].subButtonStatus
  },
  computed: {
    menuButtonModes() {
      return Object.keys(this.menuData.menuButtons);
    },
  },
  components: {
    "MusicRendering": MusicRendering
  }
};
</script>
