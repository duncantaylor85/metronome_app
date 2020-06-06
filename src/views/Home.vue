<template>
  <div class="home">
    <v-app-bar flat>
      <div class="d-flex">
        <audio ref="highBeep" src="@/assets/highBeep.mp3"></audio>
        <audio ref="lowBeep" src="@/assets/lowBeep.mp3"></audio>

        <v-card>
          <v-btn><v-icon large>mdi-pause</v-icon></v-btn>
          <v-btn><v-icon large>mdi-play</v-icon></v-btn>
          <v-btn><v-icon large>mdi-stop</v-icon></v-btn>
        </v-card>
        <v-card>
          <v-tabs v-model="menuData.tabSelected">
            <v-tab v-for="mode in menuButtonModes" :key="mode" @click="selectMode(mode)">{{ menuData.menuButtons[mode].label }}</v-tab>
          </v-tabs>
        </v-card>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <MusicRendering :subButtonStatus="menuData.subButtonStatus" :key="rerender" ref="musicRenderer" />
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

import { TimeSignature, BPM, BarSequence, BasicDuration } from "@/libraries/DomainModel.js";

import { mutators, getters } from "@/store/store.js";
import { CountInController, UserPositionController, PlaybackCoordinator } from "@/libraries/PlaybackModel.js";
import { setupMenuButtons, selectDefaultTab } from "@/libraries/MenuSetup.js";

export default {
  name: "Home",
  data() {
    return {
      i: 1,
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
    };
  },
  methods: {
    highlightIncrement() {
      const barHighlighter = this.$refs.musicRenderer.getBarHighlighter();
      barHighlighter.highlightCountIn(this.i);
      this.i++;
    },
    deleteBar(barNumber) {
      mutators.deleteBar(barNumber);
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
  beforeCreate() {
    const highBeep = this.$refs.highBeep;
    const lowBeep = this.$refs.lowBeep;
    const beeps = {
      playHigh() {
        highBeep.play();
      },
      playLow() {
        lowBeep.play();
      },
    };
  },
  created() {
    setupMenuButtons(this);
  },
  mounted() {
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
