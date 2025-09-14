// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCajnC6CU-3e51ZZC8zwd6qIL5H0YguZY",
  authDomain: "chillout-31def.firebaseapp.com",
  projectId: "chillout-31def",
  storageBucket: "chillout-31def.firebasestorage.app",
  messagingSenderId: "32047788182",
  appId: "1:32047788182:web:10d37c7d241427304f12b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
