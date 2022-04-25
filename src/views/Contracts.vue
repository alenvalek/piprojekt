<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" md="10">
				<div class="purple--text text-h3 font-weight-bold">Contracts</div>
				<div class="mt-5 text-h5 font-weight-bold">Your Contracts</div>
				<v-simple-table>
					<thead>
						<tr>
							<th>Order Index</th>
							<th>Product name</th>
							<th>Renting period</th>
							<th>Has been sent</th>
							<th>Has been received</th>
							<th>Has been returned</th>
							<th></th>
						</tr>
					</thead>
					<tbody v-if="contracts && contracts.length > 0">
						<tr v-for="(contract, index) in contracts" :key="contract.id">
							<td>{{ index + 1 }}</td>
							<td>{{ contract.product }}</td>
							<td>{{ contract.rentingPeriod }} days</td>
							<td>
								<v-chip v-if="contract.hasBeenSent" color="success"
									>SENT</v-chip
								>
								<v-btn
									v-else-if="
										!contract.hasBeenSent && contract.seller == currentUser.uid
									"
									color="primary"
									@click="updateContracts('sent', contract.id)"
									>Mark as sent</v-btn
								>
								<v-chip v-else color="error">NOT SENT</v-chip>
							</td>
							<td>
								<v-chip v-if="contract.hasBeenReceived" color="success"
									>RECEIVED</v-chip
								>
								<v-chip v-else-if="!contract.hasBeenSent" color="error"
									>NOT SENT YET</v-chip
								>
								<v-btn
									v-else-if="
										!contract.hasBeenReceived &&
											contract.buyer == currentUser.uid
									"
									color="primary"
									@click="updateContracts('received', contract.id)"
									>Mark as received</v-btn
								>
								<v-chip v-else color="error">NOT RECEIVED</v-chip>
							</td>
							<td>
								<v-chip v-if="contract.hasBeenReturned" color="success"
									>RETURNED</v-chip
								>
								<v-btn
									v-else-if="
										!contract.hasBeenSent && contract.seller == currentUser.uid
									"
									color="primary"
									@click="updateContracts('returned', contract.id)"
									>Mark as returned</v-btn
								>
								<v-chip v-else color="error">NOT RETURNED</v-chip>
							</td>
						</tr>
					</tbody>
				</v-simple-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import {
	query,
	db,
	where,
	getDocs,
	collection,
	updateDoc,
	doc,
} from "@/firebase";
import { mapGetters } from "vuex";

export default {
	name: "Contracts",
	data() {
		return {
			contracts: [],
		};
	},
	async mounted() {
		this.fetchContracts();
	},
	methods: {
		debug() {
			console.log(this.contracts);
		},
		async fetchContracts() {
			try {
				const q = query(
					collection(db, "contracts"),
					where("buyer", "==", this.currentUser.uid)
				);
				const q2 = query(
					collection(db, "contracts"),
					where("seller", "==", this.currentUser.uid)
				);
				const contractsSnapshotBuyer = await getDocs(q);
				const contractsSnapshotSeller = await getDocs(q2);

				let arr = [];
				contractsSnapshotBuyer.forEach((contract) => {
					arr.push({ id: contract.id, ...contract.data() });
				});
				contractsSnapshotSeller.forEach((contract) => {
					arr.push({ id: contract.id, ...contract.data() });
				});
				this.contracts = arr;
			} catch (error) {
				console.log(error);
			}
		},
		async updateContracts(updateType, docID) {
			const docRef = doc(db, "contracts", docID);
			switch (updateType) {
				case "sent":
					await updateDoc(docRef, {
						hasBeenSent: true,
					});
					this.fetchContracts();
					break;
				case "received":
					await updateDoc(docRef, {
						hasBeenReceived: true,
					});
					this.fetchContracts();
					break;
				case "returned":
					await updateDoc(docRef, {
						hasBeenReturned: true,
					});
					this.fetchContracts();
					break;
				default:
					console.log("invalid type");
					break;
			}
		},
	},
	computed: {
		...mapGetters({ currentUser: "user" }),
	},
};
</script>

<style></style>
