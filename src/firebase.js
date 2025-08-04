// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBMwPmNPG17DutKpf-zL62kst8zcHG3erg',
  authDomain: 'second-ca30b.firebaseapp.com',
  projectId: 'second-ca30b',
  storageBucket: 'second-ca30b.appspot.com',
  messagingSenderId: '98433866250',
  appId: '1:98433866250:web:85690ff0597d21e8d71df3',
  databaseURL: 'https://second-ca30b-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database };
