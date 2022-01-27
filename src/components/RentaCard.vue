<template>
  <v-card class="mx-auto mt-5" max-width="400px">
    <v-img
      height="200px"
      class="white--text align-end"
      :src="imageURL ? `${imageURL}` : 'https://i.imgur.com/my4UsTF.jpeg'"
    >
      <v-card-title>{{ title }}</v-card-title>
    </v-img>
    <v-card-text class="text--primary">
      <div>
        <v-icon dense>mdi-map-marker</v-icon>
        <span>{{ location.city }}, {{ location.country }}</span>
      </div>

      <div>
        {{ description }}
      </div>
      <div class="rating" v-if="avgScore > 0">
        <v-icon large color="amber">mdi-star</v-icon>
        <p class="text--primary font-weight-bold text-h5">{{ avgScore }}</p>
      </div>
      <div class="rating" v-else>
        <p class="text--primary font-weight-bold text-h5">No reviews yet</p>
      </div>
    </v-card-text>
    <v-card-text class="text--primary font-weight-bold text-h5">
      <v-row justify="space-between">
        <div class="mx-2">{{ price }}$ / day</div>
        <v-card-actions>
          <v-btn icon class="mx-2" @click="addToFavorites">
            <v-icon :color="isFavorite ? 'red' : 'grey'" large
              >mdi-heart</v-icon
            >
          </v-btn>
          <v-btn :to="{ name: 'Info', params: { pid: id } }" icon>
            <v-icon large>mdi-information-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card-text>
    <v-btn color="purple" class="white--text" width="100%">Rent</v-btn>
  </v-card>
</template>

<script>
import {
  doc,
  db,
  arrayUnion,
  arrayRemove,
  getDoc,
  updateDoc,
} from "@/firebase";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RentaCard",
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    ...mapGetters({ user: "user", favorites: "favorites" }),
    isFavorite() {
      if (this.favorites.includes(this.id)) {
        return true;
      } else {
        return false;
      }
    },
  },
  props: {
    id: String,
    seller: String,
    title: String,
    description: String,
    location: Object,
    price: Number,
    imageURL: String,
    liked: Boolean,
    avgScore: Number,
  },
  methods: {
    ...mapActions({ updateFavorites: "fetchFavorites" }),
    async addToFavorites() {
      const userRef = await doc(db, "users", this.user.uid);

      const userData = await getDoc(userRef);

      const currentFavorites = userData.data().favorites || [];
      if (currentFavorites.includes(this.id)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(this.id),
        });
        this.updateFavorites();
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(this.id),
        });
        this.updateFavorites();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;
  p {
    margin-top: 1rem;
  }
}
</style>
