<template>
	<v-col cols="3">
		<v-card class="mx-auto my-5" elevation="3" max-width="400px">
			<v-card-title class="justify-center">
				<v-avatar size="100">
					<v-img
						:src="
							authorImage ||
								'https://i.pinimg.com/474x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg'
						"
					></v-img>
				</v-avatar>
			</v-card-title>
			<v-card-text class="text-h6 text-center">{{ author.name }}</v-card-text>
			<v-card-text class="text-primary">
				{{ body }}
			</v-card-text>
			<div class="text-center">
				<v-rating
					background-color="grey"
					color="warning"
					readonly
					:value="rating"
				></v-rating>
			</div>
		</v-card>
	</v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "ReviewCard",
	computed: {
		...mapGetters({ user: "user" }),
	},
	props: {
		author: Object,
		body: String,
		rating: Number,
		authorImage: String,
	},
};
</script>

<style></style>
