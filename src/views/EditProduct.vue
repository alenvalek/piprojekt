<template>
	<v-container class="mt-5">
		<v-alert v-if="alert" type="success">Product updated successfully</v-alert>
		<v-row align="center" justify="center">
			<v-col v-if="!product && loading" cols="12" sm="12" md="8">
				<v-container fill-height>
					<v-row align="center" justify="center">
						<v-progress-circular
							:size="100"
							indeterminate
							color="primary"
						></v-progress-circular>
					</v-row>
				</v-container>
			</v-col>
			<v-col v-else-if="product && !loading" cols="12" sm="12" md="8">
				<div class="purple--text text-h3 font-weight-bold">Edit Product</div>
				<div class="mt-2 text-h5">Product: {{ product.title }}</div>
				<div class="mt-2 text-h5">Unique Identifier: {{ id }}</div>
				<div class="mt-2 text-h5">Last updated: {{ updatedAt }}</div>
			</v-col>
			<v-col v-else cols="12" sm="12" md="8">
				<div class="purple--text text-h3 font-weight-bold">Edit Product</div>
				<div class="mt-2 text-h5 bold">Product not found</div>
			</v-col>
		</v-row>
		<v-row justify="center" align="center">
			<v-col xs="12" sm="12" md="7">
				<v-form class="px-3 mt-10">
					<v-text-field
						outlined
						label="Name of the product"
						v-model="title"
					></v-text-field>
					<v-textarea
						outlined
						counter="100"
						v-model="description"
						label="Description of the product"
					></v-textarea>
					<v-text-field
						outlined
						type="number"
						v-model="price"
						label="Price of a day's worth of rent"
					></v-text-field>
					<v-row justify="center">
						<v-btn
							color="primary"
							class="justify-center"
							@click="updateProductInfo"
							>Update a listing</v-btn
						>
					</v-row>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { doc, getDoc, db, updateDoc } from "@/firebase";
import moment from "moment";
moment.locale("EN");

export default {
	name: "EditProduct",
	data() {
		return {
			loading: true,
			alert: false,
			id: this.$route.params.pid,
			product: null,
			updatedAt: null,
			description: "",
			price: 0,
			title: "",
		};
	},
	async mounted() {
		await this.fetchProductInfo();
		this.loading = false;
	},
	methods: {
		async fetchProductInfo() {
			const docRef = doc(db, "products", this.id);
			const docSnap = await getDoc(docRef);
			this.product = docSnap.data();
			if (this.product) {
				this.title = this.product.title;
				this.price = this.product.price;
				this.description = this.product.description;
				this.updatedAt = moment(
					new Date(this.product.updatedAt),
					"YYYYMMDD"
				).fromNow();
			}
			// assign individual fields for editing
			// location will not be editable => still thinking about this
			// since it may be used for malicious intent
		},
		async updateProductInfo() {
			const docRef = doc(db, "products", this.id);
			await updateDoc(docRef, {
				title: this.title,
				price: this.price,
				description: this.description,
				updatedAt: Date.now(),
			});
			await this.fetchProductInfo();
			this.alert = true;
			setTimeout(() => (this.alert = false), 3000);
		},
	},
};
</script>

<style></style>
