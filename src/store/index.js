import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      user: null,
   },
   mutations: {
      updateUser(state, payload) {
         state.user = payload;
      },
   },
   getters: {
      user(state) {
         return state.user;
      },
   },
   actions: {},
   modules: {},
});
