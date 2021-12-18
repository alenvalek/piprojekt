<template>
   <v-container>
      <v-row align="center" justify="center">
         <v-col cols="12" md="10">
            <div class="purple--text text-h3 font-weight-bold">Contracts</div>
            <div class="mt-5 text-h5 font-weight-bold">Your Contracts</div>
            <v-simple-table>
               <thead>
                  <tr>
                     <th>Product ID</th>
                     <th>Product name</th>
                     <th>Renting period</th>
                     <th>Has been sent</th>
                     <th>Has been returned</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="n in 10" :key="n">
                     <td>{{ n }}</td>
                     <td>Some product</td>
                     <td>{{ n }} days</td>
                     <td>YES</td>
                     <td>NO</td>
                     <td><v-btn color="primary">Mark as complete</v-btn></td>
                  </tr>
               </tbody>
            </v-simple-table>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
export default {
   name: 'Contracts',
};
</script>

<style></style>
