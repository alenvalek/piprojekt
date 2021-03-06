<template>
	<v-container
		v-if="this.fullName && !this.loading"
		class="d-flex justify-center align-center mt-5"
	>
		<v-card
			:elevation="5"
			class="py-5"
			max-width="1000px"
			align="center"
			justify="center"
		>
			<v-row>
				<v-col cols="12">
					<img
						class="pfp"
						:src="
							photoURL ||
								'https://i.pinimg.com/474x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg'
						"
						alt="profile_pic"
					/>
				</v-col>
				<v-col cols="12">
					<div class="text-h3 font-weight-medium">{{ fullName }}</div>
				</v-col>
				<v-col cols="12">
					<div class="text-subtitle-1">
						{{ bio }}
					</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="orange darken-1">mdi-currency-eur</v-icon>
					<div class="text-h5">Products sold: {{ productsSold }}</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="red">mdi-heart</v-icon>
					<div class="text-h5">Hearts: {{ heartCount }}</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="light-blue darken-3">mdi-tag</v-icon>
					<div class="text-h5">Active rents: {{ productCount }}</div>
				</v-col>
				<v-col v-if="!heartSent">
					<v-btn color="primary" class="px-10" outlined @click="toggleHeart"
						><v-icon left>mdi-heart</v-icon>Send a heart</v-btn
					>
				</v-col>
				<v-col v-else>
					<v-btn color="error" class="px-10" outlined @click="toggleHeart"
						><v-icon left>mdi-heart</v-icon>Remove a heart</v-btn
					>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
	<v-container v-else-if="!fullName && loading" fill-height>
		<v-row align="center" justify="center">
			<v-progress-circular
				:size="100"
				indeterminate
				color="primary"
			></v-progress-circular>
		</v-row>
	</v-container>
	<v-container class="d-flex justify-center align-center mt-5" v-else>
		<v-row>
			<v-col cols="12">
				<v-alert type="warning"
					>User you are searching for is nowhere to be found.</v-alert
				>
			</v-col>
			<v-col class="d-flex justify-center align-center" cols="12">
				<img
					style="margin: 0 auto;"
					src="https://c.tenor.com/CmUMr97aNWYAAAAd/kekw.gif"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import {
	getDoc,
	doc,
	db,
	updateDoc,
	arrayUnion,
	arrayRemove,
	collection,
	where,
	getDocs,
	query,
} from "@/firebase";
import { mapGetters } from "vuex";

export default {
	name: "Profile",
	data() {
		return {
			heartSent: false,
			fullName: "",
			bio: "",
			photoURL: "",
			loading: true,
			heartCount: 0,
			productCount: "",
			productsSold: 0,
		};
	},
	mounted() {
		this.fetchProfileDetails();
	},
	computed: {
		...mapGetters({ currentUser: "user" }),
	},
	methods: {
		async fetchProfileDetails() {
			const userID = this.$route.params.uid;
			try {
				const userDoc = await getDoc(doc(db, "users", userID));
				const userData = userDoc.data();
				if (userData) {
					this.fullName = `${userData.firstName} ${userData.lastName}`;
					this.bio = userData.bio || "No bio yet..";
					this.photoURL = userData.photoURL;
					if (userData.hearts) {
						this.heartCount = userData.hearts ? userData.hearts.length : 0;

						if (userData.hearts.includes(this.currentUser.uid)) {
							this.heartSent = true;
						} else {
							this.heartSent = false;
						}
					}
					console.log(userData);

					this.loading = false;
					console.log(this.hearts);
				}
				const prodRef = collection(db, "products");
				const q = query(prodRef, where("author.uid", "==", userID));
				const prodData = await getDocs(q);
				this.productCount = prodData.size || 0;
				const contracts = collection(db, "contracts");
				const q2 = query(contracts, where("seller.uid", "==", userID));
				const contractData = await getDocs(q2);

				this.productsSold = contractData.size || 0;
			} catch (error) {
				console.log(error);
				this.loading = false;
			}
		},
		async toggleHeart() {
			const userID = this.$route.params.uid;

			try {
				const userRef = await doc(db, "users", userID);
				if (!this.heartSent) {
					await updateDoc(userRef, {
						hearts: arrayUnion(this.currentUser.uid),
					});
					this.heartSent = true;
					this.heartCount++;
				} else {
					await updateDoc(userRef, {
						hearts: arrayRemove(this.currentUser.uid),
					});
					this.heartSent = false;
					this.heartCount--;
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>

<style scoped lang="scss">
.pfp {
	border: 2px solid #541a6d;
	padding: 0.1em;
	border-radius: 100%;
	width: 300px;
	height: 300px;
	object-fit: cover;
}
</style>
