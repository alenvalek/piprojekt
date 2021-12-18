<template>
   <v-card class="mx-auto mt-5" max-width="400px">
      <v-img
         height="200px"
         class="white--text align-end"
         :src="imageURL ? `${imageURL}` : 'https://i.imgur.com/my4UsTF.jpeg'"
      >
         <v-card-title>{{ title }}</v-card-title>
      </v-img>
      <v-card-text class="text--primary">
         <div>
            <v-icon dense>mdi-map-marker</v-icon>
            <span>{{ location.city }}, {{ location.country }}</span>
         </div>

         <div>
            {{ description }}
         </div>
      </v-card-text>
      <v-card-text class="text--primary font-weight-bold text-h5">
         <v-row justify="space-between">
            <div class="mx-2">{{ price }}$ / day</div>
            <v-card-actions>
               <v-btn icon class="mx-2">
                  <v-icon :color="liked ? 'red' : 'grey'" large
                     >mdi-heart</v-icon
                  >
               </v-btn>
               <v-btn :to="{ name: 'Info', params: { pid: id } }" icon>
                  <v-icon large>mdi-information-variant</v-icon>
               </v-btn>
            </v-card-actions>
         </v-row>
      </v-card-text>
      <v-btn color="purple" class="white--text" width="100%">Rent</v-btn>
   </v-card>
</template>

<script>
export default {
   name: 'RentaCard',
   data() {
      return {};
   },
   props: {
      id: String,
      seller: String,
      title: String,
      description: String,
      location: Object,
      price: Number,
      imageURL: String,
      liked: Boolean,
   },
};
</script>

<style></style>
