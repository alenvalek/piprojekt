<template>
   <v-container>
      <v-row align="center" justify="center">
         <v-col v-if="product" cols="12">
            <v-card class="mt-10 mx-auto" max-width="900px" elevation="5">
               <v-img
                  :src="product.imageURL"
                  max-height="600px"
                  contain
                  class="grey lighten-1"
               ></v-img>
               <v-layout justify-space-between>
                  <div>
                     <v-card-title>{{ product.title }}</v-card-title>
                     <v-card-text class="text-primary">
                        {{ product.description }}
                     </v-card-text>
                  </div>
                  <div class="mx-5 my-5">
                     <span class="text-h5 mx-2">{{
                        product.author.displayName
                     }}</span>
                     <v-avatar size="50">
                        <img :src="product.author.photoURL" alt="user" />
                     </v-avatar>
                  </div>
               </v-layout>
               <v-card-actions v-if="user.uid == product.author.uid">
                  <v-btn icon class="mb-2 mx-2" color="error">
                     <v-icon large>
                        mdi-delete-circle
                     </v-icon>
                  </v-btn>
                  <v-btn icon class="mb-2 mx-2" color="warning">
                     <v-icon large>
                        mdi-pen
                     </v-icon>
                  </v-btn>
               </v-card-actions>
               <v-btn color="purple" class="white--text" width="100%"
                  >Rent</v-btn
               >
            </v-card>
         </v-col>
         <v-progress-circular
            v-if="!product"
            :size="70"
            :width="7"
            color="purple"
            indeterminate
            class="my-5"
         ></v-progress-circular>
      </v-row>
      <v-row justify="center" align="center">
         <v-col cols="12" md="8">
            <review-form :hasReviewed="userAlreadyReviewed" />
            <review-card
               v-for="review in reviews"
               :key="review.id"
               :author="review.author"
               :body="review.body"
               :rating="review.rating"
            />
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { db, doc, getDoc, collection, onSnapshot } from '@/firebase';
import { mapGetters } from 'vuex';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';

export default {
   name: 'Info',
   components: {
      ReviewCard,
      ReviewForm,
   },
   data() {
      return {
         product: null,
         id: this.$route.params.pid,
         reviews: [],
      };
   },
   mounted() {
      this.getProductInfo();
      this.getProductReviews();
   },
   computed: {
      ...mapGetters({ user: 'user' }),
      userAlreadyReviewed() {
         return (
            this.reviews.filter((review) => review.author.uid == this.user.uid)
               .length > 0
         );
      },
   },
   methods: {
      async getProductInfo() {
         const docRef = doc(db, 'products', this.id);
         const docSnap = await getDoc(docRef);

         this.product = docSnap.data();
      },
      getProductReviews() {
         onSnapshot(
            collection(doc(collection(db, 'products'), this.id), 'reviews'),
            (snapshot) => {
               const reviews = [];
               snapshot.forEach((doc) => {
                  reviews.push({ id: doc.id, ...doc.data() });
               });
               this.reviews = reviews;
            }
         );
      },
   },
};
</script>

<style></style>
