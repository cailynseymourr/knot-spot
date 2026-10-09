// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyi6YojBXlR5sOtbfYGvL50R40lj90wRU",
  authDomain: "knot-spot.firebaseapp.com",
  projectId: "knot-spot",
  storageBucket: "knot-spot.firebasestorage.app",
  messagingSenderId: "443564545064",
  appId: "1:443564545064:web:de9dfe9a730fd26b9ad11d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);