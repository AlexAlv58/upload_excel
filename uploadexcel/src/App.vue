<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Home Power Logo"
          class="shrink mr-2"
          contain
          :src="require('@/assets/home-power-logo.png')"
          transition="scale-transition"
          width="100"  
          height="100" 
        />


      </div>

      <v-spacer></v-spacer>


    </v-app-bar>

    <v-main>
      <upload/>
    </v-main>
  </v-app>
</template>

<script>

import upload from './components/upload.vue';

export default {
  name: 'App',

  components: {
    upload,
  },

  data: () => ({
    //
  }),
};
</script>
