import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBRPlyz9V7e5UFh6o9hSn1J-vXtdRqeOX8",
  authDomain: "astrava-eb8ac.firebaseapp.com",
  projectId: "astrava-eb8ac",
  storageBucket: "astrava-eb8ac.firebasestorage.app",
  messagingSenderId: "72053645726",
  appId: "1:72053645726:web:99ad85e93199e99a5cb68f",
  measurementId: "G-XG77QM28YH"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
