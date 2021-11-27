<template>
   <div>
      <v-app-bar v-if="!user" app dark color="purple darken-2">
         <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
         <v-toolbar-title
            class="mx-5"
            style="cursor:pointer;"
            @click="$router.replace({ name: 'Login' })"
            >Login</v-toolbar-title
         >
         <v-toolbar-title
            class="mr-5"
            style="cursor:pointer;"
            @click="$router.replace({ name: 'Register' })"
            >Registracija</v-toolbar-title
         >
         <v-toolbar-title
            @click="$router.replace({ name: 'Home' })"
            style="cursor:pointer"
            >Rentara</v-toolbar-title
         >
      </v-app-bar>
      <v-app-bar v-else app dark color="purple darken-2">
         <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
         <v-avatar class="mr-5" size="50"
            ><img :src="user.photoURL" alt="John"
         /></v-avatar>
         <v-toolbar-title
            class="mr-5"
            style="cursor:pointer;"
            @click="logoutUser"
            >Log Out</v-toolbar-title
         >

         <v-toolbar-title
            @click="$router.replace({ name: 'Home' })"
            style="cursor:pointer;"
            >Rentara</v-toolbar-title
         >
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
         <v-list nav dense>
            <v-list-item-group
               v-model="group"
               active-class="deep-purple--text text--accent-4"
            >
               <v-list-item to="/">
                  <v-list-item-icon>
                     <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title :to="{ name: 'Home' }"
                     >Početna</v-list-item-title
                  >
               </v-list-item>

               <v-list-item
                  :to="user ? { name: 'Dashboard' } : { name: 'Login' }"
               >
                  <v-list-item-icon>
                     <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Račun</v-list-item-title>
               </v-list-item>
            </v-list-item-group>
         </v-list>
      </v-navigation-drawer>
   </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { signOut, auth } from '@/firebase';
export default {
   name: 'Navbar',
   data: () => ({
      drawer: false,
      group: null,
   }),
   computed: {
      ...mapGetters({ user: 'user' }),
   },
   methods: {
      async logoutUser() {
         await signOut(auth);
      },
   },
};
</script>

<style></style>
