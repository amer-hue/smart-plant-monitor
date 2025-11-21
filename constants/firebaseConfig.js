// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQkQkaxzxSGiasxFnP245nG4IUbmyoeJM",
  authDomain: "smartplantmonitoringsyst-d8e1c.firebaseapp.com",
  projectId: "smartplantmonitoringsyst-d8e1c",
  storageBucket: "smartplantmonitoringsyst-d8e1c.firebasestorage.app",
  messagingSenderId: "860807603387",
  appId: "1:860807603387:web:a608767503261252d9b59e",
  measurementId: "G-N1F4T8180Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
