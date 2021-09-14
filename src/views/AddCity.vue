<template>
  <div class="grid">
    <div class="city-link" v-for="(city, index) in cities" :key="index">
      <City v-bind:city="city" />
    </div>
  </div>
</template>

<script>
import City from '../components/City.vue';

export default {
  name: 'AddCity',
  props: ['cities'],
  created() {
    console.log(this.cities);
  },
  components: {
    City,
  },
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  padding-top: 81px;
  background-color: #31363d;
  width: 100%;
  min-height: 100vh;
  @media (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
