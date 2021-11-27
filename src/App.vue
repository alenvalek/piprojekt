<template>
   <v-app>
      <navbar />
      <v-main>
         <router-view />
      </v-main>
   </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
   name: 'App',
   components: {
      Navbar,
   },
   data() {
      return {
         isLoaded: true,
      };
   },
};
</script>
