import Vue from "vue";
import Vuex from "vuex";
import { doc, db, getDoc } from "@/firebase";
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		favorites: [],
		alert: {
			type: "",
			msg: "",
		},
	},
	mutations: {
		updateUser(state, payload) {
			state.user = payload;
		},
		updateFavorites(state, payload) {
			state.favorites = payload;
		},
		notify(state, payload) {
			const emptyAlert = {
				type: "",
				msg: "",
			};
			state.alert = payload;
			setTimeout(() => {
				state.alert = emptyAlert;
			}, 5000);
		},
	},
	getters: {
		user(state) {
			return state.user;
		},
		favorites(state) {
			return state.favorites;
		},
		alert(state) {
			return state.alert;
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
