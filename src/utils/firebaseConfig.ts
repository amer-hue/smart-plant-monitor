// Firebase v9 compat syntax (best for Expo)
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCQkQkaxzxSGiasxFnP245nG4IUbmyoeJM",
  authDomain: "smartplantmonitoringsyst-d8e1c.firebaseapp.com",
  projectId: "smartplantmonitoringsyst-d8e1c",
  storageBucket: "smartplantmonitoringsyst-d8e1c.appspot.com",
  messagingSenderId: "860807603387",
  appId: "1:860807603387:web:a608767503261252d9b59e",
  measurementId: "G-N1F4T8180Q",
};

// Only initialize once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
