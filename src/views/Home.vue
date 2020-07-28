<template>
  <div class="home">
    <v-app-bar flat height="150">
      <div class="d-flex">
        <audio id="highBeep" src="@/assets/highBeep.mp3"></audio>
        <audio id="lowBeep" src="@/assets/lowBeep.mp3"></audio>
        <v-card class="d-flex pr-2 pt-1" height="100">
          <div class="mx-2 mt-2 mr-4">
            <v-select v-model="countInLength" :items="countInLengths" type="number" label="How many bars count in?"></v-select>
            <v-switch v-model="countInToggle" inset label="Count-in"></v-switch>
          </div>

          <div class="pt-1">
            <v-btn @click="playPause"
              ><v-icon large>{{ playPauseButton.icon }}</v-icon></v-btn
            >
            <v-btn @click="rewind()"><v-icon large>mdi-rewind</v-icon></v-btn>
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
        <MusicRendering :subButtonStatus="menuData.subButtonStatus" ref="musicRendering" />
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

import { mutators, getters, playbackModelSetup, playbackModel } from "@/store/store.js";
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

      countInToggle: false,
      countInLengths: [1, 2, 4, 8],
      countInLength: 2,
      barHighlighter: null,
      countInInterface: null,
      playbackInterface: null,
      positionInterface: null,
      barNumber: null,
      playPauseButton: {
        status: "paused",
        icon: "mdi-play",
      },
    };
  },
  watch: {
    countInToggle(newVal) {
      this.countInInterface.toggleCountIn(newVal);
    },
    countInLength(newVal) {
      this.countInInterface.changeCountInLength(newVal);
    },
  },
  methods: {
    play() {
      if (getters.getBarCount() > 0) {
        this.playbackInterface.startPlaying();
        this.playPauseButton.status = "playing";
        this.playPauseButton.icon = "mdi-pause";
        this.selectMode("home");
        this.menuData.tabSelected = 0;
      } else {
        if (this.menuData.tabSelected !== "1") {
          this.selectMode("add");
          this.menuData.tabSelected = 1;
        }
        bus.$emit("animate-plus-button");
        console.log("need to do something when play is clicked without bars");
      }
    },
    pause() {
      this.playbackInterface.pausePlaying();
      this.playPauseButton.status = "paused";
      this.playPauseButton.icon = "mdi-play";
    },
    playPause() {
      if (this.playPauseButton.status === "paused") {
        this.play();
      } else {
        this.pause();
      }
    },
    rewind() {
      if (getters.getBarCount() > 0) {
        this.selectMode("home");
        this.menuData.tabSelected = 0;
        this.playbackInterface.rewind();
      } else {
        if (this.menuData.tabSelected !== "1") {
          this.selectMode("add");
          this.menuData.tabSelected = 1;
        }
        bus.$emit("animate-plus-button");
        console.log("need to do something when rewind is clicked without bars");
      }
    },
    deleteBar(barNumber) {
      mutators.deleteBar(barNumber);      
      this.positionInterface.updateCurrentPlayPositionOnDelete(barNumber)
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
    },

    selectMode(mode) {
      this.menuData.subButtonStatus = this.menuData.menuButtons[mode].subButtonStatus;
      if (mode !== "home" && this.playPauseButton.status === "playing") {
        this.playPause();
      }
      // Remove current user marking and current position highlight if moving to a non-"home" mode
      if (mode !== "home") {
        this.positionInterface.clearMarkAndHighlight()
      }
      else {
        this.positionInterface.applyMarkAndHighlight()
      }
    },
  },
  beforeCreate() {},
  created() {
    setupMenuButtons(this);
    let self = this;
    const homeInterface = {
      changePauseToPlay() {
        self.playPauseButton.status = "paused";
        self.playPauseButton.icon = "mdi-play";
      },
    };
    playbackModelSetup.setHomeInterface(homeInterface);
  },
  beforeMount() {},
  mounted() {
    this.countInInterface = playbackModel.getCountInInterface();
    this.playbackInterface = playbackModel.getPlaybackInterface();
    this.positionInterface = playbackModel.getUserPositionInterface();
    selectDefaultTab(this);
    this.countInInterface.changeCountInLength(this.countInLength);
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
