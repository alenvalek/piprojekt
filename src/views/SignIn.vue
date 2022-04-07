<template>
	<v-container>
		<v-form>
			<v-row justify="center" class="mt-10">
				<v-col md="4" sm="9" xsm="9">
					<v-alert v-if="error" type="error">{{ error }}</v-alert>
					<h2 class="text-center">Sign In</h2>
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
						label="Password"
						required
						append-icon="mdi-lock"
						v-model="password"
					></v-text-field>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" justify="center" align="center" class="mb-5">
					<v-btn color="primary" @click.prevent="signIn">Login</v-btn>
				</v-col>
			</v-row>
		</v-form>
		<v-row>
			<v-col cols="12" justify="center" align="center">
				<h2>
					Don't have an account yet?
					<span
						><router-link style="text-decoration: none" to="/register"
							>Sign Up</router-link
						></span
					>
				</h2>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { auth, signInWithEmailAndPassword } from "@/firebase";

export default {
	name: "SignIn",
	data() {
		return {
			email: "",
			password: "",
			error: "",
		};
	},
	methods: {
		async signIn() {
			try {
				await signInWithEmailAndPassword(auth, this.email, this.password);
			} catch (error) {
				this.error = error.message;
				console.log(error.message);
				console.log(error.code);
			}
		},
	},
};
</script>
