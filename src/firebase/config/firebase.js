import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };