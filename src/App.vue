<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';

import db from './firebase/firebaseinit';

export default {
  name: 'App',
  data() {
    return {
      APIkey: process.env.VUE_APP_APIKEY,
      city: 'Berlin',
      cities: [],
    };
  },
  created() {
    this.getCityWeather();
  },
  methods: {
    getCityWeather() {
      let firebaseDB = db.collection('cities');

      firebaseDB.onSnapshot((snap) => {
        snap.docChanges().forEach(async (doc) => {
          console.log(doc);
        });
      });
    },
    getCurrentWeather() {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.APIkey}`
        )
        .then((res) => {
          console.log(res.data);
        });
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
}
</style>
