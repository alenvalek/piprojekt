<template>
<v-container>
      <v-form justify="center" align="center" class="mb-10">
         <v-row justify="center" class="mt-10">
            <v-col md="4" sm="9" xsm="9">
               <h2 class="text-center">Unesite podatke o placanju</h2>
               <v-text-field
                  name="Broj kartice"
                  label="Broj kartice"
                  type="number"
                  counter ="16"
               ></v-text-field>
               <v-text-field
                  name="Ime i prezime"
                  type="text"
                  label="Ime i prezime"
               ></v-text-field>
               <div>
                  <v-menu
                     ref="menu"
                     :close-on-content-click="false"
                     transition="scale-transition"
                     offset-y
                     min-width="auto"
                  >
                     <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                           label="Datum isteka kartice"
                           readonly
                           v-bind="attrs"
                           v-on="on"
                        ></v-text-field>
                     </template>
                     <v-date-picker
                        :max="
                           new Date(
                              Date.now() -
                                 new Date().getTimezoneOffset() * 60000
                           )
                              .toISOString()
                              .substr(0, 10)
                        "
                        min="1950-01-01"
                     ></v-date-picker>
                  </v-menu>
               </div>
               <v-text-field
                  name="CVC"
                  type="CVC"
                  label="CVC"
                  required
               ></v-text-field>
               
               <v-btn color="primary" @click="payment"
                  >Pay</v-btn>
            </v-col>
         </v-row>
      </v-form>
   </v-container>

</template>

<script>


import { db, doc, getDoc, addDoc, collection, updateDoc, getDocs, onSnapshot} from "@/firebase"; 
import {uid} from "@/firebase"
import { getFirestore } from 'firebase/firestore'
import { mapGetters } from "vuex";

export default {
	name: "pay",
   data () {
      return{
         isRented: false,
         rentedBy: "",
         IDpayment: "",
         uid: "",
         productID: "",
         //id: this.$route.params.pid,
      };
   },
   computed: {
		...mapGetters({
			user: "user",
		}),

	},


methods: {
    async payment() {
            const Payment = {
				isRented: true,
            rentedBy: this.user.uid,
            IDpayment: this.IDpayment
				};
         const docRef = await addDoc(collection(db, "payment"), Payment);

         console.log("document writen with id: ", docRef.id)
      
      },
         async proizvod(){
         
        
         }
         
      },

         
};
      

</script>

<style></style>
