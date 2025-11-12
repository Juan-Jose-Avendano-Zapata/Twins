import { initializeApp } from "firebase/app";
import  { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDCNR4Tgg9VKdTzZZT7SMqDdAy_sDlSLks",
    authDomain: "proyecto-final-desarrollo.firebaseapp.com",
    projectId: "proyecto-final-desarrollo",
    storageBucket: "proyecto-final-desarrollo.firebasestorage.app",
    messagingSenderId: "360200459691",
    appId: "1:360200459691:web:37181543b9bddf80ba6eee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };