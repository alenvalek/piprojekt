<template>
   <v-card v-if="!hasReviewed" elevation="10">
      <v-form class="py-1 px-5">
         <div class="text-h6">Leave a review:</div>
         <v-rating
            color="warning"
            background-color="grey"
            hover
            v-model="rating"
         ></v-rating>
         <v-textarea
            counter="100"
            no-resize
            outlined
            placeholder="Write a review"
            v-model="body"
         ></v-textarea>
         <v-layout>
            <v-btn
               dense
               color="primary"
               class="my-3 ml-auto"
               @click="addReview"
            >
               Submit review
            </v-btn>
         </v-layout>
      </v-form>
   </v-card>
   <v-card v-else>
      <div class="text-center text-h5">
         You have already reviewed this product! ❤
      </div>
   </v-card>
</template>

<script>
import { db, doc, collection, addDoc } from '@/firebase';
import { mapGetters } from 'vuex';

export default {
   name: 'ReviewForm',
   data() {
      return {
         rating: 0,
         body: '',
      };
   },
   props: {
      hasReviewed: Boolean,
   },
   computed: {
      ...mapGetters({ user: 'user' }),
   },
   methods: {
      async addReview() {
         const productID = this.$route.params.pid;
         await addDoc(
            collection(doc(collection(db, 'products'), productID), 'reviews'),
            {
               rating: this.rating,
               body: this.body,
               author: {
                  uid: this.user.uid,
                  name: this.user.displayName,
                  photoURL: this.user.photoURL,
               },
            }
         );
      },
   },
};
</script>

<style></style>
