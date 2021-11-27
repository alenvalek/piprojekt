<template>
   <div>Hi, {{ this.$store.getters['user'].displayName }}</div>
</template>

<script>
export default {
   name: 'Dashboard',
   data() {
      return {
         user: this.$store.getters['user'].displayName,
      };
   },
};
</script>

<style></style>
