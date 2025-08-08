// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // 👈 ADD THIS

const firebaseConfig = {
  apiKey: 'AIzaSyDO1ZLV_n4wR5ruhS6ZXnKZv92uGT1VXhs',
  authDomain: 'trueside-jakarta.firebaseapp.com',
  projectId: 'trueside-jakarta',
  storageBucket: 'trueside-jakarta.appspot.com',
  messagingSenderId: '350550673178',
  appId: '1:350550673178:web:c3bb32f54b418bbdf84ea3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app); // 👈 ADD THIS

export { db, storage }; // 👈 EXPORT BOTH
