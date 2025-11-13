import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Config app web
const firebaseConfig = {
  apiKey: "AIzaSyDkymHPxt78Lt1zimwkJZsWm4ublWAdemw",
  authDomain: "twins-5083d.firebaseapp.com",
  projectId: "twins-5083d",
  storageBucket: "twins-5083d.firebasestorage.app",
  messagingSenderId: "403169454627",
  appId: "1:403169454627:web:98427d307fd425148d1f96"
};

const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;






// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";
// import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyD12aoxQJcxYNP5kv1teiS15mg5Tw0Tctk",
//   authDomain: "perfiles-3f107.firebaseapp.com",
//   projectId: "perfiles-3f107",
//   storageBucket: "perfiles-3f107.firebasestorage.app",
//   messagingSenderId: "641331398713",
//   appId: "1:641331398713:web:8332cdbbdbf1c9cae6e5e8"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
// export default app;