<template>
  <v-app>
    <ControlsAppBar />
    <v-content>
      <v-container fluid>
        <router-view> </router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ControlsAppBar from "./components/ControlsAppBar";

export default {
  name: "App",

  components: {
    ControlsAppBar
  },

  data: () => ({
    //
  })
};
</script>
