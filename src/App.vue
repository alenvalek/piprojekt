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

<style>
.v-btn--active.no-active::before {
   opacity: 0 !important;
}

/* width */
::-webkit-scrollbar {
   width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
   box-shadow: inset 0 0 5px grey;
   border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
   background: #541a6d;
   border-radius: 5px;
}
</style>
