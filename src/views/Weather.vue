<template>
  <h4>turd</h4>
</template>

<script>
import axios from 'axios';
import db from '../firebase/firebaseinit';

export default {
  name: 'weather',
  props: ['APIkey'],
  data() {
    return { forecast: null, currentWeather: null, loading: true };
  },
  created() {
    this.getWeather();
  },
  methods: {
    getWeather() {
      db.collection('cities')
        .where('city', '==', `${this.$route.params.city}`)
        .get()
        .then((docs) =>
          docs.forEach((doc) => {
            this.currentWeather = doc.data().currentWeather;
            axios
              .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${
                  doc.data().currentWeather.coord.lat
                }&lon=${
                  doc.data().currentWeather.coord.lon
                }&exclude=current,minutely,alerts&appid=${this.APIkey}`
              )
              .then((res) => {
                this.forecast = res.data;
              })
              .then(() => {
                this.loading = false;
                console.log(this.forecast);
                console.log(this.currentWeather);
              });
          })
        );
    },
  },
};
</script>

<style lang="scss" scoped>
h4 {
  padding-top: 100px;
}
</style>
