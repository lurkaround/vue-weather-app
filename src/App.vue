<template>
  <div class="main">
    <div v-if="isLoading" class="loading">
      <span></span>
    </div>
    <div v-else class="app">
      <Modal
        v-if="modalOpen"
        v-on:close-modal="toggleModal"
        v-bind:APIkey="APIkey"
        v-bind:cities="cities"
      />
      <Navigation
        class="navigation"
        v-on:add-city="toggleModal"
        v-on:edit-city="toggleEdit"
        :addCityActive="addCityActive"
        :isDay="isDay"
        :isNight="isNight"
      />
      <router-view
        v-bind:cities="cities"
        v-bind:edit="edit"
        v-bind:APIkey="APIkey"
        v-on:is-day="dayTime"
        v-on:is-night="nightTime"
        v-on:reset-days="resetDays"
        :isDay="isDay"
        :isNight="isNight"
        v-on:add-city="toggleModal"
      />
    </div>
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
      isDay: null,
      isNight: null,
      APIkey: process.env.VUE_APP_APIKEY,
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null,
      isLoading: true,
    };
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
  methods: {
    getCityWeather() {
      let firebaseDB = db.collection('cities');

      firebaseDB.onSnapshot((snap) => {
        if (snap.docs.length === 0) this.isLoading = false;
        snap.docChanges().forEach(async (doc) => {
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
                  this.isLoading = false;
                });
            } catch (err) {
              console.error(err);
            }
          } else if (
            doc.type === 'added' &&
            doc.doc.metadata.hasPendingWrites
          ) {
            this.cities.push(doc.doc.data());
          } else if (doc.type === 'removed') {
            this.cities = this.cities.filter(
              (city) => city.city !== doc.doc.data().city
            );
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
    checkRoute() {
      if (this.$route.name === 'AddCity') {
        this.addCityActive = true;
      } else {
        this.addCityActive = false;
      }
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetDays() {
      this.isDay = this.isNight = false;
    },
  },
  watch: {
    $route() {
      this.checkRoute();
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
i {
  cursor: pointer;
}
.day {
  transition: 500ms ease-all;
  background-color: rgb(59, 150, 249);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.night {
  transition: 500ms ease-all;
  background-color: rgb(20, 42, 95);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

.loading {
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid rgba(186, 214, 255, 0.425);
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>
