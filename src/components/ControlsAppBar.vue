<template>
  <div class="controls-app-bar">
    <v-app-bar flat>
      <div class="d-flex">
        <v-card>
          <v-btn><v-icon large>mdi-pause</v-icon></v-btn>
          <v-btn to="/"><v-icon large>mdi-play</v-icon></v-btn>
          <v-btn><v-icon large>mdi-stop</v-icon></v-btn>
          <v-btn to="/add">Add</v-btn>
          <v-btn to="/edit">Edit</v-btn>
          <v-btn to="/delete">Delete</v-btn>
        </v-card>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "ControlsAppBar"
};
</script>
