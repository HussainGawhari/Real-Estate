// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    // apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "mern-estate-8b7a3.firebaseapp.com",
    projectId: "mern-estate-8b7a3",
    storageBucket: "mern-estate-8b7a3.appspot.com",
    messagingSenderId: "380804937308",
    appId: "1:380804937308:web:9a260843b3d65f17b91899",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);