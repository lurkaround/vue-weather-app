<template>
  <div class="main">
    <Modal
      v-if="modalOpen"
      v-on:close-modal="toggleModal"
      v-bind:APIkey="APIkey"
    />
    <Navigation
      class="navigation"
      v-on:add-city="toggleModal"
      v-on:edit-city="toggleEdit"
    />
    <router-view v-bind:cities="cities" v-bind:edit="edit" />
  </div>
</template>

<script>
import axios from 'axios';
import db from './firebase/firebaseinit';
import Navigation from './components/Navigation';
import Modal from './components/Modal';

export default {
  name: 'App',
  components: {
    Navigation,
    Modal,
  },
  data() {
    return {
      APIkey: process.env.VUE_APP_APIKEY,
      cities: [],
      modalOpen: null,
      edit: null,
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
          console.log(doc.type);
          console.log(doc);
          console.log(doc.doc.metadata.hasPendingWrites);
          if (doc.type === 'added' && !doc.doc.metadata.hasPendingWrites) {
            try {
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${
                  doc.doc.data().city
                }&units=metric&appid=${this.APIkey}`
              );
              const data = res.data;
              firebaseDB
                .doc(doc.doc.id)
                .update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                });
            } catch (err) {
              console.error(err);
            }
          } else if (
            doc.type === 'added' &&
            doc.doc.metadata.hasPendingWrites
          ) {
            this.cities.push(doc.doc.data());
          }
        });
      });
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
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
  position: relative;
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;
  .container {
    padding: 0 20px;
  }
}
</style>
