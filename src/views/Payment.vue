<template>
	<v-container class="mt-5" ref="pageContainer">
		<v-row justify="center" align="center">
			<v-col :cols="12">
				<div class="purple--text text-h3 font-weight-bold">
					Process Payment
				</div>
			</v-col>
			<v-col v-if="product" align="center" justify="center" :md="6" :xs="12">
				<v-card :elevation="2" class="pb-5" width="550px">
					<img
						style="width: 100%"
						:src="product.imageURL"
						:alt="product.title"
					/>
					<v-card-title>{{ product.title }}</v-card-title>
					<v-card-subtitle>X 1</v-card-subtitle>
					<div class="text-h5 font-weight-bold">
						Price: {{ product.price * rentingPeriod }}$
					</div>
				</v-card>
			</v-col>
			<v-row>
				<v-col align="center" justify="center" :cols="12">
					<v-card
						style="background: linear-gradient(45deg, #311B92, #9198e5)"
						elevation="10"
						width="450px"
						height="270px"
						d-flex
						justify-start
						column
						class="white--text"
						rounded="lg"
					>
						<v-container>
							<v-row>
								<v-row>
									<v-col cols="4">
										<img src="@/assets/chip.png" height="100px" alt="" />
									</v-col>
									<v-col cols="7" align="end">
										<img src="@/assets/visa.png" height="100px" alt="" />
									</v-col>
								</v-row>
								<v-col cols="12">
									<div
										class="text-h5"
										style="border: 3px solid black; background-color: rgb(240, 240, 240); color: rgb(90, 90, 90)"
									>
										{{
											cardNumberHash
												? cardNumberHash
												: "#### - #### - #### - ####"
										}}
									</div>
								</v-col>
								<v-col align="start" cols="6">
									<div
										class="animate-cc text-button grey--text text--lighten-2"
									>
										CARD HOLDER
									</div>
									<div class="animate-cc">
										{{
											buyerData.firstName || buyerData.lastName
												? buyerData.firstName + " " + buyerData.lastName
												: "FULL NAME"
										}}
									</div>
								</v-col>
								<v-col align="end" cols="6">
									<div
										class="animate-cc grey--text text--lighten-2 text-button"
									>
										EXPIRATION DATE
									</div>
									<div class="animate-cc text-right mr-5">
										{{ dateString ? dateString : "MM / YY" }}
									</div>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-col>
			</v-row>
		</v-row>
		<v-row>
			<v-col :cols="12">
				<v-form ref="form" align="center" justify="center">
					<v-text-field
						label="Renting period ( in days )"
						v-model="rentingPeriod"
						required
						:rules="[
							(period) =>
								(period && period > 0) || 'One day is a minimum renting period',
						]"
						clearable
						type="number"
						append-icon="mdi-calendar"
					></v-text-field>
					<v-text-field
						label="Credit Card Number"
						v-model="cardNumber"
						maxlength="19"
						clearable
						:error="isNotValid"
						:error-messages="errorMessage"
						pattern="[0-9]*"
						append-icon="mdi-credit-card"
					></v-text-field>
					<v-text-field
						v-model="buyerData.firstName"
						label="First name"
						name="firstName"
					></v-text-field>
					<v-text-field
						v-model="buyerData.lastName"
						label="Last name"
						name="lastName"
					></v-text-field>
					<div>
						<v-menu
							ref="menu"
							v-model="menu"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							min-width="auto"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="dateString"
									label="Expiration Date"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="cardDate"
								type="month"
								:min="todayDate"
								:active-picker.sync="activePicker"
								@change="save"
							></v-date-picker>
						</v-menu>
					</div>
					<v-text-field
						v-model="buyerData.address.country"
						label="Country"
						name="country"
					></v-text-field>
					<v-text-field
						v-model="buyerData.address.city"
						label="City"
						name="city"
					></v-text-field>
					<v-text-field
						v-model="buyerData.address.addressLine"
						label="Address line"
						name="address"
					></v-text-field>
					<v-text-field
						v-model="buyerData.address.zip"
						label="ZIP Code"
						name="zip"
					></v-text-field>
					<v-btn elevation="2" depressed color="primary" @click="orderProduct"
						>Continue to payment</v-btn
					>
					<v-alert v-if="allFieldsError" class="mt-3" type="error"
						>All fields must be filled out</v-alert
					>
					<!-- <v-btn @click="debug">Click me</v-btn> -->
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { doc, getDoc, db, addDoc, collection } from "@/firebase";
import { mapGetters } from "vuex";

