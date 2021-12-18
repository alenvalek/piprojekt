<template>
   <v-container>
      <v-row justify="center" align="center">
         <v-col cols="6">
            <Form />
         </v-col>
         <v-col cols="6">TU DODATI NEKI FEATURE ILI PROSIRITI FORMU</v-col>
      </v-row>
      <v-row wrap>
         <v-col cols="12" md="4" v-for="product in products" :key="product.id">
            <renta-card
               :title="product.title"
               :description="product.description"
               :price="Number(product.price)"
               :location="product.location"
               :liked="randomShiet()"
               :imageURL="product.imageURL"
               :id="product.id"
            />
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import Form from '@/components/Form';
import RentaCard from '@/components/RentaCard';
import { collection, onSnapshot, db } from '@/firebase';

export default {
   name: 'Home',
   data() {
      return {
         products: [],
      };
   },
   mounted() {
      this.getListings();
   },
   components: {
      Form,
      RentaCard,
   },
   methods: {
      randomShiet() {
         let randNum = Boolean(Math.round(Math.random()));
         console.log(randNum);
         return randNum;
      },
      getListings() {
         onSnapshot(collection(db, 'products'), (snapshot) => {
            const products = [];
            snapshot.forEach((doc) => {
               products.push({ id: doc.id, ...doc.data() });
            });
            this.products = products;
         });
      },
   },
};
//  id: String,
//   title: String,
//   description: String,
//   location: String,
//   price: Number,
//   liked: Boolean,
</script>
