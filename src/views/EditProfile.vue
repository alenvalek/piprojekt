<template>
   <v-container>
      <v-row justify="center">
         <v-col cols="12" md="10" class="mt-5">
            <div class="purple--text text-h3 font-weight-bold">
               Edit Profile
            </div>
            <v-form>
               <v-text-field
                  class="mt-5"
                  outlined
                  label="First Name"
                  value="Alen"
               />
               <v-text-field
                  class=""
                  outlined
                  label="Last Name"
                  value="Valek"
               />
               <v-text-field class="" outlined label="Bio" />
               <v-layout justify-end>
                  <v-btn color="primary">Confirm changes</v-btn>
               </v-layout>
            </v-form>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
export default {
   name: 'EditProfile',
};
</script>

<style></style>
