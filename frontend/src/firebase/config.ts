import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Cấu hình Firebase của ứng dụng web
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "qit2902.firebaseapp.com",
  databaseURL: "https://qit2902-default-rtdb.firebaseio.com",
  projectId: "qit2902",
  storageBucket: "qit2902.appspot.com",
  messagingSenderId: "307626611978",
  appId: "1:307626611978:web:7517e6238d1e71e04796f3",
  measurementId: "G-PFKG2S7FBH",
};

// Khởi tạo Firebase
export const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore, Storage và Analytics với API modular
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics };
