<template>
	<v-container>
		<v-card>
			<v-card-title>Thanks for shopping!</v-card-title>
			<v-btn :to="{ name: 'Home' }" icon>
				<v-icon size="x-large">mdi-arrow-left</v-icon>
			</v-btn>
		</v-card>
	</v-container>
</template>

<script>
export default {
	name: "OrderPlaced",
	props: {
		orderPlaced: Boolean,
	},
	mounted() {
		setTimeout(() => {
			this.$router.replace({ name: "Home" });
		}, 5000);
	},
};
</script>

<style></style>
