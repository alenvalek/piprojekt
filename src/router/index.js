import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Dashboard from "../views/Dashboard.vue";
import Contracts from "../views/Contracts.vue";
import EditProfile from "../views/EditProfile.vue";
import EditProduct from "../views/EditProduct.vue";
import Profile from "../views/Profile.vue";
import Info from "../views/Info.vue";
import Payment from "../views/Payment.vue";
import OrderPlaced from "../views/OrderPlaced.vue";
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
		meta: {
			guestReq: true,
		},
	},
	{
		path: "/login",
		name: "Login",
		component: SignIn,
		meta: {
			guestReq: true,
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
		path: "/product/:pid/edit",
		name: "EditProduct",
		component: EditProduct,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/user/:uid",
		name: "Profile",
		component: Profile,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/process_payment/:pid",
		name: "Payment",
		component: Payment,
		meta: {
			authReq: true,
		},
	},
	{
		path: "/thanks",
		name: "Thanks",
		component: OrderPlaced,
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
	} else if (!noUser && to.meta.guestReq) {
		next({ name: "Home" });
	} else {
		next();
	}
});

export default router;
