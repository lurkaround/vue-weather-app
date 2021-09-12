import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBu5NDRWj9dP8BEmyAUHCbuGzYkPueN1ko',
  authDomain: 'weatherapp-16fbe.firebaseapp.com',
  projectId: 'weatherapp-16fbe',
  storageBucket: 'weatherapp-16fbe.appspot.com',
  messagingSenderId: '100915772622',
  appId: '1:100915772622:web:3df9a91e8a9b8bde66e49f',
};
const app = firebase.initializeApp(firebaseConfig);

export default app.firestore();
