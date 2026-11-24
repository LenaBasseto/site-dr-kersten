import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA6kaLGcnk3C_Q5XdYYktJ2pueVsVD02gY",
  authDomain: "drkersten.firebaseapp.com",
  projectId: "drkersten",
  storageBucket: "drkersten.firebasestorage.app",
  messagingSenderId: "488490942977",
  appId: "1:488490942977:web:570e38d7c773b336f0f600",
  measurementId: "G-3SJMCPGERN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);