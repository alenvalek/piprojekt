<template>
	<v-container v-if="!loading">
		<v-row justify="center" align="center">
			<v-col cols="6">
				<Form />
			</v-col>
			<v-col align="right" v-if="!showingFavorites" cols="6">
				<v-btn color="primary" @click="showFavorites">Show favorites</v-btn>
			</v-col>
			<v-col align="right" v-else cols="6">
				<v-btn color="primary" @click="showFavorites">Show all posts</v-btn>
			</v-col>
		</v-row>
		<v-row wrap>
			<v-col cols="12" md="4" v-for="product in products" :key="product.id">
				<renta-card
					:title="product.title"
					:description="product.description"
					:price="Number(product.price)"
					:location="product.location"
					:imageURL="product.imageURL"
					:avgScore="product.avgScore"
					:authorImage="product.imageURL"
					:id="product.id"
				/>
			</v-col>
		</v-row>
	</v-container>
	<v-container v-else fill-height>
		<v-row align="center" justify="center">
			<v-progress-circular
				:size="100"
				indeterminate
				color="primary"
			></v-progress-circular>
		</v-row>
	</v-container>
</template>

<script>
import Form from "@/components/Form";
import RentaCard from "@/components/RentaCard";
import { mapGetters } from "vuex";
import {
	collection,
	onSnapshot,
	db,
	getDocs,
	getDoc,
	doc as docRef,
} from "@/firebase";

export default {
	name: "Home",
	data() {
		return {
			products: [],
			loading: true,
			showingFavorites: false,
			userFavorites: [],
		};
	},
	mounted() {
		this.getListings();
		this.loading = false;
	},
	components: {
		Form,
		RentaCard,
	},
	computed: {
		...mapGetters({ user: "user" }),
	},
	methods: {
		async showFavorites() {
			if (!this.showingFavorites) {
				await this.getFavorites();
				const newArray = this.products.filter((x) =>
					this.userFavorites.includes(x.id)
				);
				this.products = newArray;
				this.showingFavorites = true;
			} else {
				await this.getListings();
				this.showingFavorites = false;
			}
		},
		async getFavorites() {
			const userRef = await docRef(db, "users", this.user.uid);

			const userData = await getDoc(userRef);

			const favorites = userData.data().favorites;
			this.userFavorites = favorites;
		},
		async getListings() {
			onSnapshot(collection(db, "products"), (snapshot) => {
				const products = [];
				snapshot.forEach(async (doc) => {
					let rating = 0;
					const reviews = await getDocs(
						collection(docRef(collection(db, "products"), doc.id), "reviews")
					);
					const userData = await getDoc(
						docRef(db, "users", doc.data().author.uid)
					);
					let reviewAmount = reviews.size;
					let reviewSum = 0;
					if (reviews.size > 0) {
						reviews.forEach((review) => {
							reviewSum += Number(review.data().rating);
						});
						rating = reviewSum / reviewAmount;
						rating = Math.round(rating * 10) / 10;
					}
					this.loading = false;
					products.push({
						id: doc.id,
						avgScore: rating,
						imageURL:
							userData.photoURL ||
							"https://i.pinimg.com/474x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg",
						...doc.data(),
					});
				});
				this.products = products;
			});
		},
	},
};
</script>
