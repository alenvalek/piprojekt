<template>
	<v-container class="d-flex justify-center align-center mt-5">
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
						src="https://cdn.vuetifyjs.com/images/john.jpg"
						alt="profile_pic"
					/>
				</v-col>
				<v-col cols="12">
					<div class="text-h3 font-weight-medium">John Doe</div>
				</v-col>
				<v-col cols="12">
					<div class="text-subtitle-1">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea odio
						magni eligendi enim rerum eos saepe blanditiis temporibus. Unde,
						placeat tempora. Nam, omnis nostrum at quia praesentium temporibus
						nesciunt ipsam!
					</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="orange darken-1">mdi-currency-eur</v-icon>
					<div class="text-h5">Products sold: 6</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="red">mdi-heart</v-icon>
					<div class="text-h5">Hearts: {{ heartCount }}</div>
				</v-col>
				<v-col cols="4" class="mt-3">
					<v-icon x-large color="light-blue darken-3">mdi-tag</v-icon>
					<div class="text-h5">Products rented: 9</div>
				</v-col>
				<v-col v-if="heartSent">
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
</template>

<script>
export default {
	name: "Profile",
	data() {
		return {
			heartSent: true,
			heartCount: 2,
		};
	},
	methods: {
		toggleHeart() {
			this.heartSent = !this.heartSent;
			if (!this.heartSent) {
				return this.heartCount++;
			}
			this.heartCount--;
		},
	},
};
</script>

<style scoped lang="scss">
.pfp {
	border: 2px solid #541a6d;
	padding: 0.1em;
	border-radius: 100%;
	object-fit: contain;
}
</style>
