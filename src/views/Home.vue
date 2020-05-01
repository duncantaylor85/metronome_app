<template>
  <div class="home">
    <v-app-bar flat>
      <div class="d-flex">
        <v-card>
          <v-btn><v-icon large>mdi-pause</v-icon></v-btn>
          <v-btn><v-icon large>mdi-play</v-icon></v-btn>
          <v-btn><v-icon large>mdi-stop</v-icon></v-btn>
          <v-btn
            v-for="mode in menuButtonModes"
            :key="mode"
            @click="selectMode(mode)"
          >
            {{ menuButtons[mode].label }}
          </v-btn>
        </v-card>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-row class="d-flex flex-wrap">
          <v-img
            v-for="(bar, index) in bars"
            :key="index"
            class="mb-7"
            max-width="177"
            src="@/assets/singlebar.jpg"
            ><div class="d-flex">
              <v-btn
                small
                fab
                v-if="subButtonStatus.visibility"
                @click="subButtonStatus.executeFunction(bar.barNumber)"
                ><v-icon>{{ subButtonStatus.icon }}</v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <p class="mr-3">{{ bar.barNumber }}</p>
            </div>
          </v-img>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title>Add Bars:</v-card-title>
              <v-card-text>
                <v-text-field label="How many bars?"></v-text-field>
                <v-text-field label="Numerator"></v-text-field>
                <v-select label="Denominator" value="4"></v-select>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false" text color="blue">Cancel</v-btn>
                <v-btn @click="dialog = false" text color="blue">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  name: "TestComponent",
  methods: {
    selectMode(mode) {
      this.subButtonStatus = this.menuButtons[mode].subButtonStatus;
    },
    deleteBar(barNumber) {
      this.bars = this.bars.filter((bar) => {
        return bar.barNumber != barNumber;
      });
    },
    addBar(barNumber) {
      this.bars.push({
        barNumber: this.nextBarNumber,
        bar: this.nextBarNumber,
      });
      this.nextBarNumber++;
    },
    editBar(barNumber) {
      alert(`edit bar number: ${barNumber}`);
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
    this.menuButtons = [];
    const menuButtonsToLoad = [
      // note: (barNumber) => this.addBar(barNumber)    is equivalent to    this.addBar
      // so if we want we can reduce those to just direct references, e.g.
      //  this.initialiseMenuButtons("Add", "add", "mdi-plus-circle", this.addBar),
      this.initialiseMenuButtons("Home", "home", "", (barNumber) => {}),
      this.initialiseMenuButtons("Add", "add", "mdi-plus-circle", this.addBar),
      this.initialiseMenuButtons("Edit", "edit", "mdi-pencil", this.editBar),
      this.initialiseMenuButtons(
        "Delete",
        "delete",
        "mdi-minus-circle",
        this.deleteBar
      ),
    ];

    menuButtonsToLoad.forEach((menuButton) => {
      this.menuButtons[menuButton.mode] = menuButton;
    });
  },
  computed: {
    menuButtonModes() {
      return Object.keys(this.menuButtons);
    },
  },
  data() {
    return {
      menuButtons: [],
      nextBarNumber: 7,
      bars: [
        { barNumber: 1 },
        { barNumber: 2 },
        { barNumber: 3 },
        { barNumber: 4 },
        { barNumber: 5 },
        { barNumber: 6 },
      ],
      subButtonStatus: {},
      dialog: false,
    };
  },
};
</script>
