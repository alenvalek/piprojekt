<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<v-col :cols="12" align="center">
				<v-card elevation="6" width="900px" class="py-5 px-5">
					<v-card-title class="text-h2">Thanks for shopping! 🤗</v-card-title>
					<v-btn color="primary" :to="{ name: 'Home' }" icon>
						<v-icon size="x-large">mdi-arrow-left</v-icon>
					</v-btn>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "OrderPlaced",
	mounted() {
		setTimeout(() => {
			this.$router.replace({ name: "Home" });
		}, 5000);
	},
};
</script>

<style></style>
