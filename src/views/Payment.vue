<template>
	<v-container class="mt-5" ref="pageContainer">
		<v-row>
			<v-col :cols="12">
				<div class="purple--text text-h3 font-weight-bold">
					Process Payment
				</div>
			</v-col>
			<v-col v-if="product" align="center" justify="center" :cols="6">
				<v-card :elevation="2" class="pb-5" width="550px">
					<img
						style="width: 100%"
						:src="product.imageURL"
						:alt="product.name"
					/>
					<v-card-title>{{ product.title }}</v-card-title>
					<v-card-subtitle>X 1</v-card-subtitle>
					<div class="text-h5 font-weight-bold">
						Price: {{ product.price }}$
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
						class="white--text m-1"
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
									<div class="text-h5" style="border: 3px solid black;">
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
				<v-form align="center" justify="center">
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
						v-model="buyerData.address.street"
						label="Street"
						name="street"
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
					<v-btn @click="debug">Click me</v-btn>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { doc, getDoc, db } from "@/firebase";

export default {
	name: "Payment",
	data() {
		return {
			product: null,
			cardNumber: "",
			rawCardNumber: "",
			errorMessage: "",
			isNotValid: false,
			buyerData: {
				firstName: "",
				lastName: "",
				address: {
					street: "",
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
				!this.buyerData.address.street ||
				!this.buyerData.address.country ||
				!this.buyerData.address.zip ||
				!this.buyerData.address.city
			) {
				this.allFieldsError = true;
			} else {
				this.allFieldsError = false;
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
				if (this.validateCardNumber(this.rawCardNumber)) {
					console.log("Validno");
				} else {
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
