<template>
	<div>
		<v-app-bar v-if="!user" app dark color="purple darken-2">
			<a class="skip-nav-link" href="#main">skip navigation</a>
			<v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
			<v-btn text :to="{ name: 'Home' }" class="no-active">Rentara</v-btn>
			<v-spacer></v-spacer>
			<v-btn text class="mx-5 no-active" :to="{ name: 'Login' }">Login</v-btn>
			<v-btn
				class="mr-5 no-active"
				color="white black--text"
				:to="{ name: 'Register' }"
				>Sign Up</v-btn
			>
		</v-app-bar>
		<v-app-bar v-else app dark color="purple darken-2">
			<a class="skip-nav-link" href="#main">skip navigation</a>
			<v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
			<v-btn text :to="{ name: 'Home' }" class="no-active">Rentara</v-btn>
			<v-spacer></v-spacer>
			<v-badge
				bordered
				bottom
				color="green accent-4"
				dot
				offset-x="32"
				offset-y="10"
			>
				<v-avatar class="mr-5" size="50"
					><img :src="user.photoURL" alt="John"/></v-avatar
			></v-badge>
			<v-btn color="white" class="mr-5 black--text" @click="logoutUser"
				><span>Log out</span>

				<v-icon right>mdi-exit-to-app</v-icon>
			</v-btn>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" fixed temporary width="20rem">
			<v-list nav dense>
				<v-list-item-group
					v-model="group"
					active-class="deep-purple--text text--accent-4"
				>
					<v-list-item to="/" class="my-2 py-2">
						<v-list-item-icon>
							<v-icon large>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title :to="{ name: 'Home' }" class="text-h6"
							>Home</v-list-item-title
						>
					</v-list-item>

					<v-list-item
						v-if="user"
						:to="{ name: 'Dashboard' }"
						class="my-2 py-2"
					>
						<v-list-item-icon>
							<v-icon large>mdi-account</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="text-h6">Dashboard</v-list-item-title>
					</v-list-item>
					<v-list-item
						v-if="user"
						:to="{ name: 'Contracts' }"
						class="my-2 py-2"
					>
						<v-list-item-icon>
							<v-icon large>mdi-file-document-multiple</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="text-h6">Contracts</v-list-item-title>
					</v-list-item>
					<v-list-item v-if="user" :to="{ name: 'Payment' }" class="my-2 py-2">
						<v-list-item-icon>
							<v-icon large>mdi-currency-usd</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="text-h6">Payment</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { signOut, auth } from "@/firebase";
export default {
	name: "Navbar",
	data: () => ({
		drawer: false,
		group: null,
	}),
	computed: {
		...mapGetters({ user: "user" }),
	},
	methods: {
		async logoutUser() {
			await signOut(auth);
		},
	},
};
</script>
<style lang="scss" scoped>
.skip-nav-link {
	position: absolute;
	padding: 0.5rem 1.5rem;
	background: #a96ec3;
	border-radius: 0.25rem;
	left: 10%;
	text-decoration: none;
	color: white;
	transform: translateY(-200%);
	&:focus {
		transform: translateY(0);
	}
}
</style>
