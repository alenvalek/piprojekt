import Vue from "vue";
import Vuex from "vuex";
import {
	doc,
	db,
	arrayUnion,
	arrayRemove,
	getDoc,
	updateDoc,
} from "@/firebase";
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		favorites: [],
	},
	mutations: {
		updateUser(state, payload) {
			state.user = payload;
		},
		updateFavorites(state, payload) {
			state.favorites = payload;
		},
	},
	getters: {
		user(state) {
			return state.user;
		},
		favorites(state) {
			return state.favorites;
		},
	},
	actions: {
		async fetchFavorites({ commit, state }) {
			if (state.user) {
				const userRef = await doc(db, "users", state.user.uid);
				const user = await getDoc(userRef);
				const userFavorites = user.data().favorites || [];
				commit("updateFavorites", userFavorites);
				return;
			}
			commit("updateFavorites", []);
		},
	},
	modules: {},
});
