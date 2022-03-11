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
						<v-btn
							color="primary"
							class="justify-center"
							@click.prevent="addNewListing"
							>Create a listing</v-btn
						>
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
			title: "",
			description: "",
			location: {
				city: "",
				region: "",
				zip: "",
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
		async addNewListing() {
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
//   id: String,
//   title: String,
//   description: String,
//   location: String,
//   price: Number,
//   liked: Boolean,
</script>

<style></style>
