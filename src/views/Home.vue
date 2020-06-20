<template>
  <div class="home">
    <v-app-bar flat height="150">
      <div class="d-flex">
        <audio ref="highBeep" src="@/assets/highBeep.mp3"></audio>
        <audio ref="lowBeep" src="@/assets/lowBeep.mp3"></audio>
        <v-card class="d-flex pr-2 pt-1" height="100">
          <div class="mx-2 mt-2 mr-4">
            <v-select v-model="countInLength" :items="countInLengths" type="number" label="How many bars count in?"></v-select>
            <v-switch v-model="countInToggle" inset label="Count-in"></v-switch>
          </div>

          <div class="pt-1">
            <v-btn @click="playbackCoordinator.startPlaying()"><v-icon large>mdi-play</v-icon></v-btn>
            <v-btn @click="playbackCoordinator.pausePlaying()"><v-icon large>mdi-pause</v-icon></v-btn>
            <v-btn @click="playbackCoordinator.rewind()"><v-icon large>mdi-rewind</v-icon></v-btn>
          </div>
        </v-card>
        <v-card class="ml-6">
          <v-tabs v-model="menuData.tabSelected">
            <v-tab v-for="mode in menuButtonModes" :key="mode" @click="selectMode(mode)">{{ menuData.menuButtons[mode].label }}</v-tab>
          </v-tabs>
        </v-card>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <MusicRendering :subButtonStatus="menuData.subButtonStatus" :key="rerender" ref="musicRendering" />
        <AddBarsDialog :toggleAddBarsModal="addBarsData.dialog" @close-dialog="closeAddDialog" />
        <EditBarDialog :toggleEditBarModal="editBarData.dialog" :barNumber="editBarData.barNumber" :barTimeSig="editBarData.barTimeSig" @close-dialog="closeEditDialog" />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import MusicRendering from "@/components/MusicRendering.vue";
import AddBarsDialog from "@/components/AddBarsDialog.vue";
import EditBarDialog from "@/components/EditBarDialog.vue";
import { bus } from "../main";
import { TimeSignature, BPM, BarSequence, BasicDuration } from "@/libraries/DomainModel.js";

import { mutators, getters } from "@/store/store.js";
import { CountInController, UserPositionController, PlaybackCoordinator } from "@/libraries/PlaybackModel.js";
import { setupMenuButtons, selectDefaultTab } from "@/libraries/MenuSetup.js";

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
        dialog: false,
      },
      editBarData: {
        dialog: false,
        barNumber: null,
        barTimeSig: {},
      },
      rerender: true,
      playbackCoordinator: null,
      countInToggle: false,
      countInLengths: [1, 2, 4, 8],
      countInLength: 2,
      barHighlighter: null,
      countInInterface: null,
    };
  },
  watch: {
    countInToggle(newVal) {
      this.countInInterface.toggleCountIn(newVal);
      console.log(this.countInInterface);
    },
    countInLength(newVal) {
      this.countInInterface.changeCountInLength(newVal);
      console.log(this.countInInterface);
    },
  },
  methods: {
    deleteBar(barNumber) {
      mutators.deleteBar(barNumber);
      bus.$emit("change-gradient-array");
    },

    displayAddBarsDialog() {
      this.addBarsData.dialog = true;
    },
    displayEditBarDialog(barNumber) {
      this.editBarData.barNumber = barNumber;
      this.editBarData.dialog = true;
      this.editBarData.barTimeSig = getters.getTimeSigOf(barNumber);
    },
    closeAddDialog() {
      this.addBarsData.dialog = false;
    },
    closeEditDialog() {
      this.editBarData.dialog = false;
      this.rerender = !this.rerender;
    },

    selectMode(mode) {
      this.menuData.subButtonStatus = this.menuData.menuButtons[mode].subButtonStatus;
    },
  },
  beforeCreate() {},
  created() {
    setupMenuButtons(this);
  },
  beforeMount() {},
  mounted() {
    const barHighlighter = this.$refs.musicRendering.getBarHighlighter();
    const timeRepresentationProvider = {
      getTimeRepresentation: getters.getTimeRepresentation,
    };
    const highBeep = this.$refs.highBeep;
    const lowBeep = this.$refs.lowBeep;
    const clickProvider = {
      playHigh() {
        highBeep.play();
      },
      playLow() {
        lowBeep.play();
      },
    };

    const playbackCoordinator = new PlaybackCoordinator(clickProvider, timeRepresentationProvider, barHighlighter);
    this.playbackCoordinator = playbackCoordinator;
    this.countInInterface = this.playbackCoordinator.getCountInInterface();
    selectDefaultTab(this);
  },
  computed: {
    menuButtonModes() {
      return Object.keys(this.menuData.menuButtons);
    },
  },
  components: {
    MusicRendering: MusicRendering,
    AddBarsDialog: AddBarsDialog,
    EditBarDialog: EditBarDialog,
  },
};
</script>
