<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col v-if="product" cols="12">
				<v-card class="mt-10 mx-auto" max-width="900px" elevation="5">
					<v-img
						:src="product.imageURL || 'https://i.imgur.com/my4UsTF.jpeg'"
						max-height="600px"
						contain
						class="grey lighten-1"
					></v-img>
					<v-layout justify-space-between>
						<div>
							<v-card-title>{{ product.title }}</v-card-title>
							<v-card-text class="text-primary">
								{{ product.description }}
							</v-card-text>
						</div>
						<div class="mx-5 my-5">
							<span class="text-h5 mx-2">{{ product.author.displayName }}</span>
							<v-avatar size="50">
								<img v-if="author" :src="author.photoURL" alt="user" />
							</v-avatar>
						</div>
					</v-layout>
					<v-card-actions v-if="isUserAuthor">
						<v-dialog max-width="fit-content">
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									icon
									class="mb-2 mx-2"
									color="error"
									v-on="on"
								>
									<v-icon large>
										mdi-delete-circle
									</v-icon>
								</v-btn>
							</template>
							<v-card>
								<v-card-title>
									Are you sure you want to delete this listing?
								</v-card-title>
								<v-card-subtitle style="text-align: center;"
									>Click anywhere outside this window to cancel the
									action</v-card-subtitle
								>
								<v-card-actions>
									<v-btn
										color="error"
										style="margin: 0 auto;"
										@click="deleteProduct"
										>Delete the listing</v-btn
									>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-btn
							icon
							class="mb-2 mx-2"
							color="warning"
							@click="navigateToEditPage"
						>
							<v-icon large>
								mdi-pen
							</v-icon>
						</v-btn>
					</v-card-actions>
					<v-btn
						v-if="!isUserAuthor"
						color="purple"
						class="white--text"
						width="100%"
						>Rent</v-btn
					>
					<v-btn
						v-if="isUserAuthor"
						disabled
						color="purple"
						class="white--text"
						width="100%"
						>You can't rent your own product</v-btn
					>
				</v-card>
			</v-col>
			<v-progress-circular
				v-if="!product"
				:size="70"
				:width="7"
				color="purple"
				indeterminate
				class="my-5"
			></v-progress-circular>
		</v-row>
		<review-form
			v-if="user && product"
			:hasReviewed="userAlreadyReviewed"
			:uid="product.author.uid"
			class="my-5"
		/>
		<v-row justify="center" align="center" v-if="product">
			<review-card
				v-for="review in reviews"
				:key="review.id"
				:author="review.author"
				:body="review.body"
				:rating="review.rating"
			/>
		</v-row>
	</v-container>
</template>

<script>
import {
	db,
	doc,
	getDoc,
	deleteDoc,
	deleteObject,
	collection,
	onSnapshot,
	storage,
	ref,
} from "@/firebase";
import { mapGetters } from "vuex";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export default {
	name: "Info",
	components: {
		ReviewCard,
		ReviewForm,
	},
	data() {
		return {
			product: null,
			id: this.$route.params.pid,
			reviews: [],
			author: null,
		};
	},
	mounted() {
		this.getProductInfo();
		this.getProductReviews();
	},
	computed: {
		...mapGetters({ user: "user" }),
		userAlreadyReviewed() {
			return (
				this.reviews.filter((review) => review.author.uid == this.user.uid)
					.length > 0
			);
		},
		isUserAuthor() {
			if (this.user && this.product)
				return this.user.uid == this.product.author.uid;
		},
	},
	methods: {
		navigateToEditPage() {
			if (this.product) {
				this.$router.push({
					name: "EditProduct",
					params: { pid: this.id },
				});
			}
		},
		async getProductInfo() {
			const docRef = doc(db, "products", this.id);
			const docSnap = await getDoc(docRef);
			this.product = docSnap.data();
			const authorRef = doc(db, "users", this.product.author.uid);
			const authorData = await getDoc(authorRef);
			this.author = authorData.data();
		},
		getProductReviews() {
			onSnapshot(
				collection(doc(collection(db, "products"), this.id), "reviews"),
				(snapshot) => {
					const reviews = [];
					snapshot.forEach((doc) => {
						reviews.push({ id: doc.id, ...doc.data() });
					});
					this.reviews = reviews;
				}
			);
		},
		async deleteProduct() {
			const tempProductID = this.id;

			await deleteDoc(doc(db, "products", tempProductID));
			if (this.product.imageURL) {
				const productImageRef = ref(storage, this.product.imageURL);
				await deleteObject(productImageRef);
			}
			this.$router.push({ name: "Home" });
		},
	},
};
</script>

<style></style>
