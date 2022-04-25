<template>
	<v-dialog max-width="600px">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="success">Add a new listing</v-btn>
		</template>

		<v-card>
			<v-card-title>
				<h2>New Listing</h2>
			</v-card-title>
			<v-card-text>
				<v-form class="px-3">
					<v-text-field
						outlined
						label="Name of the product"
						v-model="title"
					></v-text-field>
					<v-textarea
						outlined
						counter="100"
						label="Description of the product"
						v-model="description"
					></v-textarea>
					<v-text-field
						outlined
						label="Adress line"
						v-model="location.adressLine"
					></v-text-field>
					<v-text-field
						outlined
						label="City"
						v-model="location.city"
					></v-text-field>
					<v-text-field
						outlined
						label="State/Province/Region"
						v-model="location.region"
					></v-text-field>
					<v-text-field
						outlined
						label="ZIP / Postal Code"
						v-model="location.zip"
					></v-text-field>
					<v-text-field
						outlined
						label="Country"
						v-model="location.country"
					></v-text-field>
					<v-file-input
						outlined
						prepend-icon=""
						prepend-inner-icon="mdi-camera"
						label="Picture of the product"
						@change="previewImage"
						v-model="image"
						accept="image/*"
					></v-file-input>
					<v-text-field
						outlined
						type="number"
						label="Price of a day's worth of rent"
						v-model="price"
					></v-text-field>
					<v-row justify="center">
						<v-col cols="12" align="center">
							<v-btn
								color="primary"
								class="justify-center"
								@click.prevent="addNewListing"
								>Create a listing</v-btn
							>
						</v-col>
						<v-col cols="12" align="center">
							<v-alert v-if="errorVisible" type="error"
								>All fields must be filled or your fields are too
								short!</v-alert
							>
							<v-alert v-if="successVisible" type="success"
								>You successfully published a new listing</v-alert
							>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import {
	storage,
	uploadBytes,
	ref,
	addDoc,
	collection,
	db,
	getDownloadURL,
	updateDoc,
} from "@/firebase";
import { mapGetters } from "vuex";
import { v4 as uuid } from "uuid";

export default {
	name: "Form",
	data() {
		return {
			errorVisible: false,
			successVisible: false,
			title: "",
			description: "",
			location: {
				city: "",
				region: "",
				zip: "",
				country: "",
				adressLine: "",
			},
			image: null,
			imageURL: "",
			price: 0,
			liked: false,
		};
	},
	computed: {
		...mapGetters({
			user: "user",
		}),
	},
	methods: {
		clearForm() {
			this.title = "";
			this.description = "";
			this.location.city = "";
			this.location.region = "";
			this.location.zip = "";
			this.location.adressLine = "";
			this.location.country = "";
			this.imageURL = "";
			this.image = null;
			this.price = 0;
		},
		async addNewListing() {
			if (
				this.title.length < 3 ||
				this.description.length < 3 ||
				this.location.city.length < 3 ||
				this.location.region.length < 3 ||
				this.location.country.length < 3 ||
				this.location.adressLine.length < 3 ||
				this.price < 1 ||
				!this.image
			) {
				this.errorVisible = true;
				this.clearForm();
				return;
			}
			const newProduct = {
				title: this.title,
				description: this.description,
				location: {
					city: this.location.city,
					region: this.location.region,
					country: this.location.country,
					adressLine: this.location.adressLine,
				},
				price: this.price,
				author: {
					uid: this.user.uid,
					displayName: this.user.displayName,
					photoURL: this.user.photoURL,
				},
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};
			const docRef = await addDoc(collection(db, "products"), newProduct);
			if (this.image) {
				const imageName = uuid();
				const storageRef = ref(
					storage,
					`users/${this.user.uid}/products/${docRef.id}/${imageName}`
				);

				await uploadBytes(storageRef, this.image);
				const downloadUrl = await getDownloadURL(storageRef);

				newProduct.imageURL = downloadUrl;
				await updateDoc(docRef, {
					imageURL: downloadUrl,
				});

				this.successVisible = true;
				this.clearForm();
				setTimeout(() => {
					this.successVisible = false;
				}, 3000);
			}
		},
		previewImage() {
			if (this.image != null) {
				this.imageURL = URL.createObjectURL(this.image);
			} else {
				this.imageURL = "";
			}
		},
	},
};
</script>

<style></style>
