import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Dashboard from "../views/Dashboard.vue";
import Contracts from "../views/Contracts.vue";
import EditProfile from "../views/EditProfile.vue";
import Info from "../views/Info.vue";
import Payment from "../views/Payment.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/register",
		name: "Register",
		component: SignUp,
	},
	{
		path: "/login",
		name: "Login",
		component: SignIn,
		beforeEnter(to, from, next) { 
			const isUser = store.getters["user"];
			if (to.name == "Login" && isUser) {
				to({ name: "Home" });
			} else {
				next();
			}
		},
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: Dashboard,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/contracts",
		name: "Contracts",
		component: Contracts,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/edit-profile",
		name: "EditProfile",
		component: EditProfile,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/product/:pid",
		name: "Info",
		component: Info,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/process_payment",
		name: "Payment",
		component: Payment,
		meta: {
			authReq: true,
		},
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	const noUser = store.getters["user"] == null;
	if (noUser && to.meta.authReq) {
		next({ name: "Login" });
	} else {
		next();
	}
});

export default router;
