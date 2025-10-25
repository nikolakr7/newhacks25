// src/firebase.example.js  <-- THIS FILE IS PUBLIC
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- THIS IS AN EXAMPLE FILE ---
// 1. Create a file named 'firebase.js' in this /src folder
// 2. Paste this code into it
// 3. Get the real config object from the team lead and paste it below

const firebaseConfig = {
  apiKey: "PASTE_KEY_HERE",
  authDomain: "PASTE_DOMAIN_HERE",
  projectId: "PASTE_ID_HERE",
  storageBucket: "PASTE_BUCKET_HERE",
  messagingSenderId: "PASTE_SENDER_ID_HERE",
  appId: "PASTE_APP_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);