export default {
	name: "Payment",
	data() {
		return {
			product: null,
			cardNumber: "",
			rentingPeriod: 1,
			rawCardNumber: "",
			errorMessage: "",
			isNotValid: false,
			buyerData: {
				firstName: "",
				lastName: "",
				address: {
					addressLine: "",
					zip: "",
					country: "",
					city: "",
				},
			},
			cardDate: null,
			menu: false,
			activePicker: null,
			todayDate: new Date().toISOString().slice(0, 10),
			dateString: "",
			cardNumberHash: "",
			previousCharacterCount: 0,
			allFieldsError: false,
			productID: this.$route.params.pid,
		};
	},
	mounted() {
		this.getProductInfo();
	},
	computed: {
		...mapGetters({ currentUser: "user" }),
	},
	methods: {
		debug() {
			console.log(this.product);
		},
		async getProductInfo() {
			try {
				const docRef = doc(db, "products", this.productID);
				const docSnap = await getDoc(docRef);
				this.product = docSnap.data();
			} catch (error) {
				console.log(error);
			}
		},
		async orderProduct() {
			if (
				!this.cardNumber ||
				!this.buyerData.firstName ||
				!this.buyerData.lastName ||
				!this.buyerData.lastName ||
				!this.buyerData.address.addressLine ||
				!this.buyerData.address.country ||
				!this.buyerData.address.zip ||
				!this.buyerData.address.city ||
				!this.rentingPeriod ||
				this.rentingPeriod < 1
			) {
				this.allFieldsError = true;
			} else {
				this.allFieldsError = false;
				if (this.isNotValid) return;
				try {
					const contractRef = await addDoc(collection(db, "contracts"), {
						buyer: this.currentUser.uid,
						seller: this.product.author.uid,
						product: this.product.title,
						rentingPeriod: this.rentingPeriod,
						deliveryAdress: {
							city: this.buyerData.address.city,
							adressLine: this.buyerData.address.addressLine,
							zip: this.buyerData.address.zip,
						},
						hasBeenSent: false,
						hasBeenReceived: false,
						hasBeenReturned: false,
					});
					const notificationRef = await addDoc(
						collection(db, "notifications"),
						{
							user: this.product.author.uid,
							msg: `An order has been placed for ${this.product.title} for period of ${this.rentingPeriod} days.`,
							opened: false,
						}
					);
					this.$refs.form.reset();
				} catch (error) {
					console.log(error);
					this.$refs.form.reset();
				}
			}
		},
		save(date) {
			this.$refs.menu.save(date);
			this.dateString = this.cardDate.replace("-", " / ");
			this.dateString = this.dateString.slice(2);
		},
		validateCardNumber(number) {
			const regex = new RegExp("^[0-9]{13,19}$");
			if (!regex.test(number)) {
				return false;
			}

			return this.luhnCheck(number);
		},
		// code ref: https://stackoverflow.com/questions/12310837/implementation-of-luhn-algorithm
		// good testing value: 0000-0000-0000-0000
		luhnCheck(val) {
			let checksum = 0; // running checksum total
			let j = 1; // takes value of 1 or 2

			// Process each digit one by one starting from the last
			for (let i = val.length - 1; i >= 0; i--) {
				let calc = 0;
				// Extract the next digit and multiply by 1 or 2 on alternative digits.
				calc = Number(val.charAt(i)) * j;

				// If the result is in two digits add 1 to the checksum total
				if (calc > 9) {
					checksum = checksum + 1;
					calc = calc - 10;
				}

				// Add the units element to the checksum total
				checksum = checksum + calc;

				// Switch the value of j
				if (j == 1) {
					j = 2;
				} else {
					j = 1;
				}
			}

			//Check if it is divisible by 10 or not.
			return checksum % 10 == 0;
		},
	},
	watch: {
		menu(val) {
			val && setTimeout(() => (this.activePicker = "YEAR"));
		},
		cardNumber() {
			this.cardNumberHash = "";
			if (!this.cardNumber) {
				this.cardNumber = "";
			}
			if (this.cardNumber) {
				for (let i = 0; i < this.cardNumber.length; i++) {
					if (
						(this.cardNumberHash.length + 1) % 5 == 0 &&
						this.cardNumberHash.length != 0
					) {
						this.cardNumberHash += "-";
					} else {
						this.cardNumberHash += "#";
					}
				}
			}
			if (this.cardNumber.length > 0) {
				// Card number without dash (-)
				let realNumber = this.cardNumber.replace(/-/gi, "");

				// Generate dashed number
				let dashedNumber = realNumber.match(/.{1,4}/g);

				// Replace the dashed number with the real one
				this.cardNumber = dashedNumber.join("-");
			}
			this.rawCardNumber = this.cardNumber.replace(/-/g, "");
			if (this.rawCardNumber.length == 16) {
				if (!this.validateCardNumber(this.rawCardNumber)) {
					this.errorMessage = "Not a valid card number";
					this.isNotValid = true;
					console.log("Nije validno");
				}
			}
			if (this.cardNumber.length < 16) {
				this.isNotValid = false;
				this.errorMessage = "";
				return;
			}
		},
	},
};
</script>

<style scoped lang="scss">
@keyframes fade-in {
	0% {
		opacity: 0%;
	}
	100% {
		opacity: 100%;
	}
}

.animate-cc {
	animation-name: fade-in;
	animation-duration: 1s;
}
</style>
