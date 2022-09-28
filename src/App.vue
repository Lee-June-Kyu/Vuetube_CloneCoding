<template>
  <v-app>
    <router-view name="NavBar"></router-view>

    <v-main class="grey lighten-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
