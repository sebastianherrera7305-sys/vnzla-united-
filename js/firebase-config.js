import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA68MFVeqI6_If7UDQRRPszGC-EO-Wt94",
  authDomain: "venezuela-united.firebaseapp.com",
  projectId: "venezuela-united",
  storageBucket: "venezuela-united.firebasestorage.app",
  messagingSenderId: "931614676847",
  appId: "1:931614676847:web:aa216f0bbe3bdf5ebc7a9a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot, query, orderBy, limit };
