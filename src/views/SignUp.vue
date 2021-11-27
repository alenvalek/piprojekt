<template>
   <v-container>
      <v-form justify="center" align="center" class="mb-10">
         <v-row justify="center" class="mt-10">
            <v-col md="4" sm="9" xsm="9">
               <h2 class="text-center">Kreirajte račun</h2>
               <v-text-field
                  name="firstName"
                  label="Ime"
                  type="text"
                  append-icon="mdi-account"
                  v-model="firstName"
               ></v-text-field>
               <v-text-field
                  name="lastName"
                  type="text"
                  label="Prezime"
                  append-icon="mdi-account"
                  v-model="lastName"
               ></v-text-field>
               <div>
                  <v-menu
                     ref="menu"
                     v-model="menu"
                     :close-on-content-click="false"
                     transition="scale-transition"
                     offset-y
                     min-width="auto"
                  >
                     <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                           v-model="date"
                           label="Datum rođenja"
                           prepend-icon="mdi-calendar"
                           readonly
                           v-bind="attrs"
                           v-on="on"
                        ></v-text-field>
                     </template>
                     <v-date-picker
                        v-model="date"
                        :active-picker.sync="activePicker"
                        :max="
                           new Date(
                              Date.now() -
                                 new Date().getTimezoneOffset() * 60000
                           )
                              .toISOString()
                              .substr(0, 10)
                        "
                        min="1950-01-01"
                        @change="save"
                     ></v-date-picker>
                  </v-menu>
               </div>
               <v-text-field
                  name="email"
                  type="email"
                  label="E-mail"
                  required
                  append-icon="mdi-email"
                  v-model="email"
               ></v-text-field>
               <v-text-field
                  name="password"
                  type="password"
                  label="Lozinka"
                  required
                  append-icon="mdi-lock"
                  v-model="password"
               ></v-text-field>
               <v-text-field
                  name="password2"
                  type="password"
                  label="Potvrdite Lozinku"
                  required
                  append-icon="mdi-lock"
                  v-model="passwordConfirm"
               ></v-text-field>

               <v-checkbox v-model="checkbox">
                  <template v-slot:label>
                     <div>
                        Prihvaćam
                        <v-tooltip bottom>
                           <template v-slot:activator="{ on }">
                              <a
                                 target="_blank"
                                 href="/tos"
                                 @click.stop
                                 v-on="on"
                              >
                                 uvjete korištenja
                              </a>
                           </template>
                           Otvara se u novom prozoru
                        </v-tooltip>
                        i spreman sam se držati pravilnika.
                     </div>
                  </template>
               </v-checkbox>
               <v-btn color="primary" @click.prevent="signUpUser"
                  >Kreiraj račun</v-btn
               >
            </v-col>
         </v-row>
      </v-form>
      <v-row>
         <v-col cols="12" justify="center" align="center">
            <h2>
               Već imaš račun?
               <span
                  ><router-link style="text-decoration: none" to="/login"
                     >Prijavi se</router-link
                  ></span
               >
            </h2>
         </v-col>
      </v-row>

      <v-alert type="error" v-if="error">
         {{ error }}
      </v-alert>
   </v-container>
</template>
<script>
import {
   auth,
   createUserWithEmailAndPassword,
   updateProfile,
   db,
   setDoc,
   doc,
} from '@/firebase';

export default {
   name: 'SignUp',
   data() {
      return {
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         passwordConfirm: '',
         checkbox: false,
         error: '',
         activePicker: null,
         date: null,
         menu: false,
      };
   },
   watch: {
      menu(val) {
         val && setTimeout(() => (this.activePicker = 'YEAR'));
      },
   },
   methods: {
      save(date) {
         this.$refs.menu.save(date);
      },
      clearForm() {
         this.firstName = '';
         this.lastName = '';
         this.email = '';
         this.password = '';
         this.passwordConfirm = '';
         this.checkbox = false;
         this.date = null;
      },
      async signUpUser() {
         try {
            const res = await createUserWithEmailAndPassword(
               auth,
               this.email,
               this.password
            );
            await updateProfile(auth.currentUser, {
               displayName: this.firstName + ' ' + this.lastName,
               photoURL:
                  'https://i.pinimg.com/474x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg',
            });
            const userProfileData = {
               firstName: this.firstName,
               lastName: this.lastName,
               dob: new Date(this.date),
            };

            const userProfile = await setDoc(
               doc(db, 'users', res.user.uid),
               userProfileData
            );

            console.log(userProfile);

            this.clearForm();
         } catch (error) {
            console.log(error);
            this.clearForm();
         }
      },
   },
};
</script>
