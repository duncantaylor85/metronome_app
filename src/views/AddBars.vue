<template>
  <div class="add-bars">
    <h1>Add Bars</h1>
    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <v-img
          v-for="n in bars"
          :key="n"
          class="mb-7"
          max-width="170"
          src="@/assets/singlebar.jpg"
        ></v-img>
        <v-btn @click="dialog = true" fab
          ><v-icon x-large>mdi-plus-circle</v-icon></v-btn
        >
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title>Add Bars:</v-card-title>
            <v-card-text
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
              eos vitae facere. Nesciunt sapiente quisquam rerum minima dolore
              ullam assumenda accusantium, pariatur atque laborum, blanditiis
              nihil. Debitis excepturi animi quos optio dolore nihil sit? Quo
              tempora id doloribus perspiciatis?</v-card-text
            >
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
      dialog: false
    };
  },
  methods: {
    addBar() {
      this.$store.dispatch("addBar");
      this.dialog = false;
    }
  },
  computed: {
    bars() {
      return this.$store.getters.getBars;
    }
  }
};
</script>
