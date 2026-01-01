import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// הקונפיגורציה המעודכנת ששלחת
const firebaseConfig = {
  apiKey: "AIzaSyC2QjUvjfALcuoM1xZMVDIXcNpwCG1-tE8",
  authDomain: "saban-system-v2.firebaseapp.com",
  projectId: "saban-system-v2",
  storageBucket: "saban-system-v2.firebasestorage.app",
  messagingSenderId: "670637185194",
  appId: "1:670637185194:web:e897482997e75c110898d3",
  measurementId: "G-9JNS1ZJLDX"
};

// Singleton Pattern: מונע אתחול כפול ב-Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ייצוא השירותים לשאר האפליקציה
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
