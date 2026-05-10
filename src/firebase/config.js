import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBu7ryT6Pmf1LX3QHOkhptG9OOJ2DhIqKg",
  authDomain: "komorebi-d7045.firebaseapp.com",
  projectId: "komorebi-d7045",
  storageBucket: "komorebi-d7045.firebasestorage.app",
  messagingSenderId: "372040726268",
  appId: "1:372040726268:web:0a30eebc9ffbce8be9c979"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);