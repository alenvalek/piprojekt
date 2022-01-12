<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="10" class="mt-5">
				<div class="purple--text text-h3 font-weight-bold">
					Edit Profile
				</div>
				<div class="ml-2 mt-3 black--text text-h5 font-weight-bold">
					Basic information
				</div>
				<v-alert v-if="alertMessage" type="success">{{ alertMessage }}</v-alert>
				<v-form>
					<v-text-field
						v-model="firstName"
						class="mt-5"
						outlined
						label="First Name"
					/>
					<v-text-field
						v-model="lastName"
						class=""
						outlined
						label="Last Name"
					/>
					<v-text-field v-model="bio" class="" outlined label="Bio" />
				</v-form>
				<div class="ml-2 mt-3 black--text text-h5 font-weight-bold">
					Adress
				</div>
				<v-form>
					<v-text-field
						v-model="adressLine"
						class="mt-5"
						outlined
						label="Adress Line"
					/>
					<v-text-field v-model="country" class="" outlined label="Country" />
					<v-text-field v-model="city" class="" outlined label="City" />
					<v-text-field
						v-model="state"
						class=""
						outlined
						label="State/Region"
					/>
				</v-form>
				<div class="ml-2 mt-3 black--text text-h5 font-weight-bold">
					Security
				</div>
				<v-form>
					<v-text-field
						class="mt-5"
						outlined
						disabled
						value="****************"
						label="Password"
					/>
				</v-form>
				<v-layout justify-end>
					<v-btn color="primary" @click="updateUserData">Confirm changes</v-btn>
				</v-layout>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { doc, getDoc, db, setDoc } from "@/firebase";
import { mapGetters } from "vuex";

export default {
	name: "EditProfile",
	data() {
		return {
			name: "EditProfile",
			firstName: "",
			lastName: "",
			bio: "",
			adressLine: "",
			country: "",
			city: "",
			state: "",
			alertMessage: "",
			alertType: "",
		};
	},
	mounted() {
		this.fetchCurrentUserData();
	},
	computed: {
		...mapGetters({ user: "user" }),
	},
	methods: {
		async fetchCurrentUserData() {
			const userRef = await doc(db, "users", this.user.uid);
			const userSnap = await getDoc(userRef);
			const user = userSnap.data();

			this.firstName = user.firstName;
			this.lastName = user.lastName;
			if (user.bio) {
				this.bio = user.bio;
			} else {
				this.bio = "";
			}
		},
		async updateUserData() {
			const userRef = await doc(db, "users", this.user.uid);
			if (!(this.firstName.length > 2 && this.lastName > 2))
				try {
					await setDoc(userRef, {
						firstName: this.firstName,
						lastName: this.lastName,
						bio: this.bio,
					});
					this.setAlert("You've changed your data.", 2);
				} catch (error) {
					console.log(error);
				}
		},
		setAlert(text, time) {
			const timeToSeconds = time * 1000;
			this.alertMessage = text;
			setTimeout(() => {
				this.alertMessage = "";
			}, timeToSeconds);
		},
	},
};
</script>

<style></style>
