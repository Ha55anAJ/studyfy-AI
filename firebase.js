// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "studyfyai-f2158.firebaseapp.com",
    projectId: "studyfyai-f2158",
    storageBucket: "studyfyai-f2158.appspot.com",
    messagingSenderId: "449189867854",
    appId: "1:449189867854:web:67ecec8871a74d7ac02e1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
