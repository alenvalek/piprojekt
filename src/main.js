import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth, onAuthStateChanged } from "@/firebase";

Vue.config.productionTip = false;

let app = null;

onAuthStateChanged(auth, (user) => {
	const currentRoute = router.currentRoute;

	if (user) {
		store.commit("updateUser", user);
		store.dispatch("fetchFavorites");
		if (currentRoute.meta.authReq) {
			router.push(currentRoute);
		}
		if (currentRoute.name == "Login") {
			router.push({ name: "Home" });
		}
	} else {
		store.commit("updateUser", null);
		store.dispatch("fetchFavorites");
		if (currentRoute.meta.authReq) {
			router.push({ name: "Login" });
		}
	}
	if (!app) {
		app = new Vue({
			router,
			store,
			vuetify,
			render: (h) => h(App),
		}).$mount("#app");
	}
});
