<template>
  <div class="main">
    <Navigation class="navigation"></Navigation>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';
import db from './firebase/firebaseinit';
import Navigation from './components/Navigation';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data() {
    return {
      APIkey: process.env.VUE_APP_APIKEY,
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
          if (doc.type === 'added') {
            try {
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${
                  doc.doc.data().city
                }&appid=${this.APIkey}`
              );
              const data = res.data;
              firebaseDB
                .doc(doc.doc.id)
                .update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                })
                .then(() => {
                  console.log(this.cities);
                });
            } catch (err) {
              console.error(err);
            }
          }
        });
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

.main {
  height: 100vh;
  .navigation {
    z-index: 99;
    position: fixed;
    max-width: 1024px;
    width: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.6);
  }

  .container {
    padding: 0 20px;
  }
}
</style>
